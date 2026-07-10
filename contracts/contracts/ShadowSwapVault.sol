// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {Nox, euint256, externalEuint256, ebool} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @dev Minimal Uniswap v3 SwapRouter02 surface used at settlement.
interface ISwapRouter02 {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params)
        external
        payable
        returns (uint256 amountOut);
}

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title ShadowSwapVault
 * @notice Confidential batched swaps on top of *unmodified* Uniswap v3.
 *
 * Users deposit a public ERC-20 into a shared pool, then submit **encrypted**
 * swap orders. Individual order amounts, per-user balances and per-user output
 * shares are stored as Nox encrypted handles (euint256) and never appear in
 * plaintext on-chain. Only the **aggregate** amount for an epoch is revealed
 * (via Nox public decryption), which is what settles as a single Uniswap swap —
 * so an observer sees one anonymous net trade, not who ordered what.
 *
 * Flow:
 *   1. deposit(amount)                    — public transfer, encrypted balance credit
 *   2. submitOrder(encAmount, proof)      — encrypted intent, debits encrypted balance
 *   3. requestSettlement()                — mark the epoch aggregate publicly decryptable
 *   4. settleEpoch(netAmountIn, minOut)   — keeper passes the decrypted aggregate; ONE
 *                                           Uniswap swap; pro-rata shares credited (encrypted)
 *   5. requestClaim() / finalizeClaim()   — reveal caller's own output, then withdraw
 *
 * The keeper (owner) only ever learns aggregates and per-user amounts the user
 * themselves chose to reveal for withdrawal — never the full order book.
 */
contract ShadowSwapVault is Ownable, ReentrancyGuard {
    ISwapRouter02 public immutable swapRouter;
    IERC20 public immutable tokenIn; // e.g. WETH
    IERC20 public immutable tokenOut; // e.g. USDC
    uint24 public immutable poolFee; // e.g. 3000 (0.3%)

    uint256 public currentEpoch;
    uint256 public minBatchSize = 2; // k-anonymity: never settle a batch that de-anonymizes

    struct Order {
        address user;
        euint256 amountIn; // PRIVATE encrypted order amount
    }

    mapping(uint256 => Order[]) private _orders;
    mapping(uint256 => euint256) private _epochTotalIn; // PRIVATE encrypted aggregate per epoch
    mapping(uint256 => bool) public settled;

    mapping(address => euint256) private _encDepositIn; // PRIVATE encrypted deposited balance
    mapping(address => euint256) private _encOut; // PRIVATE encrypted claimable output

    event Deposited(address indexed user, uint256 amount);
    event OrderSubmitted(address indexed user, uint256 indexed epoch);
    event RevealRequested(uint256 indexed epoch);
    event EpochSettled(uint256 indexed epoch, uint256 netAmountIn, uint256 amountOut);
    event ClaimRevealRequested(address indexed user);
    event Claimed(address indexed user, uint256 amount);

    constructor(address router, address tokenIn_, address tokenOut_, uint24 fee)
        Ownable(msg.sender)
    {
        require(router != address(0) && tokenIn_ != address(0) && tokenOut_ != address(0), "zero addr");
        swapRouter = ISwapRouter02(router);
        tokenIn = IERC20(tokenIn_);
        tokenOut = IERC20(tokenOut_);
        poolFee = fee;
    }

    // ── internal: encrypted handles default to an uninitialized zero handle ──
    function _ensureInit(euint256 v) private returns (euint256) {
        if (!Nox.isInitialized(v)) {
            v = Nox.toEuint256(0);
        }
        return v;
    }

    // ──────────────────────────────────────────────────────────────────────
    // 1. DEPOSIT — public ERC-20 in, encrypted balance credit
    // ──────────────────────────────────────────────────────────────────────
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "amount=0");
        require(tokenIn.transferFrom(msg.sender, address(this), amount), "transferFrom failed");

        euint256 bal = _ensureInit(_encDepositIn[msg.sender]);
        bal = Nox.add(bal, Nox.toEuint256(amount));
        Nox.allowThis(bal);
        Nox.allow(bal, msg.sender);
        _encDepositIn[msg.sender] = bal;

        emit Deposited(msg.sender, amount);
    }

    // ──────────────────────────────────────────────────────────────────────
    // 2. SUBMIT ORDER — encrypted swap intent, queued for the current epoch
    // ──────────────────────────────────────────────────────────────────────
    /// @param encAmountIn encrypted order amount (produced client-side by the Nox JS SDK)
    /// @param proof        input proof binding the handle to msg.sender
    function submitOrder(externalEuint256 encAmountIn, bytes calldata proof) external {
        euint256 amt = Nox.fromExternal(encAmountIn, proof);
        euint256 bal = _ensureInit(_encDepositIn[msg.sender]);

        // Clamp to available balance entirely on encrypted data: if amt > bal, use 0.
        ebool ok = Nox.le(amt, bal);
        amt = Nox.select(ok, amt, Nox.toEuint256(0));

        bal = Nox.sub(bal, amt);
        Nox.allowThis(bal);
        Nox.allow(bal, msg.sender);
        _encDepositIn[msg.sender] = bal;

        Nox.allowThis(amt);
        _orders[currentEpoch].push(Order({user: msg.sender, amountIn: amt}));

        euint256 total = _ensureInit(_epochTotalIn[currentEpoch]);
        total = Nox.add(total, amt);
        Nox.allowThis(total);
        _epochTotalIn[currentEpoch] = total;

        emit OrderSubmitted(msg.sender, currentEpoch);
    }

    // ──────────────────────────────────────────────────────────────────────
    // 3. REQUEST SETTLEMENT — reveal ONLY the epoch aggregate
    // ──────────────────────────────────────────────────────────────────────
    function requestSettlement() external onlyOwner {
        require(_orders[currentEpoch].length >= minBatchSize, "batch too small");
        Nox.allowPublicDecryption(_epochTotalIn[currentEpoch]);
        emit RevealRequested(currentEpoch);
    }

    // ──────────────────────────────────────────────────────────────────────
    // 4. SETTLE — one public Uniswap swap of the aggregate, private redistribution
    // ──────────────────────────────────────────────────────────────────────
    /// @param netAmountIn the decrypted epoch aggregate (read off-chain by the keeper
    ///                     after requestSettlement, via the Nox handle gateway)
    /// @param minAmountOut Uniswap slippage floor
    function settleEpoch(uint256 netAmountIn, uint256 minAmountOut) external onlyOwner nonReentrant {
        uint256 epoch = currentEpoch;
        require(!settled[epoch], "already settled");
        require(netAmountIn > 0, "net=0");
        Order[] storage orders = _orders[epoch];
        require(orders.length >= minBatchSize, "batch too small");

        // ── ONE aggregate swap on the UNMODIFIED Uniswap router ──
        tokenIn.approve(address(swapRouter), netAmountIn);
        uint256 amountOut = swapRouter.exactInputSingle(
            ISwapRouter02.ExactInputSingleParams({
                tokenIn: address(tokenIn),
                tokenOut: address(tokenOut),
                fee: poolFee,
                recipient: address(this),
                amountIn: netAmountIn,
                amountOutMinimum: minAmountOut,
                sqrtPriceLimitX96: 0
            })
        );

        // ── Pro-rata redistribution, computed on encrypted data ──
        // share_i = amountIn_i * amountOut / totalIn   (each share stays encrypted)
        euint256 total = _epochTotalIn[epoch];
        euint256 encAmountOut = Nox.toEuint256(amountOut);
        uint256 n = orders.length;
        for (uint256 i = 0; i < n; i++) {
            euint256 share = Nox.div(Nox.mul(orders[i].amountIn, encAmountOut), total);
            euint256 cur = _ensureInit(_encOut[orders[i].user]);
            cur = Nox.add(cur, share);
            Nox.allowThis(cur);
            Nox.allow(cur, orders[i].user);
            _encOut[orders[i].user] = cur;
        }

        settled[epoch] = true;
        currentEpoch = epoch + 1;
        emit EpochSettled(epoch, netAmountIn, amountOut);
    }

    // ──────────────────────────────────────────────────────────────────────
    // 5. CLAIM — user reveals their own output, keeper finalizes the transfer
    // ──────────────────────────────────────────────────────────────────────
    function requestClaim() external {
        require(Nox.isInitialized(_encOut[msg.sender]), "nothing to claim");
        Nox.allowPublicDecryption(_encOut[msg.sender]);
        emit ClaimRevealRequested(msg.sender);
    }

    /// @param amount the decrypted claimable output (read off-chain after requestClaim)
    function finalizeClaim(address user, uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "amount=0");
        _encOut[user] = Nox.toEuint256(0);
        Nox.allowThis(_encOut[user]);
        require(tokenOut.transfer(user, amount), "transfer failed");
        emit Claimed(user, amount);
    }

    // ──────────────────────────────────────────────────────────────────────
    // Views — return the caller's own handles (decryptable only via their ACL)
    // ──────────────────────────────────────────────────────────────────────
    function myDepositHandle() external view returns (euint256) {
        return _encDepositIn[msg.sender];
    }

    function myOutHandle() external view returns (euint256) {
        return _encOut[msg.sender];
    }

    function epochTotalHandle(uint256 epoch) external view returns (euint256) {
        return _epochTotalIn[epoch];
    }

    function ordersInEpoch(uint256 epoch) external view returns (uint256) {
        return _orders[epoch].length;
    }

    // ── admin ──
    function setMinBatchSize(uint256 n) external onlyOwner {
        require(n >= 1, "min 1");
        minBatchSize = n;
    }
}
