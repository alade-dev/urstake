/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos } from "../config/aptos";
import { CONTRACT_CONFIG, aptToOctas, octasToApt } from "../config/contract";
import { getExplorerUrl } from "../config/aptos";

// Enhanced cache with rate limiting and circuit breaker for APT staking
const aptCache = {
  protocolStats: null as ProtocolStats | null,
  exchangeRate: null as number | null,
  lastFetchProtocolStats: 0,
  lastFetchExchangeRate: 0,
  lastForceRefresh: 0, // Track last force refresh to prevent rapid calls
  CACHE_DURATION: 30000, // 30 seconds - reasonable cache duration
  EXTENDED_CACHE_DURATION: 300000, // 5 minutes when rate limited
  FORCE_REFRESH_COOLDOWN: 5000, // 5 seconds minimum between force refreshes
  consecutiveFailures: 0,
  lastFailureTime: 0,
  isCircuitOpen: false,
  CIRCUIT_BREAKER_THRESHOLD: 3, // Open circuit after 3 consecutive failures
  CIRCUIT_BREAKER_TIMEOUT: 60000, // Keep circuit open for 1 minute
  MIN_RETRY_DELAY: 5000, // 5 seconds minimum delay after failure
};

export interface StakeResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export interface UnstakeRequest {
  amount: number;
  timestamp: number;
  instant: boolean;
  requestIndex: number;
}

export interface ProtocolStats {
  totalStaked: number;
  totalStakedAPT: number;
  aptPoolValue: number;
  exchangeRate: number;
}

export interface UserStakeInfo {
  stAptBalance: number;
  pendingRequests: number;
}

export const useUrStakeContract = () => {
  const { signAndSubmitTransaction, account } = useWallet();

  // Enhanced rate limit handling helpers for APT staking
  const isRateLimitError = useCallback((error: unknown): boolean => {
    if (error && typeof error === "object") {
      const err = error as { message?: string; status?: number };
      return (
        err?.message?.includes("429") ||
        err?.message?.includes("Too Many Requests") ||
        err?.message?.includes("MonthlyCredit cap") ||
        err?.status === 429
      );
    }
    return false;
  }, []);

  const updateAptCacheOnFailure = useCallback(
    (error: unknown) => {
      const now = Date.now();

      if (isRateLimitError(error)) {
        aptCache.consecutiveFailures += 1;
        aptCache.lastFailureTime = now;

        // Open circuit breaker if too many failures
        if (
          aptCache.consecutiveFailures >= aptCache.CIRCUIT_BREAKER_THRESHOLD
        ) {
          aptCache.isCircuitOpen = true;
          // Circuit breaker opened - this is important for users to know if API is down
          // console.warn(
          //   `APT circuit breaker opened after ${aptCache.consecutiveFailures} consecutive failures`
          // );
        }
      }
    },
    [isRateLimitError]
  );

  const shouldSkipAptApiCall = useCallback((): boolean => {
    const now = Date.now();

    // Check if circuit breaker is open
    if (aptCache.isCircuitOpen) {
      if (now - aptCache.lastFailureTime < aptCache.CIRCUIT_BREAKER_TIMEOUT) {
        return true; // Skip call, circuit still open
      } else {
        // Reset circuit breaker
        aptCache.isCircuitOpen = false;
        aptCache.consecutiveFailures = 0;
        // console.log("APT circuit breaker reset, attempting API calls again");
      }
    }

    // Add progressive delay after failures
    if (aptCache.consecutiveFailures > 0) {
      const delayNeeded = Math.min(
        aptCache.MIN_RETRY_DELAY *
          Math.pow(2, aptCache.consecutiveFailures - 1),
        60000 // Max 1 minute delay
      );

      if (now - aptCache.lastFailureTime < delayNeeded) {
        return true; // Skip call, still in delay period
      }
    }

    return false;
  }, []);

  const resetAptFailureCount = useCallback(() => {
    aptCache.consecutiveFailures = 0;
    aptCache.isCircuitOpen = false;
  }, []);

  // Quick check for available data without any API calls
  const getAvailableAptData = useCallback(() => {
    const hasExchangeRate =
      aptCache.exchangeRate !== null && Number.isFinite(aptCache.exchangeRate);
    const hasProtocolStats =
      aptCache.protocolStats !== null &&
      aptCache.protocolStats.exchangeRate !== undefined &&
      Number.isFinite(aptCache.protocolStats.exchangeRate);

    if (hasExchangeRate && hasProtocolStats) {
      // console.log("📋 APT data available in cache, returning immediately");
      return {
        exchangeRate: aptCache.exchangeRate,
        protocolStats: aptCache.protocolStats,
        isAvailable: true,
      };
    }

    return { isAvailable: false };
  }, []);

  // Clear invalid cache data
  const clearInvalidAptCache = useCallback(() => {
    if (
      aptCache.exchangeRate !== null &&
      !Number.isFinite(aptCache.exchangeRate)
    ) {
      // console.log("Clearing invalid APT exchange rate cache");
      aptCache.exchangeRate = null;
    }
    if (
      aptCache.protocolStats !== null &&
      !Number.isFinite(aptCache.protocolStats.exchangeRate)
    ) {
      // console.log("Clearing invalid APT protocol stats cache");
      aptCache.protocolStats = null;
    }
  }, []);

  // Stake APT tokens
  const stake = async (amount: number): Promise<StakeResult> => {
    if (!account) {
      return { success: false, error: "Wallet not connected" };
    }

    try {
      const amountInOctas = aptToOctas(amount);

      if (amountInOctas < CONTRACT_CONFIG.MIN_STAKE_AMOUNT) {
        return {
          success: false,
          error: `Minimum stake amount is ${octasToApt(
            CONTRACT_CONFIG.MIN_STAKE_AMOUNT
          )} APT`,
        };
      }

      const transaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${CONTRACT_CONFIG.MODULE_ID}::${CONTRACT_CONFIG.FUNCTIONS.STAKE}`,
          functionArguments: [amountInOctas.toString()],
        },
      });

      return {
        success: true,
        txHash: transaction.hash,
      };
    } catch (error) {
      // console.error("Stake error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  // Request unstaking with auto-completion for instant unstaking
  const requestUnstake = async (
    stAptAmount: number,
    instant: boolean = false
  ): Promise<StakeResult> => {
    if (!account) {
      return { success: false, error: "Wallet not connected" };
    }

    try {
      const amountInOctas = aptToOctas(stAptAmount);

      // Create the unstaking request
      const requestTx = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${CONTRACT_CONFIG.MODULE_ID}::${CONTRACT_CONFIG.FUNCTIONS.REQUEST_UNSTAKE}`,
          functionArguments: [amountInOctas.toString(), instant],
        },
      });

      // console.log("Unstaking request created:", requestTx.hash);

      // For instant unstaking, we need to complete it immediately
      if (instant) {
        try {
          // Wait for request transaction to be processed
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Get the latest request index (should be the last one)
          const userInfo = await getUserStakeInfo();
          if (userInfo && userInfo.pendingRequests > 0) {
            const requestIndex = userInfo.pendingRequests - 1;

            // console.log(
            //   `Completing instant unstaking at index ${requestIndex}`
            // );

            const completeTx = await signAndSubmitTransaction({
              sender: account.address,
              data: {
                function: `${CONTRACT_CONFIG.MODULE_ID}::${CONTRACT_CONFIG.FUNCTIONS.COMPLETE_UNSTAKING}`,
                functionArguments: [requestIndex.toString()],
              },
            });

            // console.log("Instant unstaking completed:", completeTx.hash);
            return {
              success: true,
              txHash: completeTx.hash,
            };
          } else {
            // console.warn(
            //   "No pending requests found after creating unstaking request"
            // );
            return {
              success: true,
              txHash: requestTx.hash,
            };
          }
        } catch (completeError) {
          // console.error("Failed to complete instant unstaking:", completeError);
          return {
            success: false,
            error: `Unstaking request created but completion failed: ${
              completeError instanceof Error
                ? completeError.message
                : "Unknown error"
            }`,
          };
        }
      }

      // For regular unstaking, just return the request transaction
      return {
        success: true,
        txHash: requestTx.hash,
      };
    } catch (error) {
      // console.error("Request unstake error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  // Get pending unstaking requests for a user
  const getPendingUnstakingRequests = async (
    userAddress?: string
  ): Promise<UnstakeRequest[]> => {
    const address = userAddress || account?.address?.toString();
    if (!address) {
      return [];
    }

    try {
      // Note: This would require a view function in the contract to get detailed request info
      // For now, we can only get the count from getUserStakeInfo
      const userInfo = await getUserStakeInfo(address);
      if (!userInfo || userInfo.pendingRequests === 0) {
        return [];
      }

      // Create placeholder requests - in a real implementation, you'd need a view function
      // that returns the actual request details
      const requests: UnstakeRequest[] = [];
      for (let i = 0; i < userInfo.pendingRequests; i++) {
        requests.push({
          amount: 0, // Would need to get from contract
          timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // Placeholder
          instant: false, // Would need to get from contract
          requestIndex: i,
        });
      }

      return requests;
    } catch (error) {
      // console.error("Get pending unstaking requests error:", error);
      return [];
    }
  };

  // Complete unstaking for a specific request
  const completeUnstaking = async (
    requestIndex: number
  ): Promise<StakeResult> => {
    if (!account) {
      return { success: false, error: "Wallet not connected" };
    }

    try {
      const transaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${CONTRACT_CONFIG.MODULE_ID}::${CONTRACT_CONFIG.FUNCTIONS.COMPLETE_UNSTAKING}`,
          functionArguments: [requestIndex.toString()],
        },
      });

      return {
        success: true,
        txHash: transaction.hash,
      };
    } catch (error) {
      // console.error("Complete unstaking error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  // Get exchange rate with enhanced rate limiting
  const getExchangeRate = useCallback(
    async (forceRefresh = false): Promise<number> => {
      const now = Date.now();

      // Clear any invalid cached data first
      clearInvalidAptCache();

      // Check if we should skip API calls due to rate limiting (unless force refresh)
      if (!forceRefresh && shouldSkipAptApiCall()) {
        // console.log("Skipping APT exchange rate API call due to rate limiting");
        return aptCache.exchangeRate !== null ? aptCache.exchangeRate : 1.0;
      }

      // Use extended cache duration if we've hit rate limits recently
      const cacheDuration =
        aptCache.consecutiveFailures > 0
          ? aptCache.EXTENDED_CACHE_DURATION
          : aptCache.CACHE_DURATION;

      // Return cached value if still valid (unless force refresh)
      if (
        !forceRefresh &&
        aptCache.exchangeRate !== null &&
        now - aptCache.lastFetchExchangeRate < cacheDuration
      ) {
        // console.log(
        //   "Returning cached APT exchange rate:",
        //   aptCache.exchangeRate
        // );
        return aptCache.exchangeRate;
      }

      try {
        // console.log("Fetching fresh APT exchange rate from contract...");
        const result = (await aptos.view({
          payload: {
            function: `${CONTRACT_CONFIG.MODULE_ID}::${CONTRACT_CONFIG.FUNCTIONS.GET_EXCHANGE_RATE}`,
            functionArguments: [],
          },
        })) as [number, number];

        const [totalStaked, totalStakedAPT] = result;

        if (totalStakedAPT === 0) {
          aptCache.exchangeRate = 1.0; // Initial rate
        } else {
          aptCache.exchangeRate = totalStaked / totalStakedAPT;
        }

        aptCache.lastFetchExchangeRate = now;
        resetAptFailureCount(); // Reset on successful call
        // console.log("Fresh APT exchange rate fetched:", aptCache.exchangeRate);
        return aptCache.exchangeRate;
      } catch (error) {
        // console.warn("Get APT exchange rate error:", error);

        // Check if this is a contract not found/initialized error
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (
          errorMessage.includes("not found") ||
          errorMessage.includes("does not exist") ||
          errorMessage.includes("Resource not found")
        ) {
          // console.warn(
          //   "APT staking contract not deployed or initialized. Using default values."
          // );
          aptCache.exchangeRate = 1.0;
          aptCache.lastFetchExchangeRate = now;
          return 1.0;
        }

        updateAptCacheOnFailure(error);

        return aptCache.exchangeRate !== null ? aptCache.exchangeRate : 1.0;
      }
    },
    [
      shouldSkipAptApiCall,
      updateAptCacheOnFailure,
      resetAptFailureCount,
      clearInvalidAptCache,
    ]
  );

  // Get user stake info
  const getUserStakeInfo = async (
    userAddress?: string
  ): Promise<UserStakeInfo | null> => {
    const address = userAddress || account?.address?.toString();
    if (!address) {
      return null;
    }

    try {
      const result = (await aptos.view({
        payload: {
          function: `${CONTRACT_CONFIG.MODULE_ID}::${CONTRACT_CONFIG.FUNCTIONS.GET_USER_STAKE_INFO}`,
          functionArguments: [address],
        },
      })) as [number, number];

      const [stAptBalance, pendingRequests] = result;

      return {
        stAptBalance: octasToApt(stAptBalance),
        pendingRequests,
      };
    } catch (error) {
      // console.error("Get user stake info error:", error);
      return {
        stAptBalance: 0,
        pendingRequests: 0,
      };
    }
  };

  // Get protocol stats with enhanced rate limiting
  const getProtocolStats = useCallback(
    async (forceRefresh = false): Promise<ProtocolStats> => {
      const now = Date.now();

      // Clear any invalid cached data first
      clearInvalidAptCache();

      // Check if we should skip API calls due to rate limiting (unless force refresh)
      if (!forceRefresh && shouldSkipAptApiCall()) {
        // console.log(
        //   "Skipping APT protocol stats API call due to rate limiting"
        // );
        return (
          aptCache.protocolStats || {
            totalStaked: 0,
            totalStakedAPT: 0,
            aptPoolValue: 0,
            exchangeRate: 1.0,
          }
        );
      }

      // Use extended cache duration if we've hit rate limits recently
      const cacheDuration =
        aptCache.consecutiveFailures > 0
          ? aptCache.EXTENDED_CACHE_DURATION
          : aptCache.CACHE_DURATION;

      // Return cached value if still valid (unless force refresh)
      if (
        !forceRefresh &&
        aptCache.protocolStats !== null &&
        now - aptCache.lastFetchProtocolStats < cacheDuration
      ) {
        // console.log(
        //   "Returning cached APT protocol stats:",
        //   aptCache.protocolStats
        // );
        return aptCache.protocolStats;
      }

      try {
        // console.log("Fetching fresh APT protocol stats from contract...");
        const result = (await aptos.view({
          payload: {
            function: `${CONTRACT_CONFIG.MODULE_ID}::${CONTRACT_CONFIG.FUNCTIONS.GET_PROTOCOL_STATS}`,
            functionArguments: [],
          },
        })) as [number, number, number];

        const [totalStaked, totalStakedAPT, aptPoolValue] = result;
        const exchangeRate =
          totalStakedAPT === 0 ? 1.0 : totalStaked / totalStakedAPT;

        aptCache.protocolStats = {
          totalStaked: octasToApt(totalStaked),
          totalStakedAPT: octasToApt(totalStakedAPT),
          aptPoolValue: octasToApt(aptPoolValue),
          exchangeRate,
        };

        aptCache.lastFetchProtocolStats = now;
        resetAptFailureCount(); // Reset on successful call
        // console.log(
        //   "Fresh APT protocol stats fetched:",
        //   aptCache.protocolStats
        // );
        return aptCache.protocolStats;
      } catch (error) {
        // console.warn("Get APT protocol stats error:", error);

        // Check if this is a contract not found/initialized error
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (
          errorMessage.includes("not found") ||
          errorMessage.includes("does not exist") ||
          errorMessage.includes("Resource not found")
        ) {
          // console.warn(
          //   "APT staking contract not deployed or initialized. Using default values."
          // );
          const defaultStats = {
            totalStaked: 0,
            totalStakedAPT: 0,
            aptPoolValue: 0,
            exchangeRate: 1.0,
          };
          aptCache.protocolStats = defaultStats;
          aptCache.lastFetchProtocolStats = now;
          return defaultStats;
        }

        updateAptCacheOnFailure(error);

        return (
          aptCache.protocolStats || {
            totalStaked: 0,
            totalStakedAPT: 0,
            aptPoolValue: 0,
            exchangeRate: 1.0,
          }
        );
      }
    },
    [
      shouldSkipAptApiCall,
      updateAptCacheOnFailure,
      resetAptFailureCount,
      clearInvalidAptCache,
    ]
  );

  // Helper to get transaction URL
  const getTxUrl = (txHash: string) => {
    return getExplorerUrl(txHash);
  };

  // Get transaction history for a user
  const getTransactionHistory = useCallback(
    async (userAddress?: string): Promise<any[]> => {
      const address = userAddress || account?.address?.toString();
      if (!address) {
        return [];
      }

      try {
        // Fetch account transactions from Aptos
        const transactions = await aptos.getAccountTransactions({
          accountAddress: address,
          options: {
            limit: 100,
          },
        });

        // Filter for stake-related transactions
        const stakeTransactions = transactions.filter((tx: any) => {
          if (tx.type !== "user_transaction") return false;

          const payload = tx.payload;
          if (!payload || payload.type !== "entry_function_payload")
            return false;

          // Check if transaction is related to our contract
          return payload.function?.includes(CONTRACT_CONFIG.MODULE_ID);
        });

        // Parse transactions to extract amounts from events
        const parsedTransactions = stakeTransactions.map((tx: any) => {
          const payload = tx.payload;
          const functionName = payload?.function || "";
          const args = payload?.arguments || [];

          // Extract amount from function arguments (usually first argument)
          let amount = "0";
          let stTokensReceived = "0";
          let aptToReceive = "0";

          if (args.length > 0) {
            // Amount is typically in octas, convert to APT
            const amountInOctas = parseInt(args[0]) || 0;
            amount = (amountInOctas / 100000000).toFixed(6); // Convert from octas to APT

            // For staking, calculate stAPT received (assuming 1:1 for simplicity)
            if (
              functionName.includes("stake") &&
              !functionName.includes("unstake")
            ) {
              stTokensReceived = amount;
            }

            // For unstaking, the amount is in stAPT, calculate APT to receive
            if (functionName.includes("unstake")) {
              aptToReceive = amount;
            }
          }

          // Try to parse events for more accurate amounts
          if (tx.events && Array.isArray(tx.events)) {
            tx.events.forEach((event: any) => {
              if (event.type?.includes("StakeEvent")) {
                const eventData = event.data;
                if (eventData.amount) {
                  amount = (parseInt(eventData.amount) / 100000000).toFixed(6);
                }
                if (eventData.stapt_minted) {
                  stTokensReceived = (
                    parseInt(eventData.stapt_minted) / 100000000
                  ).toFixed(6);
                }
              }
              if (event.type?.includes("UnstakeRequestEvent")) {
                const eventData = event.data;
                if (eventData.amount) {
                  amount = (parseInt(eventData.amount) / 100000000).toFixed(6);
                  aptToReceive = amount; // For unstaking, amount is what will be received
                }
              }
            });
          }

          return {
            ...tx,
            parsedAmount: amount,
            stTokensReceived,
            aptToReceive,
          };
        });

        return parsedTransactions;
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        return [];
      }
    },
    [account]
  );

  // Get APT/USD price from contract (cached price)
  const getAptPrice = useCallback(async (): Promise<number> => {
    try {
      const response = await aptos.view({
        payload: {
          function: `${CONTRACT_CONFIG.MODULE_ADDRESS}::urstake::get_apt_usd_price_cached`,
          functionArguments: [],
        },
      });

      if (response && Array.isArray(response) && response.length >= 2) {
        const price = response[0] as number;
        const decimals = response[1] as number;

        // Convert from contract decimals to actual price
        return price / Math.pow(10, decimals);
      }

      // Fallback to external price service if contract fails
      const { getAptPrice: getExternalPrice } = await import(
        "../utils/priceService"
      );
      return await getExternalPrice();
    } catch (error) {
      console.error("Error fetching APT price from contract:", error);

      // Fallback to external price service
      try {
        const { getAptPrice: getExternalPrice } = await import(
          "../utils/priceService"
        );
        return await getExternalPrice();
      } catch (fallbackError) {
        console.error("Error fetching APT price from external service:", error);
        return 0; // Ultimate fallback
      }
    }
  }, []);

  // Force refresh function to bypass cache
  const forceRefreshAptData = useCallback(async () => {
    const now = Date.now();

    // Prevent rapid force refresh calls
    if (now - aptCache.lastForceRefresh < aptCache.FORCE_REFRESH_COOLDOWN) {
      console.log("⏰ Force refresh on cooldown, using cached data");
      return {
        exchangeRate: aptCache.exchangeRate || 1.0,
        protocolStats: aptCache.protocolStats || {
          totalStaked: 0,
          totalStakedAPT: 0,
          aptPoolValue: 0,
          exchangeRate: 1.0,
        },
      };
    }

    console.log(
      "🔄 Force refreshing APT data - clearing cache and fetching fresh..."
    );

    aptCache.lastForceRefresh = now;

    // Clear all cache first
    aptCache.exchangeRate = null;
    aptCache.protocolStats = null;
    aptCache.lastFetchExchangeRate = 0;
    aptCache.lastFetchProtocolStats = 0;
    aptCache.consecutiveFailures = 0;
    aptCache.isCircuitOpen = false;
    aptCache.lastFailureTime = 0;

    try {
      const [exchangeRate, protocolStats] = await Promise.all([
        getExchangeRate(true),
        getProtocolStats(true),
      ]);
      console.log("✅ Force refresh completed:", {
        exchangeRate,
        protocolStats,
      });
      return { exchangeRate, protocolStats };
    } catch (error) {
      console.error("❌ Force refresh failed:", error);
      throw error;
    }
  }, [getExchangeRate, getProtocolStats]);

  return {
    stake,
    requestUnstake,
    completeUnstaking,
    getPendingUnstakingRequests,
    getExchangeRate,
    getUserStakeInfo,
    getProtocolStats,
    forceRefreshAptData,
    clearInvalidAptCache,
    getAvailableAptData,
    getTransactionHistory,
    getAptPrice,
    getTxUrl,
    connected: !!account,
    address: account?.address?.toString(),
  };
};
