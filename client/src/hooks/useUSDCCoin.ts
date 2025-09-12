import { useCallback, useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos } from "../config/aptos";
import { CONTRACT_CONFIG, microUsdcToUsdc } from "../config/contract";

export interface USDCCoinBalance {
  balance: number;
  formattedBalance: string;
}

export interface USDCCoinTransferResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export const useUSDCCoin = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [usdcCoinBalance, setUsdcCoinBalance] = useState<USDCCoinBalance>({
    balance: 0,
    formattedBalance: "0.00",
  });
  const [loading, setLoading] = useState(false);

  // Get custom USDC coin balance for an account
  const getUSDCCoinBalance = useCallback(
    async (accountAddress?: string): Promise<USDCCoinBalance> => {
      const address = accountAddress || account?.address?.toString();
      if (!address) {
        return { balance: 0, formattedBalance: "0.00" };
      }

      try {
        // Get all coins data for the account
        const coinsData = await aptos.getAccountCoinsData({
          accountAddress: address,
        });

        // Find the USDC coin by its asset_type (module address and USDC type)
        const usdcCoin = coinsData.find(
          (coin) =>
            coin.asset_type === `${CONTRACT_CONFIG.MODULE_ADDRESS}::usdc::USDC`
        );

        if (usdcCoin) {
          // Extract the amount in microUSDC
          const microUsdc = Number(usdcCoin.amount);
          // Convert to USDC (6 decimals)
          const usdcBalance = microUsdcToUsdc(microUsdc);

          return {
            balance: usdcBalance,
            formattedBalance: usdcBalance.toFixed(2),
          };
        }

        // Fallback to using the view function if coin data not found
        const balance = (await aptos.view({
          payload: {
            function:
              `${CONTRACT_CONFIG.MODULE_ADDRESS}::usdc::balance` as `${string}::${string}::${string}`,
            functionArguments: [address],
          },
        })) as [string];

        const microUsdc = parseInt(balance[0] || "0");
        const usdcBalance = microUsdcToUsdc(microUsdc);

        return {
          balance: usdcBalance,
          formattedBalance: usdcBalance.toFixed(2),
        };
      } catch (error) {
        console.error("Error fetching USDC coin balance:", error);
        return { balance: 0, formattedBalance: "0.00" };
      }
    },
    [account]
  );

  // Refresh custom USDC coin balance
  const refreshUSDCCoinBalance = useCallback(async () => {
    if (!account) return;

    setLoading(true);
    try {
      const balance = await getUSDCCoinBalance();
      setUsdcCoinBalance(balance);
    } catch (error) {
      // console.error("Error refreshing USDC coin balance:", error);
    } finally {
      setLoading(false);
    }
  }, [account, getUSDCCoinBalance]);

  // Register for custom USDC coin if not already registered
  const registerForUSDCCoin = async (): Promise<string> => {
    if (!account || !signAndSubmitTransaction) {
      throw new Error("Wallet not connected");
    }

    try {
      const transaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${CONTRACT_CONFIG.MODULE_ADDRESS}::usdc::register`,
          functionArguments: [],
        },
      });

      return transaction.hash;
    } catch (error) {
      console.error("Error registering for USDC coin:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to register for USDC coin"
      );
    }
  };

  // Mint USDC coins (requires sender to be admin or have proper permissions)
  const mintUSDC = async (amount: number): Promise<USDCCoinTransferResult> => {
    if (!account || !signAndSubmitTransaction) {
      return { success: false, error: "Wallet not connected" };
    }

    // Validate input amount
    if (!Number.isFinite(amount) || amount <= 0) {
      return {
        success: false,
        error: "Invalid amount. Please enter a valid positive number.",
      };
    }

    try {
      // Convert to microUSDC (6 decimals)
      const amountInMicroUsdc = Math.floor(amount * 1000000);

      // Call the mint function with the amount in microUSDC
      const transaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${CONTRACT_CONFIG.MODULE_ADDRESS}::usdc::mint`,
          functionArguments: [amountInMicroUsdc.toString()],
        },
      });

      return {
        success: true,
        txHash: transaction.hash,
      };
    } catch (error) {
      console.error("Error minting USDC:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to mint USDC. You may not have permission to mint.",
      };
    }
  };

  // Transfer custom USDC coin to another account
  const transferUSDCCoin = async (
    toAddress: string,
    amount: number
  ): Promise<USDCCoinTransferResult> => {
    if (!account) {
      return { success: false, error: "Wallet not connected" };
    }

    // Validate input amount
    if (!Number.isFinite(amount) || amount <= 0) {
      return {
        success: false,
        error: "Invalid amount. Please enter a valid positive number.",
      };
    }

    if (amount > 1000000) {
      // More than 1 million USDC
      return {
        success: false,
        error: "Amount is too large. Maximum is 1,000,000 USDC.",
      };
    }

    try {
      const amountInMicroUsdc = Math.floor(amount * 1000000); // 6 decimals

      // Validate converted amount is within safe range
      if (amountInMicroUsdc > Number.MAX_SAFE_INTEGER) {
        return {
          success: false,
          error: "Amount is too large",
        };
      }

      if (amountInMicroUsdc < 1000000) {
        // Minimum 1 USDC
        return {
          success: false,
          error: "Minimum transfer amount is 1 USDC",
        };
      }

      const transaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${CONTRACT_CONFIG.MODULE_ADDRESS}::usdc::transfer`,
          functionArguments: [toAddress, amountInMicroUsdc.toString()],
        },
      });

      return {
        success: true,
        txHash: transaction.hash,
      };
    } catch (error) {
      // console.error("USDC coin transfer error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  // Check if account is registered for USDC
  const isUSDCRegistered = useCallback(async (): Promise<boolean> => {
    if (!account?.address) return false;

    try {
      // Get all coins data to check if USDC is registered
      const coinsData = await aptos.getAccountCoinsData({
        accountAddress: account.address.toString(),
      });

      // Check if USDC is in the coins data
      return coinsData.some(
        (coin) =>
          coin.asset_type === `${CONTRACT_CONFIG.MODULE_ADDRESS}::usdc::USDC`
      );
    } catch (error) {
      console.error("Error checking USDC registration:", error);
      return false;
    }
  }, [account]);

  // Auto-refresh balance when account changes
  useEffect(() => {
    if (account) {
      refreshUSDCCoinBalance();
    } else {
      setUsdcCoinBalance({ balance: 0, formattedBalance: "0.00" });
    }
  }, [account, refreshUSDCCoinBalance]);

  return {
    usdcCoinBalance: usdcCoinBalance.balance,
    formattedUsdcCoinBalance: usdcCoinBalance.formattedBalance,
    loading,
    getUSDCCoinBalance,
    refreshUSDCCoinBalance,
    transferUSDCCoin,
    registerForUSDCCoin,
    mintUSDC,
    isUSDCRegistered,
    connected: !!account,
  };
};
