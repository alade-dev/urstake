import { Network } from "@aptos-labs/ts-sdk";

// UrStake Contract Configuration
export const CONTRACT_CONFIG = {
  // Contract module address
  MODULE_ADDRESS:
    "0x6e61dc7e5a207d5470d195312bf7fd99124dd8593bbb11094a0a145a89c29923",

  // Module name
  MODULE_NAME: "urstake",

  // Full module ID
  MODULE_ID:
    "0x6e61dc7e5a207d5470d195312bf7fd99124dd8593bbb11094a0a145a89c29923::urstake",

  // Network configuration
  NETWORK: Network.TESTNET,

  // Function names
  FUNCTIONS: {
    STAKE: "stake",
    REQUEST_UNSTAKE: "request_unstake",
    COMPLETE_UNSTAKING: "complete_unstaking",
    GET_EXCHANGE_RATE: "get_exchange_rate",
    GET_USER_STAKE_INFO: "get_user_stake_info",
    GET_PROTOCOL_STATS: "get_protocol_stats",
  },

  // Constants
  BASIS_POINTS: 10000,
  MIN_STAKE_AMOUNT: 1000000, // 0.01 APT in octas
  UNSTAKING_DELAY_SECONDS: 604800, // 7 days
} as const;

// USDC Staking Contract Configuration
export const USDC_STAKING_CONFIG = {
  // Contract module address (same as main contract)
  MODULE_ADDRESS:
    "0x6e61dc7e5a207d5470d195312bf7fd99124dd8593bbb11094a0a145a89c29923",

  // Module name
  MODULE_NAME: "usdc_staking",

  // Full module ID
  MODULE_ID:
    "0x6e61dc7e5a207d5470d195312bf7fd99124dd8593bbb11094a0a145a89c29923::usdc_staking",

  // Function names
  FUNCTIONS: {
    STAKE_USDC: "stake_usdc",
    REQUEST_UNSTAKE_USDC: "request_unstake_usdc",
    COMPLETE_UNSTAKING_USDC: "complete_unstaking_usdc",
    CLAIM_REWARDS: "claim_rewards",
    GET_USDC_EXCHANGE_RATE: "get_usdc_exchange_rate",
    GET_USER_USDC_STAKE_INFO: "get_user_usdc_stake_info",
    GET_USDC_PROTOCOL_STATS: "get_usdc_protocol_stats",
    CALCULATE_PENDING_REWARDS: "calculate_pending_rewards",
    BALANCE: "balance",
  },

  // Constants
  BASIS_POINTS: 10000,
  MIN_STAKE_AMOUNT: 1000000, // 1 USDC minimum (6 decimals)
  UNSTAKING_DELAY_SECONDS: 604800, // 7 days
} as const;

// USDC Configuration
const USDC_ADDRESS =
  "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832";

export const USDC_CONFIG = {
  DECIMALS: 6, // USDC uses 6 decimals
  ADDRESS: USDC_ADDRESS,
  TYPE_INFO: {
    get: () => USDC_ADDRESS, // Fungible asset address
  },
  MIN_AMOUNT: 1000000, // 1 USDC minimum (6 decimals)
  MOCK_MODE: false, // Using real USDC fungible asset
};

// USDC Contract Functions (using fungible asset standard)
export const USDC_FUNCTIONS = {
  TRANSFER: `0x1::primary_fungible_store::transfer`,
  BALANCE: `0x1::primary_fungible_store::balance`,
  IS_REGISTERED: `0x1::primary_fungible_store::is_account_registered`,
};

// Helper function to get full function ID
export function getFunctionId(functionName: string): string {
  return `${CONTRACT_CONFIG.MODULE_ID}::${functionName}`;
}

// APT token configuration
export const APT_TOKEN = {
  DECIMALS: 8,
  SYMBOL: "APT",
  NAME: "Aptos Token",
} as const;

// Convert APT to octas
export function aptToOctas(apt: number): number {
  return Math.floor(apt * Math.pow(10, APT_TOKEN.DECIMALS));
}

// Convert octas to APT
export function octasToApt(octas: number): number {
  return octas / Math.pow(10, APT_TOKEN.DECIMALS);
}

// Convert USDC to micro USDC (6 decimals for real USDC)
export function usdcToMicroUsdc(usdc: number): number {
  return Math.floor(usdc * Math.pow(10, USDC_CONFIG.DECIMALS));
}

// Convert micro USDC to USDC (6 decimals for real USDC)
export function microUsdcToUsdc(microUsdc: number): number {
  return microUsdc / Math.pow(10, USDC_CONFIG.DECIMALS);
}
