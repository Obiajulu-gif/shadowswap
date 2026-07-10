import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

// In Phase 2, add the Nox plugin here:
//   import "@iexec-nox/hardhat-plugin";
// (scaffolded from https://github.com/iExec-Nox/nox-hardhat-starter)

dotenv.config();

const { PRIVATE_KEY, SEPOLIA_RPC_URL, ETHERSCAN_API_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY || "",
  },
};

export default config;
