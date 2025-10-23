import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import path from "path";


dotenv.config(); // Carga el .env aquí directamente

const FUJI_RPC_URL = process.env.AVALANCHE_RPC_URL || "";
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || "";
const SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY || "snowtrace";


// Queremos que artifacts y cache estén dentro del volumen montado: /app/src
const sharedOutputDir = "/app/src/.hardhat";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    fuji: {
      url: FUJI_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 43113,
      timeout: 60000,
      gas: 5000000,
      gasPrice: 225_000_000_000, // 225 gwei
    },
  },

  paths: {
    artifacts: path.join(sharedOutputDir, "artifacts"),
    cache: path.join(sharedOutputDir, "cache"),
  },

  etherscan: {
    apiKey: {
      avalancheFujiTestnet: SNOWTRACE_API_KEY,
    },
    customChains: [
      {
        network: "avalancheFujiTestnet",
        chainId: 43113,
        urls: {
          apiURL: "https://api-testnet.snowtrace.io/api",
          browserURL: "https://testnet.snowtrace.io",
        },
      },
    ],
  },
};

export default config;
