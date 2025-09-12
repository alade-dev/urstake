import React, { createContext, useState, useEffect, ReactNode } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";
import { aptos } from "../config/aptos";
import {
  CONTRACT_CONFIG,
  octasToApt,
  USDC_CONFIG,
  USDC_FUNCTIONS,
  microUsdcToUsdc,
} from "../config/contract";
import { WalletInfo, WalletContextType } from "./types";

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

// Inner provider that uses the Aptos wallet hooks
const WalletProviderInner: React.FC<WalletProviderProps> = ({ children }) => {
  const {
    connected,
    account,
    network,
    disconnect: aptosDisconnect,
    wallet,
  } = useAptosWallet();

  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState({
    apt: 0,
    usdc: 0,
    lstAPT: 0,
    lstUSDC: 0,
  });

  // Fetch balance when account changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (account?.address) {
        try {
          const accountAddress = account.address.toString();

          // Get APT balance
          const aptBalance = await aptos.getAccountAPTAmount({
            accountAddress,
          });

          // Get stAPT balance from the contract
          let stAptBalance = 0;
          try {
            const userStakeInfo = (await aptos.view({
              payload: {
                function: `${CONTRACT_CONFIG.MODULE_ID}::${CONTRACT_CONFIG.FUNCTIONS.GET_USER_STAKE_INFO}`,
                functionArguments: [accountAddress],
              },
            })) as [number, number];

            stAptBalance = octasToApt(userStakeInfo[0] || 0);
          } catch (error) {
            console.log("No stake info found (user hasn't staked yet)");
          }

          // Get USDC balance
          let usdcBalance = 0;
          try {
            // Try to get real USDC balance using fungible asset
            // console.log("Fetching real USDC balance for:", accountAddress);
            const balance = (await aptos.view({
              payload: {
                function:
                  USDC_FUNCTIONS.BALANCE as `${string}::${string}::${string}`,
                typeArguments: ["0x1::fungible_asset::Metadata"],
                functionArguments: [accountAddress, USDC_CONFIG.ADDRESS],
              },
            })) as [string];

            const microUsdc = parseInt(balance[0] || "0");
            usdcBalance = microUsdcToUsdc(microUsdc);

            // console.log("Real USDC balance found:", usdcBalance);
          } catch (error) {
            console.log(
              "Real USDC balance not found, using APT as substitute:",
              error
            );

            // Fallback to APT as USDC substitute for testing
            try {
              const resources = await aptos.getAccountResources({
                accountAddress,
              });

              const aptResource = resources.find(
                (resource) =>
                  resource.type ===
                  "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
              );

              if (aptResource && aptResource.data) {
                const data = aptResource.data as {
                  coin: { value: string };
                };
                if (data.coin && data.coin.value) {
                  const aptValue = parseInt(data.coin.value);
                  // Convert APT (8 decimals) to USDC equivalent (6 decimals)
                  const usdcEquivalent = aptValue / 100; // Simple conversion for testing
                  usdcBalance = usdcEquivalent / 1000000; // Convert to USDC format
                  // console.log("Using APT as USDC substitute:", usdcBalance);
                }
              }
            } catch (aptError) {
              console.error(
                "Error fetching APT balance for USDC substitute:",
                aptError
              );
              console.log(
                "No USDC balance found (user hasn't registered for USDC yet)"
              );
            }
          }

          setBalance({
            apt: octasToApt(aptBalance),
            usdc: usdcBalance,
            lstAPT: stAptBalance,
            lstUSDC: 0, // TODO: Fetch lstUSDC balance when implemented
          });
        } catch (error) {
          console.error("Error fetching balance:", error);
          setBalance({
            apt: 0,
            usdc: 0,
            lstAPT: 0,
            lstUSDC: 0,
          });
        }
      }
    };

    if (connected && account) {
      fetchBalance();
    } else {
      setBalance({
        apt: 0,
        usdc: 0,
        lstAPT: 0,
        lstUSDC: 0,
      });
    }
  }, [account, connected]);

  const connect = async (walletName: string) => {
    setConnecting(true);
    try {
      // The connection is handled by the WalletSelector component
      // This function is kept for compatibility with the existing interface
      console.log(`Attempting to connect to ${walletName}`);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await aptosDisconnect();
      setBalance({
        apt: 0,
        usdc: 0,
        lstAPT: 0,
        lstUSDC: 0,
      });
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const switchNetwork = async (newNetwork: "mainnet" | "testnet") => {
    // Network switching would be handled by the wallet
    console.log(`Switching to ${newNetwork}`);
  };

  const getSupportedWallets = (): WalletInfo[] => {
    return [
      {
        name: "Petra",
        icon: "/wallets/petra.png",
        installed: typeof window !== "undefined" && "aptos" in window,
        website: "https://petra.app/",
        description: "The safest and most powerful wallet for Aptos",
      },
      {
        name: "Martian",
        icon: "/wallets/martian.png",
        installed: typeof window !== "undefined" && "martian" in window,
        website: "https://martianwallet.xyz/",
        description: "Multi-chain wallet with Aptos support",
      },
      {
        name: "Pontem",
        icon: "/wallets/pontem.png",
        installed: typeof window !== "undefined" && "pontem" in window,
        website: "https://pontem.network/",
        description: "Pontem Network official wallet",
      },
      {
        name: "Nightly",
        icon: "/wallets/nightly.png",
        installed: typeof window !== "undefined" && "nightly" in window,
        website: "https://nightly.app/",
        description: "Multi-chain wallet with beautiful interface",
      },
    ];
  };

  const getWalletAddress = () => {
    return account?.address?.toString() || null;
  };

  const refreshBalance = async () => {
    if (account?.address) {
      const accountAddress = account.address.toString();

      try {
        const aptBalance = await aptos.getAccountAPTAmount({
          accountAddress,
        });

        let stAptBalance = 0;
        try {
          const userStakeInfo = (await aptos.view({
            payload: {
              function: `${CONTRACT_CONFIG.MODULE_ID}::${CONTRACT_CONFIG.FUNCTIONS.GET_USER_STAKE_INFO}`,
              functionArguments: [accountAddress],
            },
          })) as [number, number];

          stAptBalance = octasToApt(userStakeInfo[0] || 0);
        } catch (error) {
          console.log("No stake info found");
        }

        setBalance({
          apt: octasToApt(aptBalance),
          usdc: 0,
          lstAPT: stAptBalance,
          lstUSDC: 0,
        });
      } catch (error) {
        console.error("Error refreshing balance:", error);
      }
    }
  };

  const value: WalletContextType = {
    connected: connected || false,
    connecting,
    walletAddress: getWalletAddress(),
    selectedWallet: wallet?.name || null,
    network: network?.name === "mainnet" ? "mainnet" : "testnet",
    balance,
    connect,
    disconnect,
    switchNetwork,
    getSupportedWallets,
    refreshBalance,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

// Main provider that wraps everything with AptosWalletAdapterProvider
const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: CONTRACT_CONFIG.NETWORK,
      }}
    >
      <WalletProviderInner>{children}</WalletProviderInner>
    </AptosWalletAdapterProvider>
  );
};

export default WalletProvider;
export { WalletContext };
