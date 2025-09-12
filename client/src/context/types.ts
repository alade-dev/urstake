export interface WalletInfo {
  name: string;
  icon: string;
  installed: boolean;
  website: string;
  description: string;
}

export interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  walletAddress: string | null;
  selectedWallet: string | null;
  network: "mainnet" | "testnet";
  balance: {
    apt: number;
    usdc: number;
    lstAPT: number;
    lstUSDC: number;
  };
  connect: (walletName: string) => Promise<void>;
  disconnect: () => Promise<void>;
  switchNetwork: (network: "mainnet" | "testnet") => Promise<void>;
  getSupportedWallets: () => WalletInfo[];
  refreshBalance?: () => Promise<void>;
}
