import { useCallback, useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos } from "../config/aptos";
import {
  USDC_CONFIG,
  USDC_FUNCTIONS,
  microUsdcToUsdc,
  usdcToMicroUsdc,
} from "../config/contract";

export interface USDCBalance {
  balance: number;
  formattedBalance: string;
}

export interface USDCTransferResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export interface USDCMintResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export const useUSDC = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [usdcBalance, setUsdcBalance] = useState<USDCBalance>({
    balance: 0,
    formattedBalance: "0.00",
  });
  const [loading, setLoading] = useState(false);

  // Get USDC balance for an account
  const getUSDCBalance = useCallback(
    async (accountAddress?: string): Promise<USDCBalance> => {
      const address = accountAddress || account?.address?.toString();
      if (!address) {
        return { balance: 0, formattedBalance: "0.00" };
      }

      try {
        // Use fungible asset balance function
        const balance = (await aptos.view({
          payload: {
            function:
              USDC_FUNCTIONS.BALANCE as `${string}::${string}::${string}`,
            typeArguments: ["0x1::fungible_asset::Metadata"],
            functionArguments: [address, USDC_CONFIG.ADDRESS],
          },
        })) as [string];

        const microUsdc = parseInt(balance[0] || "0");
        const usdcBalance = microUsdcToUsdc(microUsdc);

        return {
          balance: usdcBalance,
          formattedBalance: usdcBalance.toFixed(2),
        };
      } catch (error) {
        console.error("Error fetching USDC balance:", error);
        return { balance: 0, formattedBalance: "0.00" };
      }
    },
    [account]
  );

  // Refresh USDC balance
  const refreshUSDCBalance = useCallback(async () => {
    if (!account) return;

    setLoading(true);
    try {
      const balance = await getUSDCBalance();
      setUsdcBalance(balance);
    } catch (error) {
      console.error("Error refreshing USDC balance:", error);
    } finally {
      setLoading(false);
    }
  }, [account, getUSDCBalance]);

  // Transfer USDC to another account
  const transferUSDC = async (
    toAddress: string,
    amount: number
  ): Promise<USDCTransferResult> => {
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
      const amountInMicroUsdc = usdcToMicroUsdc(amount);

      // Validate converted amount is within safe range
      if (amountInMicroUsdc > Number.MAX_SAFE_INTEGER) {
        return {
          success: false,
          error: "Amount is too large",
        };
      }

      // Validate against u64 max value
      const maxU64 = BigInt("18446744073709551615");
      if (BigInt(amountInMicroUsdc) > maxU64) {
        return {
          success: false,
          error: "Amount exceeds maximum allowed value",
        };
      }

      if (amountInMicroUsdc < USDC_CONFIG.MIN_AMOUNT) {
        return {
          success: false,
          error: `Minimum transfer amount is ${microUsdcToUsdc(
            USDC_CONFIG.MIN_AMOUNT
          )} USDC`,
        };
      }

      //   console.log("Transfer details:", {
      //     amount: amount,
      //     amountInMicroUsdc: amountInMicroUsdc,
      //     toAddress: toAddress,
      //     usdcAddress: USDC_CONFIG.ADDRESS,
      //   });

      const transaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: "0x1::primary_fungible_store::transfer",
          typeArguments: ["0x1::fungible_asset::Metadata"],
          functionArguments: [
            USDC_CONFIG.ADDRESS, // metadata object
            toAddress, // recipient
            amountInMicroUsdc.toString(), // amount
          ],
        },
      });
      return {
        success: true,
        txHash: transaction.hash,
      };
    } catch (error) {
      console.error("USDC transfer error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  // Register for USDC if not already registered
  const registerForUSDC = async (): Promise<string> => {
    if (!account || !signAndSubmitTransaction) {
      throw new Error("Wallet not connected");
    }

    try {
      const transaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `0x6e61dc7e5a207d5470d195312bf7fd99124dd8593bbb11094a0a145a89c29923::usdc::register`,
          functionArguments: [],
        },
      });
      return transaction.hash;
    } catch (error) {
      console.error("USDC registration error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  };

  // Mint USDC (for testing purposes)
  const mintUSDC = async (amount: number): Promise<USDCMintResult> => {
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
        error: "Amount is too large. Maximum is 1,000,000 USDC per mint.",
      };
    }

    try {
      const amountInMicroUsdc = usdcToMicroUsdc(amount);

      // Validate converted amount is within safe range
      if (amountInMicroUsdc > Number.MAX_SAFE_INTEGER) {
        return {
          success: false,
          error: "Amount is too large",
        };
      }

      console.log("Minting USDC:", {
        amount: amount,
        amountInMicroUsdc: amountInMicroUsdc,
        toAddress: account.address.toString(),
      });

      const transaction = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `0x6e61dc7e5a207d5470d195312bf7fd99124dd8593bbb11094a0a145a89c29923::usdc::mint`,
          functionArguments: [
            account.address.toString(), // recipient
            amountInMicroUsdc.toString(), // amount
          ],
        },
      });

      return {
        success: true,
        txHash: transaction.hash,
      };
    } catch (error) {
      console.error("USDC mint error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  // Auto-refresh balance when account changes
  useEffect(() => {
    if (account) {
      refreshUSDCBalance();
    } else {
      setUsdcBalance({ balance: 0, formattedBalance: "0.00" });
    }
  }, [account, refreshUSDCBalance]);

  return {
    usdcBalance: usdcBalance.balance,
    formattedUsdcBalance: usdcBalance.formattedBalance,
    loading,
    getUSDCBalance,
    refreshUSDCBalance,
    transferUSDC,
    registerForUSDC,
    mintUSDC,
    connected: !!account,
  };
};
