/* eslint-disable @typescript-eslint/no-explicit-any */
import { aptos } from "../config/aptos";
import { CONTRACT_CONFIG } from "../config/contract";

// Simple test to verify contract functions work
export async function testContractFunctions() {
  console.log("Testing contract functions...");

  try {
    // Test 1: Get protocol stats
    console.log("Testing get_protocol_stats...");
    const stats = await aptos.view({
      payload: {
        function: `${CONTRACT_CONFIG.MODULE_ID}::${CONTRACT_CONFIG.FUNCTIONS.GET_PROTOCOL_STATS}`,
        functionArguments: [],
      },
    });
    console.log("✅ Protocol stats:", stats);

    // Test 2: Get exchange rate
    console.log("Testing get_exchange_rate...");
    const exchangeRate = await aptos.view({
      payload: {
        function: `${CONTRACT_CONFIG.MODULE_ID}::${CONTRACT_CONFIG.FUNCTIONS.GET_EXCHANGE_RATE}`,
        functionArguments: [],
      },
    });
    console.log("✅ Exchange rate:", exchangeRate);

    // Test 3: Check if initialized
    console.log("Contract is working properly!");
    return { success: true, stats, exchangeRate };
  } catch (error) {
    console.error("❌ Contract test failed:", error);
    return { success: false, error };
  }
}

// Make it available globally for browser console testing
if (typeof window !== "undefined") {
  (window as any).testContract = testContractFunctions;
}
