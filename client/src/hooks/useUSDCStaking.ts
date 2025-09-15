/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos } from "../config/aptos";
import {
  USDC_STAKING_CONFIG,
  usdcToMicroUsdc,
  microUsdcToUsdc,
} from "../config/contract";
import { getExplorerUrl } from "../config/aptos";

export interface USDCStakeResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export interface USDCUnstakeRequest {
  amount: number;
  timestamp: number;
  instant: boolean;
  requestIndex: number;
}

export interface USDCProtocolStats {
  totalStaked: number;
  totalStUSDCSupply: number;
  usdcPoolValue: number;
  apy: number;
  exchangeRate: number;
}

export interface UserUSDCStakeInfo {
  stUSDCBalance: number;
  pendingRequests: number;
  pendingRewards: number;
}

// Enhanced cache with rate limiting and circuit breaker
const cache = {
  protocolStats: null as USDCProtocolStats | null,
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

export const useUSDCStaking = () => {
  const { signAndSubmitTransaction, account } = useWallet();
  const isInitializedRef = useRef(false);

  // Stake USDC tokens
  const stakeUSDC = async (amount: number): Promise<USDCStakeResult> => {
    if (!account) {
      return { success: false, error: "Wallet not connected" };
    }

    try {
      const amountInMicroUsdc = usdcToMicroUsdc(amount);

      if (amountInMicroUsdc < USDC_STAKING_CONFIG.MIN_STAKE_AMOUNT) {
        return {
          success: false,
          error: `Minimum stake amount is ${microUsdcToUsdc(
            USDC_STAKING_CONFIG.MIN_STAKE_AMOUNT
          )} USDC`,
        };
      }

      // console.log("Staking USDC:", {
      //   amount,
      //   amountInMicroUsdc,
      //   user: account.address.toString(),
      // });

      const transaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${USDC_STAKING_CONFIG.MODULE_ID}::${USDC_STAKING_CONFIG.FUNCTIONS.STAKE_USDC}`,
          functionArguments: [amountInMicroUsdc.toString()],
        },
      });

      return {
        success: true,
        txHash: transaction.hash,
      };
    } catch (error) {
      // console.error("USDC stake error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  // Request unstaking with auto-completion for instant unstaking
  const requestUnstakeUSDC = async (
    stUSDCAmount: number,
    instant: boolean = false
  ): Promise<USDCStakeResult> => {
    if (!account) {
      return { success: false, error: "Wallet not connected" };
    }

    try {
      const amountInMicroUsdc = usdcToMicroUsdc(stUSDCAmount);

      // console.log("Requesting USDC unstaking:", {
      //   stUSDCAmount,
      //   amountInMicroUsdc,
      //   instant,
      //   user: account.address.toString(),
      // });

      // Create the unstaking request
      const requestTx = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${USDC_STAKING_CONFIG.MODULE_ID}::${USDC_STAKING_CONFIG.FUNCTIONS.REQUEST_UNSTAKE_USDC}`,
          functionArguments: [amountInMicroUsdc.toString(), instant],
        },
      });

      // console.log("USDC unstaking request created:", requestTx.hash);

      // For instant unstaking, we need to complete it immediately
      if (instant) {
        try {
          // Wait for request transaction to be processed
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Get the latest request index (should be the last one)
          const userInfo = await getUserUSDCStakeInfo();
          if (userInfo && userInfo.pendingRequests > 0) {
            const requestIndex = userInfo.pendingRequests - 1;

            console.log(
              `Completing instant USDC unstaking at index ${requestIndex}`
            );

            const completeTx = await signAndSubmitTransaction({
              sender: account.address,
              data: {
                function: `${USDC_STAKING_CONFIG.MODULE_ID}::${USDC_STAKING_CONFIG.FUNCTIONS.COMPLETE_UNSTAKING_USDC}`,
                functionArguments: [requestIndex.toString()],
              },
            });

            console.log("Instant USDC unstaking completed:", completeTx.hash);
            return {
              success: true,
              txHash: completeTx.hash,
            };
          } else {
            console.warn(
              "No pending USDC requests found after creating unstaking request"
            );
            return {
              success: true,
              txHash: requestTx.hash,
            };
          }
        } catch (completeError) {
          console.error(
            "Failed to complete instant USDC unstaking:",
            completeError
          );
          return {
            success: false,
            error: `USDC unstaking request created but completion failed: ${
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
      // console.error("Request USDC unstake error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  // Complete unstaking for a specific request
  const completeUSDCUnstaking = async (
    requestIndex: number
  ): Promise<USDCStakeResult> => {
    if (!account) {
      return { success: false, error: "Wallet not connected" };
    }

    try {
      const transaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${USDC_STAKING_CONFIG.MODULE_ID}::${USDC_STAKING_CONFIG.FUNCTIONS.COMPLETE_UNSTAKING_USDC}`,
          functionArguments: [requestIndex.toString()],
        },
      });

      return {
        success: true,
        txHash: transaction.hash,
      };
    } catch (error) {
      // console.error("Complete USDC unstaking error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  // Claim accumulated rewards
  const claimUSDCRewards = async (): Promise<USDCStakeResult> => {
    if (!account) {
      return { success: false, error: "Wallet not connected" };
    }

    try {
      const transaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${USDC_STAKING_CONFIG.MODULE_ID}::${USDC_STAKING_CONFIG.FUNCTIONS.CLAIM_REWARDS}`,
          functionArguments: [],
        },
      });

      return {
        success: true,
        txHash: transaction.hash,
      };
    } catch (error) {
      // console.error("Claim USDC rewards error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  // Enhanced rate limit handling helpers wrapped in useCallback
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

  const updateCacheOnFailure = useCallback(
    (error: unknown) => {
      const now = Date.now();

      if (isRateLimitError(error)) {
        cache.consecutiveFailures += 1;
        cache.lastFailureTime = now;

        // Open circuit breaker if too many failures
        if (cache.consecutiveFailures >= cache.CIRCUIT_BREAKER_THRESHOLD) {
          cache.isCircuitOpen = true;
          console.warn(
            `Circuit breaker opened after ${cache.consecutiveFailures} consecutive failures`
          );
        }
      }
    },
    [isRateLimitError]
  );

  const shouldSkipApiCall = useCallback((): boolean => {
    const now = Date.now();

    // Check if circuit breaker is open
    if (cache.isCircuitOpen) {
      if (now - cache.lastFailureTime < cache.CIRCUIT_BREAKER_TIMEOUT) {
        return true; // Skip call, circuit still open
      } else {
        // Reset circuit breaker
        cache.isCircuitOpen = false;
        cache.consecutiveFailures = 0;
        console.log("Circuit breaker reset, attempting API calls again");
      }
    }

    // Add progressive delay after failures
    if (cache.consecutiveFailures > 0) {
      const delayNeeded = Math.min(
        cache.MIN_RETRY_DELAY * Math.pow(2, cache.consecutiveFailures - 1),
        60000 // Max 1 minute delay
      );

      if (now - cache.lastFailureTime < delayNeeded) {
        return true; // Skip call, still in delay period
      }
    }

    return false;
  }, []);

  const resetFailureCount = useCallback(() => {
    cache.consecutiveFailures = 0;
    cache.isCircuitOpen = false;
  }, []);

  // Quick check for available data without any API calls
  const getAvailableUSDCData = useCallback(() => {
    const hasExchangeRate =
      cache.exchangeRate !== null && Number.isFinite(cache.exchangeRate);
    const hasProtocolStats =
      cache.protocolStats !== null &&
      cache.protocolStats.exchangeRate !== undefined &&
      Number.isFinite(cache.protocolStats.exchangeRate);

    if (hasExchangeRate && hasProtocolStats) {
      console.log("📋 USDC data available in cache, returning immediately");
      return {
        exchangeRate: cache.exchangeRate,
        protocolStats: cache.protocolStats,
        isAvailable: true,
      };
    }

    return { isAvailable: false };
  }, []);

  // Clear invalid cache data
  const clearInvalidCache = useCallback(() => {
    if (cache.exchangeRate !== null && !Number.isFinite(cache.exchangeRate)) {
      console.log("Clearing invalid USDC exchange rate cache");
      cache.exchangeRate = null;
    }
    if (
      cache.protocolStats !== null &&
      !Number.isFinite(cache.protocolStats.exchangeRate)
    ) {
      console.log("Clearing invalid USDC protocol stats cache");
      cache.protocolStats = null;
    }
  }, []);

  // Get USDC exchange rate with enhanced rate limiting
  const getUSDCExchangeRate = useCallback(
    async (forceRefresh = false): Promise<number> => {
      const now = Date.now();

      // Clear any invalid cached data first
      clearInvalidCache();

      // Check if we should skip API calls due to rate limiting (unless force refresh)
      if (!forceRefresh && shouldSkipApiCall()) {
        console.log(
          "Skipping USDC exchange rate API call due to rate limiting"
        );
        return cache.exchangeRate !== null ? cache.exchangeRate : 1.0;
      }

      // Use extended cache duration if we've hit rate limits recently
      const cacheDuration =
        cache.consecutiveFailures > 0
          ? cache.EXTENDED_CACHE_DURATION
          : cache.CACHE_DURATION;

      // Return cached value if still valid (unless force refresh)
      if (
        !forceRefresh &&
        cache.exchangeRate !== null &&
        now - cache.lastFetchExchangeRate < cacheDuration
      ) {
        // Check if cached exchange rate is valid (no NaN)
        if (Number.isFinite(cache.exchangeRate)) {
          console.log(
            "Returning cached USDC exchange rate:",
            cache.exchangeRate
          );
          return cache.exchangeRate;
        } else {
          console.log("Cached USDC exchange rate is NaN, clearing cache...");
          cache.exchangeRate = null; // Clear bad cache
        }
      }

      try {
        console.log("Fetching fresh USDC exchange rate from contract...");
        const result = (await aptos.view({
          payload: {
            function: `${USDC_STAKING_CONFIG.MODULE_ID}::${USDC_STAKING_CONFIG.FUNCTIONS.GET_USDC_EXCHANGE_RATE}`,
            functionArguments: [],
          },
        })) as [number, number];

        const [totalStaked, totalStUSDCSupply] = result;

        // Calculate exchange rate with proper NaN handling
        if (totalStUSDCSupply === 0) {
          cache.exchangeRate = 1.0; // Initial rate when no supply
        } else if (totalStaked === 0) {
          cache.exchangeRate = 1.0; // Fallback when no staking yet
        } else {
          cache.exchangeRate = totalStaked / totalStUSDCSupply;
          // Additional safety check for NaN
          if (!Number.isFinite(cache.exchangeRate)) {
            cache.exchangeRate = 1.0;
          }
        }

        cache.lastFetchExchangeRate = now;
        resetFailureCount(); // Reset on successful call
        console.log("Fresh USDC exchange rate fetched:", cache.exchangeRate);
        return cache.exchangeRate;
      } catch (error) {
        console.warn(
          "Get USDC exchange rate error (using cached/default):",
          error
        );

        // Check if this is a contract not found/initialized error
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (
          errorMessage.includes("not found") ||
          errorMessage.includes("does not exist") ||
          errorMessage.includes("Resource not found")
        ) {
          console.warn(
            "USDC staking contract not deployed or initialized. Using default values."
          );
          cache.exchangeRate = 1.0;
          cache.lastFetchExchangeRate = now;
          return 1.0;
        }

        updateCacheOnFailure(error);

        // Return cached value or default
        return cache.exchangeRate !== null ? cache.exchangeRate : 1.0;
      }
    },
    [
      updateCacheOnFailure,
      resetFailureCount,
      shouldSkipApiCall,
      clearInvalidCache,
    ]
  );

  // Get user USDC stake info with enhanced error handling and rate limiting
  const getUserUSDCStakeInfo = async (
    userAddress?: string
  ): Promise<UserUSDCStakeInfo | null> => {
    const address = userAddress || account?.address?.toString();
    if (!address) {
      return null;
    }

    // Check if we should skip API calls due to rate limiting
    if (shouldSkipApiCall()) {
      console.log(
        "Skipping user USDC stake info API call due to rate limiting"
      );
      return {
        stUSDCBalance: 0,
        pendingRequests: 0,
        pendingRewards: 0,
      };
    }

    try {
      const [stakeInfo, pendingRewards] = await Promise.all([
        aptos.view({
          payload: {
            function: `${USDC_STAKING_CONFIG.MODULE_ID}::${USDC_STAKING_CONFIG.FUNCTIONS.GET_USER_USDC_STAKE_INFO}`,
            functionArguments: [address],
          },
        }) as Promise<[number, number]>,
        aptos.view({
          payload: {
            function: `${USDC_STAKING_CONFIG.MODULE_ID}::${USDC_STAKING_CONFIG.FUNCTIONS.CALCULATE_PENDING_REWARDS}`,
            functionArguments: [address],
          },
        }) as Promise<[number]>,
      ]);

      const [stUSDCBalance, pendingRequests] = stakeInfo;
      const [rewards] = pendingRewards;

      resetFailureCount(); // Reset on successful call

      return {
        stUSDCBalance: microUsdcToUsdc(stUSDCBalance),
        pendingRequests,
        pendingRewards: microUsdcToUsdc(rewards),
      };
    } catch (error) {
      console.warn("Get user USDC stake info error (using default):", error);

      updateCacheOnFailure(error);

      return {
        stUSDCBalance: 0,
        pendingRequests: 0,
        pendingRewards: 0,
      };
    }
  };

  // Get USDC protocol stats with enhanced rate limiting
  const getUSDCProtocolStats = useCallback(
    async (forceRefresh = false): Promise<USDCProtocolStats> => {
      const now = Date.now();

      // Clear any invalid cached data first
      clearInvalidCache();

      // Check if we should skip API calls due to rate limiting (unless force refresh)
      if (!forceRefresh && shouldSkipApiCall()) {
        console.log(
          "Skipping USDC protocol stats API call due to rate limiting"
        );
        return (
          cache.protocolStats || {
            totalStaked: 0,
            totalStUSDCSupply: 0,
            usdcPoolValue: 0,
            apy: 5.0, // Default to 5% APY
            exchangeRate: 1.0,
          }
        );
      }

      // Use extended cache duration if we've hit rate limits recently
      const cacheDuration =
        cache.consecutiveFailures > 0
          ? cache.EXTENDED_CACHE_DURATION
          : cache.CACHE_DURATION;

      // Return cached value if still valid (unless force refresh)
      if (
        !forceRefresh &&
        cache.protocolStats !== null &&
        now - cache.lastFetchProtocolStats < cacheDuration
      ) {
        // Check if cached data is valid (no NaN values)
        if (Number.isFinite(cache.protocolStats.exchangeRate)) {
          console.log(
            "Returning cached USDC protocol stats:",
            cache.protocolStats
          );
          return cache.protocolStats;
        } else {
          console.log(
            "Cached USDC protocol stats contains NaN, clearing cache..."
          );
          cache.protocolStats = null; // Clear bad cache
        }
      }

      try {
        console.log("Fetching fresh USDC protocol stats from contract...");
        const result = (await aptos.view({
          payload: {
            function: `${USDC_STAKING_CONFIG.MODULE_ID}::${USDC_STAKING_CONFIG.FUNCTIONS.GET_USDC_PROTOCOL_STATS}`,
            functionArguments: [],
          },
        })) as [number, number, number, number];

        const [totalStaked, totalStUSDCSupply, usdcPoolValue, apy] = result;

        // Calculate exchange rate with proper NaN handling
        let exchangeRate = 1.0; // Default value
        if (totalStUSDCSupply === 0) {
          exchangeRate = 1.0; // Initial rate when no supply
        } else if (totalStaked === 0) {
          exchangeRate = 1.0; // Fallback when no staking yet
        } else {
          exchangeRate = totalStaked / totalStUSDCSupply;
          // Additional safety check for NaN
          if (!Number.isFinite(exchangeRate)) {
            exchangeRate = 1.0;
          }
        }

        cache.protocolStats = {
          totalStaked: microUsdcToUsdc(totalStaked),
          totalStUSDCSupply: microUsdcToUsdc(totalStUSDCSupply),
          usdcPoolValue: microUsdcToUsdc(usdcPoolValue),
          apy: apy / 100, // Convert from basis points to percentage (500 basis points = 5%)
          exchangeRate,
        };

        cache.lastFetchProtocolStats = now;
        resetFailureCount(); // Reset on successful call
        // console.log("Fresh USDC protocol stats fetched:", cache.protocolStats);
        return cache.protocolStats;
      } catch (error) {
        console.warn(
          "Get USDC protocol stats error (using cached/default):",
          error
        );

        // Check if this is a contract not found/initialized error
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (
          errorMessage.includes("not found") ||
          errorMessage.includes("does not exist") ||
          errorMessage.includes("Resource not found")
        ) {
          console.warn(
            "USDC staking contract not deployed or initialized. Using default values."
          );
          const defaultStats = {
            totalStaked: 0,
            totalStUSDCSupply: 0,
            usdcPoolValue: 0,
            apy: 5.0, // Default to 5% APY
            exchangeRate: 1.0,
          };
          cache.protocolStats = defaultStats;
          cache.lastFetchProtocolStats = now;
          return defaultStats;
        }

        updateCacheOnFailure(error);

        // Return cached value or default
        return (
          cache.protocolStats || {
            totalStaked: 0,
            totalStUSDCSupply: 0,
            usdcPoolValue: 0,
            apy: 5.0, // Default to 5% APY
            exchangeRate: 1.0,
          }
        );
      }
    },
    [
      shouldSkipApiCall,
      updateCacheOnFailure,
      resetFailureCount,
      clearInvalidCache,
    ]
  );

  // Get pending unstaking requests for a user
  const getPendingUSDCUnstakingRequests = async (
    userAddress?: string
  ): Promise<USDCUnstakeRequest[]> => {
    const address = userAddress || account?.address?.toString();
    if (!address) {
      return [];
    }

    try {
      const userInfo = await getUserUSDCStakeInfo(address);
      if (!userInfo || userInfo.pendingRequests === 0) {
        return [];
      }

      // Note: The Move contract doesn't have a view function to get request details
      // This would require adding a view function to the contract to get actual request data
      // console.log(
      //   `User has ${userInfo.pendingRequests} pending USDC unstaking requests`
      // );

      // Return empty array since we can't get actual request details without a contract view function
      return [];
    } catch (error) {
      console.error("Get pending USDC unstaking requests error:", error);
      return [];
    }
  };

  // Get transaction history for USDC staking
  const getUSDCTransactionHistory = useCallback(
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

        // Filter for USDC stake-related transactions
        const usdcStakeTransactions = transactions.filter((tx: any) => {
          if (tx.type !== "user_transaction") return false;

          const payload = tx.payload;
          if (!payload || payload.type !== "entry_function_payload")
            return false;

          // Check if transaction is related to our USDC staking contract
          return payload.function?.includes(USDC_STAKING_CONFIG.MODULE_ID);
        });

        // Parse transactions to extract amounts from events
        const parsedTransactions = usdcStakeTransactions.map((tx: any) => {
          const payload = tx.payload;
          const functionName = payload?.function || "";
          const args = payload?.arguments || [];

          // Extract amount from function arguments (usually first argument)
          let amount = "0";
          let stTokensReceived = "0";
          let usdcToReceive = "0";
          let usdcReceived = "0";
          let rewardsClaimed = "0";

          if (args.length > 0) {
            // Amount is typically in micro USDC, convert to USDC
            const amountInMicroUsdc = parseInt(args[0]) || 0;
            amount = microUsdcToUsdc(amountInMicroUsdc).toFixed(6);

            // For staking, calculate stUSDC received (assuming 1:1 for simplicity)
            if (
              functionName.includes("stake_usdc") &&
              !functionName.includes("unstake")
            ) {
              stTokensReceived = amount;
            }

            // For unstaking, the amount is in stUSDC, calculate USDC to receive
            if (functionName.includes("request_unstake_usdc")) {
              usdcToReceive = amount;
            }

            // For completing unstaking
            if (functionName.includes("complete_unstaking_usdc")) {
              usdcReceived = amount;
            }

            // For claiming rewards
            if (functionName.includes("claim_rewards")) {
              rewardsClaimed = amount;
            }
          }

          // Try to parse events for more accurate amounts
          if (tx.events && Array.isArray(tx.events)) {
            tx.events.forEach((event: any) => {
              if (event.type?.includes("USDCStakeEvent")) {
                const eventData = event.data;
                if (eventData.amount) {
                  amount = microUsdcToUsdc(parseInt(eventData.amount)).toFixed(
                    6
                  );
                }
                if (eventData.st_usdc_minted) {
                  stTokensReceived = microUsdcToUsdc(
                    parseInt(eventData.st_usdc_minted)
                  ).toFixed(6);
                }
              }
              if (event.type?.includes("USDCUnstakeRequestEvent")) {
                const eventData = event.data;
                if (eventData.amount) {
                  amount = microUsdcToUsdc(parseInt(eventData.amount)).toFixed(
                    6
                  );
                  usdcToReceive = amount; // For unstaking, amount is what will be received
                }
              }
              if (event.type?.includes("USDCUnstakeCompleteEvent")) {
                const eventData = event.data;
                if (eventData.amount) {
                  usdcReceived = microUsdcToUsdc(
                    parseInt(eventData.amount)
                  ).toFixed(6);
                }
              }
              if (event.type?.includes("USDCRewardsClaimedEvent")) {
                const eventData = event.data;
                if (eventData.amount) {
                  rewardsClaimed = microUsdcToUsdc(
                    parseInt(eventData.amount)
                  ).toFixed(6);
                }
              }
            });
          }

          return {
            ...tx,
            parsedAmount: amount,
            stTokensReceived,
            usdcToReceive,
            usdcReceived,
            rewardsClaimed,
          };
        });

        return parsedTransactions;
      } catch (error) {
        console.error("Error fetching USDC transaction history:", error);
        return [];
      }
    },
    [account]
  );

  // Helper to get transaction URL
  const getTxUrl = (txHash: string) => {
    return getExplorerUrl(txHash);
  };

  // Force refresh function to bypass cache
  const forceRefreshUSDCData = useCallback(async () => {
    const now = Date.now();

    // Prevent rapid force refresh calls
    if (now - cache.lastForceRefresh < cache.FORCE_REFRESH_COOLDOWN) {
      // console.log("⏰ USDC force refresh on cooldown, using cached data");
      return {
        exchangeRate: cache.exchangeRate || 1.0,
        protocolStats: cache.protocolStats || {
          totalStaked: 0,
          totalStUSDCSupply: 0,
          usdcPoolValue: 0,
          apy: 5.0,
          exchangeRate: 1.0,
        },
      };
    }

    // console.log(
    //   "🔄 Force refreshing USDC data - clearing cache and fetching fresh..."
    // );

    cache.lastForceRefresh = now;

    // Clear all cache first
    cache.exchangeRate = null;
    cache.protocolStats = null;
    cache.lastFetchExchangeRate = 0;
    cache.lastFetchProtocolStats = 0;
    cache.consecutiveFailures = 0;
    cache.isCircuitOpen = false;
    cache.lastFailureTime = 0;

    try {
      const [exchangeRate, protocolStats] = await Promise.all([
        getUSDCExchangeRate(true),
        getUSDCProtocolStats(true),
      ]);
      // console.log("✅ USDC force refresh completed:", {
      //   exchangeRate,
      //   protocolStats,
      // });
      return { exchangeRate, protocolStats };
    } catch (error) {
      console.error("❌ USDC force refresh failed:", error);
      throw error;
    }
  }, [getUSDCExchangeRate, getUSDCProtocolStats]);

  return {
    stakeUSDC,
    requestUnstakeUSDC,
    completeUSDCUnstaking,
    claimUSDCRewards,
    getPendingUSDCUnstakingRequests,
    getUSDCExchangeRate,
    getUserUSDCStakeInfo,
    getUSDCProtocolStats,
    getUSDCTransactionHistory,
    forceRefreshUSDCData,
    clearInvalidCache,
    getAvailableUSDCData,
    getTxUrl,
    connected: !!account,
    address: account?.address?.toString(),
  };
};
