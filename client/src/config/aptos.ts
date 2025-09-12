import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { CONTRACT_CONFIG } from "./contract";

// Create Aptos configuration with API key
const aptosConfig = new AptosConfig({
  network: CONTRACT_CONFIG.NETWORK,
  clientConfig: {
    API_KEY: import.meta.env.VITE_API_KEY || "", // Default key if env var not set
  },
});

// Create Aptos client instance
export const aptos = new Aptos(aptosConfig);

// Helper to get current network name
export const getNetworkName = () => {
  return CONTRACT_CONFIG.NETWORK;
};

// Helper to get explorer URL for transaction
export const getExplorerUrl = (txHash: string) => {
  const network = CONTRACT_CONFIG.NETWORK === "testnet" ? "testnet" : "mainnet";
  return `https://explorer.aptoslabs.com/txn/${txHash}?network=${network}`;
};

// Helper to get explorer URL for account
export const getAccountExplorerUrl = (address: string) => {
  const network = CONTRACT_CONFIG.NETWORK === "testnet" ? "testnet" : "mainnet";
  return `https://explorer.aptoslabs.com/account/${address}?network=${network}`;
};
