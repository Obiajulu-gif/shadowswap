import "dotenv/config";
import { defineConfig } from "hardhat/config";
import hardhatToolboxViem from "@nomicfoundation/hardhat-toolbox-viem";

// NoxCompute is already deployed on Ethereum Sepolia (see Nox.sol:
// 0x24Ef36Ec5b626D7DCD09a98F3083c2758F0F77bF), so confidential contracts can be
// deployed straight to Sepolia. Local end-to-end testing additionally needs the
// Nox offchain stack via @iexec-nox/nox-hardhat-plugin (Docker) — see README.

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL ?? "https://rpc.sepolia.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

export default defineConfig({
  plugins: [hardhatToolboxViem],
  solidity: {
    version: "0.8.35",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    sepolia: {
      type: "http",
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
});
