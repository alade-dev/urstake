import { useState, useEffect, useRef } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useUrStakeContract } from "@/hooks/useUrStakeContract";
import { useUSDC } from "@/hooks/useUSDC";
import { useUSDCCoin } from "@/hooks/useUSDCCoin";
import { useUSDCStaking } from "@/hooks/useUSDCStaking";
import { useWalletPrompt } from "@/hooks/useWalletPrompt";
import { UsdcValue, UsdcBalanceCard } from "@/components/UsdcValue";
import { UsdValue } from "@/components/UsdValue";
import { CONTRACT_CONFIG, USDC_STAKING_CONFIG } from "@/config/contract";
import aptosLogo from "@/assets/logo/aptos.png";
import usdcLogo from "@/assets/logo/usdc.png";
// import { testContractFunctions } from "@/utils/contractTest";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import WalletModal from "@/components/WalletModal";
import {
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  DollarSign,
  Copy,
  HelpCircle,
  Loader2,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { aptos } from "@/config/aptos";

const StakingInterface = () => {
  const { balance, connected, refreshBalance } = useWallet();
  const { isModalOpen, closeModal, promptConnection } = useWalletPrompt();
  const {
    stake,
    requestUnstake,
    getExchangeRate,
    getUserStakeInfo,
    getProtocolStats,
    forceRefreshAptData,
    clearInvalidAptCache,
    getAvailableAptData,
    getTxUrl,
  } = useUrStakeContract();

  const {
    usdcBalance,
    formattedUsdcBalance,
    transferUSDC,
    registerForUSDC,
    refreshUSDCBalance,
  } = useUSDC();

  const {
    usdcCoinBalance,
    formattedUsdcCoinBalance,
    refreshUSDCCoinBalance,
    registerForUSDCCoin,
    getUSDCCoinBalance,
  } = useUSDCCoin();

  const {
    stakeUSDC,
    requestUnstakeUSDC,
    claimUSDCRewards,
    getUSDCExchangeRate,
    getUserUSDCStakeInfo,
    getUSDCProtocolStats,
    forceRefreshUSDCData,
    clearInvalidCache,
    getAvailableUSDCData,
    getTxUrl: getUSDCTxUrl,
  } = useUSDCStaking();

  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<"APT" | "USDC">("APT");
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  // USDC Staking specific state
  const [usdcStakeAmount, setUsdcStakeAmount] = useState("");
  const [usdcUnstakeAmount, setUsdcUnstakeAmount] = useState("");
  const [isUsdcStaking, setIsUsdcStaking] = useState(false);
  const [isUsdcUnstaking, setIsUsdcUnstaking] = useState(false);
  const [isClaimingRewards, setIsClaimingRewards] = useState(false);
  const [usdcExchangeRate, setUsdcExchangeRate] = useState(1.0);
  const [usdcProtocolStats, setUsdcProtocolStats] = useState({
    totalStaked: 0,
    totalStUSDCSupply: 0,
    usdcPoolValue: 0,
    apy: 0,
    exchangeRate: 1.0,
  });
  const [userUsdcStakeInfo, setUserUsdcStakeInfo] = useState({
    stUSDCBalance: 0,
    pendingRequests: 0,
    pendingRewards: 0,
  });

  const [exchangeRate, setExchangeRate] = useState(1.0);
  const [protocolStats, setProtocolStats] = useState({
    totalStaked: 0,
    totalStakedAPT: 0,
    aptPoolValue: 0,
    exchangeRate: 1.0,
  });
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Track if initial data has been loaded to prevent re-fetching
  const hasLoadedInitialData = useRef(false);

  // Load protocol data ONCE on mount only
  useEffect(() => {
    const loadInitialData = async () => {
      // Prevent multiple loads
      if (hasLoadedInitialData.current) {
        // console.log("📋 Data already loaded, skipping refetch");
        return;
      }

      setIsLoadingData(true);
      hasLoadedInitialData.current = true;

      try {
        // console.log("🚀 Loading initial protocol data (one-time)...");

        // First check if data is already available in cache
        const availableAptData = getAvailableAptData();
        const availableUsdcData = connected
          ? getAvailableUSDCData()
          : { isAvailable: false };

        // If all data is available, use it immediately without API calls
        if (
          availableAptData.isAvailable &&
          (!connected || availableUsdcData.isAvailable)
        ) {
          // console.log(
          //   "📋 All data available in cache, setting values immediately"
          // );

          setExchangeRate(availableAptData.exchangeRate);
          setProtocolStats(availableAptData.protocolStats);

          if (connected && availableUsdcData.isAvailable) {
            setUsdcExchangeRate(availableUsdcData.exchangeRate);
            setUsdcProtocolStats(availableUsdcData.protocolStats);
          } else {
            setUsdcExchangeRate(1.0);
            setUsdcProtocolStats({
              totalStaked: 0,
              totalStUSDCSupply: 0,
              usdcPoolValue: 0,
              apy: 5.0,
              exchangeRate: 1.0,
            });
          }

          // Still get user info if connected
          if (connected) {
            try {
              const userUsdcInfo = await getUserUSDCStakeInfo();
              setUserUsdcStakeInfo(
                userUsdcInfo || {
                  stUSDCBalance: 0,
                  pendingRequests: 0,
                  pendingRewards: 0,
                }
              );
            } catch (error) {
              // console.warn("Failed to load user USDC info:", error);
              setUserUsdcStakeInfo({
                stUSDCBalance: 0,
                pendingRequests: 0,
                pendingRewards: 0,
              });
            }
          } else {
            setUserUsdcStakeInfo({
              stUSDCBalance: 0,
              pendingRequests: 0,
              pendingRewards: 0,
            });
          }

          setIsLoadingData(false);
          return; // Exit early, no need for API calls
        }

        // If data not available, fetch normally (but only once)
        // console.log(
        //   "📡 Some data missing, fetching from contracts (one-time)..."
        // );
        const [rate, stats, usdcRate, usdcStats, userUsdcInfo] =
          await Promise.all([
            availableAptData.isAvailable
              ? Promise.resolve(availableAptData.exchangeRate)
              : getExchangeRate(),
            availableAptData.isAvailable
              ? Promise.resolve(availableAptData.protocolStats)
              : getProtocolStats(),
            connected
              ? availableUsdcData.isAvailable
                ? Promise.resolve(availableUsdcData.exchangeRate)
                : getUSDCExchangeRate()
              : Promise.resolve(1.0),
            connected
              ? availableUsdcData.isAvailable
                ? Promise.resolve(availableUsdcData.protocolStats)
                : getUSDCProtocolStats()
              : Promise.resolve({
                  totalStaked: 0,
                  totalStUSDCSupply: 0,
                  usdcPoolValue: 0,
                  apy: 5.0,
                  exchangeRate: 1.0,
                }),
            connected ? getUserUSDCStakeInfo() : Promise.resolve(null),
          ]);

        // console.log("✅ Initial protocol data loaded successfully:", {
        //   rate,
        //   stats,
        //   usdcRate,
        //   usdcStats,
        //   userUsdcInfo,
        // });

        setExchangeRate(rate);
        setProtocolStats(stats);
        setUsdcExchangeRate(usdcRate);
        setUsdcProtocolStats(usdcStats);
        setUserUsdcStakeInfo(
          userUsdcInfo || {
            stUSDCBalance: 0,
            pendingRequests: 0,
            pendingRewards: 0,
          }
        );
      } catch (error) {
        // console.error("Error loading initial protocol data:", error);
        hasLoadedInitialData.current = false; // Reset on error to allow retry

        // Set fallback data
        setExchangeRate(1.0);
        setProtocolStats({
          totalStaked: 0,
          totalStakedAPT: 0,
          aptPoolValue: 0,
          exchangeRate: 1.0,
        });

        toast.error("Failed to load protocol data", {
          description: "Using fallback data. Some features may be limited.",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    // Load data only once on mount
    loadInitialData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - we want this to run only once on mount
  const stakingPools = {
    APT: {
      name: "Aptos",
      symbol: "APT",
      liquidToken: "stAPT",
      apy: "7.8%",
      conversionRate: exchangeRate.toFixed(6),
      supply: protocolStats.totalStakedAPT.toFixed(2),
      available: balance.apt,
      staked: balance.lstAPT,
      unlocked: 0,
      locked: 0,
      contracts: {
        earn: `${CONTRACT_CONFIG.MODULE_ADDRESS}`,
        token: "stAPT Token",
      },
    },
    USDC: {
      name: "USDC",
      symbol: "USDC",
      liquidToken: "stUSDC",
      apy: `${usdcProtocolStats.apy.toFixed(2)}%`,
      conversionRate: usdcExchangeRate.toFixed(6),
      supply: usdcProtocolStats.totalStUSDCSupply.toFixed(2),
      available: usdcCoinBalance,
      staked: userUsdcStakeInfo.stUSDCBalance,
      unlocked: 0,
      locked: userUsdcStakeInfo.pendingRequests,
      contracts: {
        earn: `${USDC_STAKING_CONFIG.MODULE_ADDRESS}`,
        token: "stUSDC Token",
      },
    },
  };

  const currentPool = stakingPools[selectedAsset];
  const stakeAmountNum = parseFloat(stakeAmount) || 0;
  const unstakeAmountNum = parseFloat(unstakeAmount) || 0;

  // Add missing USDC amount parsing variables
  const usdcStakeAmountNum = parseFloat(usdcStakeAmount) || 0;
  const usdcUnstakeAmountNum = parseFloat(usdcUnstakeAmount) || 0;

  const expectedLiquidTokens =
    stakeAmountNum / parseFloat(currentPool.conversionRate);

  const handleMaxStake = () => {
    // console.log(currentPool.available);
    setStakeAmount(currentPool.available.toString());
  };

  const handleMaxUnstake = () => {
    setUnstakeAmount(currentPool.staked.toString());
  };

  const handleStake = async () => {
    if (selectedAsset === "APT") {
      return handleAptStake();
    } else if (selectedAsset === "USDC") {
      return handleUsdcStake();
    }
  };

  const handleAptStake = async () => {
    if (stakeAmountNum <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid amount to stake",
      });
      return;
    }

    if (stakeAmountNum > balance.apt) {
      toast.error("Insufficient balance", {
        description: "You don't have enough APT to stake this amount",
      });
      return;
    }

    // Prompt wallet connection if not connected
    if (!connected) {
      const connectionSuccess = await promptConnection();
      if (!connectionSuccess) {
        toast.error("Wallet connection required", {
          description: "Please connect your wallet to stake tokens",
        });
        return;
      }
    }

    setIsStaking(true);
    try {
      const result = await stake(stakeAmountNum);

      if (result.success) {
        toast.success("Staking successful!", {
          description: `Staked ${stakeAmountNum} APT successfully`,
          action: result.txHash
            ? {
                label: "View Transaction",
                onClick: () => window.open(getTxUrl(result.txHash!), "_blank"),
              }
            : undefined,
        });
        setStakeAmount("");
        // Refresh balance after successful stake
        setTimeout(async () => {
          await refreshBalance?.();
        }, 2000);
      } else {
        toast.error("Staking failed", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Staking failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async (instant: boolean = false) => {
    if (selectedAsset === "APT") {
      return handleAptUnstake(instant);
    } else if (selectedAsset === "USDC") {
      return handleUsdcUnstake(instant);
    }
  };

  const handleAptUnstake = async (instant: boolean = false) => {
    if (unstakeAmountNum <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid amount to unstake",
      });
      return;
    }

    if (unstakeAmountNum > balance.lstAPT) {
      toast.error("Insufficient balance", {
        description: "You don't have enough stAPT to unstake this amount",
      });
      return;
    }

    // Prompt wallet connection if not connected
    if (!connected) {
      const connectionSuccess = await promptConnection();
      if (!connectionSuccess) {
        toast.error("Wallet connection required", {
          description: "Please connect your wallet to unstake tokens",
        });
        return;
      }
    }

    setIsUnstaking(true);
    try {
      const result = await requestUnstake(unstakeAmountNum, instant);

      if (result.success) {
        toast.success(
          instant
            ? "Instant unstaking successful!"
            : "Unstaking request created!",
          {
            description: instant
              ? `Unstaked ${unstakeAmountNum} stAPT instantly`
              : `Unstaking request for ${unstakeAmountNum} stAPT created (7 day wait)`,
            action: result.txHash
              ? {
                  label: "View Transaction",
                  onClick: () =>
                    window.open(getTxUrl(result.txHash!), "_blank"),
                }
              : undefined,
          }
        );
        setUnstakeAmount("");
        // Refresh balance after successful unstake
        setTimeout(async () => {
          await refreshBalance?.();
        }, 2000);
      } else {
        toast.error("Unstaking failed", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Unstaking failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsUnstaking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Input validation helper functions
  const validateNumericInput = (value: string) => {
    // Limit input length to prevent extremely large numbers
    if (value.length > 12) {
      return value.substring(0, 12);
    }

    // Remove any non-numeric characters except decimal point
    const cleaned = value.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }

    // Prevent leading zeros except for decimal numbers
    if (cleaned.length > 1 && cleaned[0] === "0" && cleaned[1] !== ".") {
      return cleaned.substring(1);
    }

    return cleaned;
  };

  const handleStakeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedValue = validateNumericInput(e.target.value);
    setStakeAmount(validatedValue);
  };

  const handleUnstakeAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const validatedValue = validateNumericInput(e.target.value);
    setUnstakeAmount(validatedValue);
  };

  // USDC Staking input handlers
  const handleUsdcStakeAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const validatedValue = validateNumericInput(e.target.value);
    setUsdcStakeAmount(validatedValue);
  };

  const handleUsdcUnstakeAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const validatedValue = validateNumericInput(e.target.value);
    setUsdcUnstakeAmount(validatedValue);
  };

  const handleMaxUsdcStake = () => {
    // Use the standard usdcBalance as the MAX source (not the custom coin balance)
    setUsdcStakeAmount(usdcCoinBalance.toString());
  };

  const handleMaxUsdcUnstake = () => {
    setUsdcUnstakeAmount(userUsdcStakeInfo.stUSDCBalance.toString());
  };

  // USDC Staking Functions
  const handleUsdcStake = async () => {
    // console.log("USDC Stake Debug Info:", {
    //   usdcStakeAmount: usdcStakeAmount,
    //   usdcStakeAmountNum: parseFloat(usdcStakeAmount) || 0,
    //   type: typeof (parseFloat(usdcStakeAmount) || 0),
    //   isFinite: Number.isFinite(parseFloat(usdcStakeAmount) || 0),
    // });

    const usdcStakeAmountNum = parseFloat(usdcStakeAmount) || 0;

    if (usdcStakeAmountNum <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid amount to stake",
      });
      return;
    }

    // Validate against the standard usdcBalance (source of truth for available USDC)
    if (usdcStakeAmountNum > usdcCoinBalance) {
      toast.error("Insufficient balance", {
        description: "You don't have enough USD Coin to stake this amount",
      });
      return;
    }

    // Prompt wallet connection if not connected
    if (!connected) {
      const connectionSuccess = await promptConnection();
      if (!connectionSuccess) {
        toast.error("Wallet connection required", {
          description: "Please connect your wallet to stake USDC",
        });
        return;
      }
    }

    setIsUsdcStaking(true);
    try {
      const result = await stakeUSDC(usdcStakeAmountNum);

      if (result.success) {
        toast.success("USDC staking successful!", {
          description: `Staked ${usdcStakeAmountNum} USDC and received stUSDC`,
          action: result.txHash
            ? {
                label: "View Transaction",
                onClick: () =>
                  window.open(getUSDCTxUrl(result.txHash!), "_blank"),
              }
            : undefined,
        });

        // Clear form
        setUsdcStakeAmount("");

        // Refresh data
        setTimeout(async () => {
          await refreshUSDCBalance();
          await refreshUSDCCoinBalance();
          await refreshBalance?.();
          // Trigger a data refresh
          const userInfo = await getUserUSDCStakeInfo();
          if (userInfo) {
            setUserUsdcStakeInfo(userInfo);
          }
        }, 2000);
      } else {
        toast.error("USDC staking failed", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("USDC staking failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsUsdcStaking(false);
    }
  };

  const handleUsdcUnstake = async (instant: boolean = false) => {
    const usdcUnstakeAmountNum = parseFloat(usdcUnstakeAmount) || 0;

    if (usdcUnstakeAmountNum <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid amount to unstake",
      });
      return;
    }

    if (usdcUnstakeAmountNum > userUsdcStakeInfo.stUSDCBalance) {
      toast.error("Insufficient balance", {
        description: "You don't have enough stUSDC to unstake this amount",
      });
      return;
    }

    // Prompt wallet connection if not connected
    if (!connected) {
      const connectionSuccess = await promptConnection();
      if (!connectionSuccess) {
        toast.error("Wallet connection required", {
          description: "Please connect your wallet to unstake USDC",
        });
        return;
      }
    }

    setIsUsdcUnstaking(true);
    try {
      const result = await requestUnstakeUSDC(usdcUnstakeAmountNum, instant);

      if (result.success) {
        toast.success(
          instant
            ? "Instant USDC unstaking successful!"
            : "USDC unstaking request created!",
          {
            description: instant
              ? `Unstaked ${usdcUnstakeAmountNum} stUSDC instantly`
              : `Unstaking request for ${usdcUnstakeAmountNum} stUSDC created (7 day wait)`,
            action: result.txHash
              ? {
                  label: "View Transaction",
                  onClick: () =>
                    window.open(getUSDCTxUrl(result.txHash!), "_blank"),
                }
              : undefined,
          }
        );

        // Clear form
        setUsdcUnstakeAmount("");

        // Refresh data
        setTimeout(async () => {
          await refreshUSDCBalance();
          await refreshBalance?.();
          const userInfo = await getUserUSDCStakeInfo();
          if (userInfo) {
            setUserUsdcStakeInfo(userInfo);
          }
        }, 2000);
      } else {
        toast.error("USDC unstaking failed", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("USDC unstaking failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsUsdcUnstaking(false);
    }
  };

  const handleClaimUsdcRewards = async () => {
    if (userUsdcStakeInfo.pendingRewards <= 0) {
      toast.error("No rewards to claim", {
        description: "You don't have any pending rewards to claim",
      });
      return;
    }

    // Prompt wallet connection if not connected
    if (!connected) {
      const connectionSuccess = await promptConnection();
      if (!connectionSuccess) {
        toast.error("Wallet connection required", {
          description: "Please connect your wallet to claim rewards",
        });
        return;
      }
    }

    setIsClaimingRewards(true);
    try {
      const result = await claimUSDCRewards();

      if (result.success) {
        toast.success("USDC rewards claimed successfully!", {
          description: `Claimed ${userUsdcStakeInfo.pendingRewards.toFixed(
            6
          )} stUSDC rewards`,
          action: result.txHash
            ? {
                label: "View Transaction",
                onClick: () =>
                  window.open(getUSDCTxUrl(result.txHash!), "_blank"),
              }
            : undefined,
        });

        // Refresh data
        setTimeout(async () => {
          const userInfo = await getUserUSDCStakeInfo();
          if (userInfo) {
            setUserUsdcStakeInfo(userInfo);
          }
        }, 2000);
      } else {
        toast.error("Reward claim failed", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Reward claim failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsClaimingRewards(false);
    }
  };

  const handleRefreshData = async () => {
    setIsLoadingData(true);
    try {
      // console.log("Manual refresh triggered with force refresh...");

      // Clear any invalid cached data first
      clearInvalidCache();
      clearInvalidAptCache();

      // Force refresh both APT and USDC data
      const [aptData, usdcData, userUsdcInfo] = await Promise.all([
        forceRefreshAptData(),
        connected
          ? forceRefreshUSDCData()
          : Promise.resolve({
              exchangeRate: 1.0,
              protocolStats: {
                totalStaked: 0,
                totalStUSDCSupply: 0,
                usdcPoolValue: 0,
                apy: 5.0,
                exchangeRate: 1.0,
              },
            }),
        connected ? getUserUSDCStakeInfo() : Promise.resolve(null),
      ]);

      // Update state with fresh data
      setExchangeRate(aptData.exchangeRate);
      setProtocolStats(aptData.protocolStats);
      setUsdcExchangeRate(usdcData.exchangeRate);
      setUsdcProtocolStats(usdcData.protocolStats);
      setUserUsdcStakeInfo(
        userUsdcInfo || {
          stUSDCBalance: 0,
          pendingRequests: 0,
          pendingRewards: 0,
        }
      );

      // toast.success("Data refreshed successfully!", {
      //   description: "Fresh data loaded from contracts",
      // });
    } catch (error) {
      // console.error("Manual refresh failed:", error);
      toast.error("Failed to refresh data", {
        description: "Using cached data where available",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Aesthetic Background Curves */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
        >
          <path
            d="M-100 200C300 100 500 300 700 200C900 100 1100 300 1400 200"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M-100 600C200 500 400 700 600 600C800 500 1000 700 1300 600"
            stroke="url(#gradient2)"
            strokeWidth="1.5"
            fill="none"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold text-white mb-2">
                  Aptos liquid staking
                </h1>
                <div className="flex items-center flex-col space-y-3">
                  <Link to="/dashboard">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-600 border-blue-500 text-white hover:bg-blue-700"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshData}
                    disabled={isLoadingData}
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    {isLoadingData ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                    )}
                    Refresh Data
                  </Button>
                </div>
              </div>

              {/* Balance Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Aptos Balance */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-300 text-sm font-medium flex items-center">
                        {currentPool.name} balance
                        <HelpCircle className="h-4 w-4 ml-2 text-gray-500" />
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white mb-2">
                      {currentPool.available.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      {selectedAsset === "APT" ? (
                        <UsdValue aptAmount={currentPool.available} />
                      ) : (
                        `$${usdcCoinBalance.toFixed(2)}`
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      onClick={() =>
                        setStakeAmount(currentPool.available.toString())
                      }
                    >
                      Mint st{currentPool.symbol}
                    </Button>
                  </CardContent>
                </Card>

                {/* stAPT Balance */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-300 text-sm font-medium flex items-center">
                        {currentPool.liquidToken} balance
                        <HelpCircle className="h-4 w-4 ml-2 text-gray-500" />
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white mb-2">
                      {currentPool.staked.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      ≈{" "}
                      {(
                        currentPool.staked *
                        parseFloat(currentPool.conversionRate)
                      ).toFixed(2)}{" "}
                      {currentPool.name}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        onClick={() =>
                          setUnstakeAmount(currentPool.staked.toString())
                        }
                      >
                        Redeem {currentPool.name}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* USDC Balance */}
                {/* <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-300 text-sm font-medium flex items-center">
                        USDC Balance
                        <HelpCircle className="h-4 w-4 ml-2 text-gray-500" />
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {usdcBalance.toFixed(2)} USDC
                    </div>
                    <div className="text-sm text-gray-400 mb-4">
                      ≈ ${usdcBalance.toFixed(2)} USD
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-green-900 border-green-600 text-green-300 hover:bg-green-800"
                      onClick={() => setSelectedAsset("USDC")}
                    >
                      Use USDC
                    </Button>
                  </CardContent>
                </Card> */}

                {/* Redemption Card */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-300 text-sm font-medium flex items-center">
                        {currentPool.name} in redemption
                        <HelpCircle className="h-4 w-4 ml-2 text-gray-500" />
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white mb-2">
                      {currentPool.unlocked}
                      <span className="text-sm text-gray-400 ml-2">
                        {currentPool.name} Unlocked
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mb-4">
                      {currentPool.locked} {currentPool.name} locked
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed"
                      disabled
                    >
                      Withdraw
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Staking Data */}
                <div className="space-y-6">
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        Staking data
                        {/* {isLoadingData && (
                          <Loader2 className="h-4 w-4 ml-2 animate-spin text-blue-400" />
                        )} */}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm flex items-center">
                            Liquid staking st{currentPool.symbol} reward rate
                            <HelpCircle className="h-4 w-4 ml-2 text-gray-500" />
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-green-400">
                          {currentPool.apy}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm flex items-center">
                            Conversion rate
                            <HelpCircle className="h-4 w-4 ml-2 text-gray-500" />
                          </span>
                        </div>
                        <div className="text-lg text-white flex items-center">
                          1 st{currentPool.symbol} ={" "}
                          {currentPool.conversionRate} {currentPool.name}
                          <Copy
                            className="h-4 w-4 ml-2 text-gray-500 cursor-pointer hover:text-white"
                            onClick={() =>
                              copyToClipboard(
                                `1 st${currentPool.symbol} = ${currentPool.conversionRate} ${currentPool.name}`
                              )
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm flex items-center">
                            st{currentPool.symbol} supply
                            <HelpCircle className="h-4 w-4 ml-2 text-gray-500" />
                          </span>
                        </div>
                        <div className="text-lg text-white">
                          {isLoadingData ? (
                            <div className="flex items-center">
                              <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-400" />
                              Loading...
                            </div>
                          ) : (
                            currentPool.supply
                          )}
                        </div>
                      </div>

                      {/* Add debug info */}
                      {/* {process.env.NODE_ENV === "development" && (
                        <div className="pt-2 border-t border-gray-700">
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>Exchange Rate: {exchangeRate}</div>
                            <div>Total Staked: {protocolStats.totalStaked}</div>
                            <div>
                              Total stAPT: {protocolStats.totalStakedAPT}
                            </div>
                            <div>Loading: {isLoadingData.toString()}</div>
                          </div>
                        </div>
                      )} */}
                      {/* 
                    {/* Add API status indicator */}
                      {/* <div className="pt-2 border-t border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">API Status:</span>
                        <Badge
                          variant={isLoadingData ? "secondary" : "default"}
                          className={
                            isLoadingData
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {isLoadingData ? "Loading..." : "Connected"}
                        </Badge>
                      </div>
                    </div>  */}
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Staking contract
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-gray-400 text-sm mb-1">
                          Earn contract
                        </div>
                        <div className="flex items-center text-white">
                          <span className="font-mono">
                            {currentPool.contracts.earn.slice(0, 5)}...
                            {currentPool.contracts.earn.slice(-5)}
                          </span>
                          <Copy
                            className="h-4 w-4 ml-2 text-gray-500 cursor-pointer hover:text-white"
                            onClick={() =>
                              copyToClipboard(currentPool.contracts.earn)
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm mb-1">
                          Token contract
                        </div>
                        <div className="flex items-center text-white">
                          <span className="font-mono">
                            {currentPool.contracts.token}
                          </span>
                          <Copy
                            className="h-4 w-4 ml-2 text-gray-500 cursor-pointer hover:text-white"
                            onClick={() =>
                              copyToClipboard(currentPool.contracts.token)
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Action Panel */}
                <div className="space-y-6">
                  {/* Asset Selector */}
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">
                        Select Asset
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(stakingPools).map(([asset, pool]) => (
                          <Button
                            key={asset}
                            variant={
                              selectedAsset === asset ? "default" : "outline"
                            }
                            className={`h-20 flex flex-col items-center justify-center relative p-3 ${
                              selectedAsset === asset
                                ? "bg-white text-black"
                                : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                            }`}
                            onClick={() => {
                              setSelectedAsset(asset as "APT" | "USDC");
                              handleRefreshData();
                              getUSDCCoinBalance();
                            }}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="w-6 h-6 flex-shrink-0">
                                <img
                                  src={asset === "APT" ? aptosLogo : usdcLogo}
                                  alt={asset}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <span className="font-medium">{asset}</span>
                            </div>
                            <span className="text-xs opacity-80">
                              {`${pool.apy} APY`}
                            </span>
                            {asset === "USDC" && (
                              <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded-full font-bold">
                                HOT
                              </span>
                            )}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <Tabs defaultValue="stake" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                          <TabsTrigger
                            value="stake"
                            className="data-[state=active]:bg-gray-600"
                          >
                            Mint
                          </TabsTrigger>
                          <TabsTrigger
                            value="unstake"
                            className="data-[state=active]:bg-gray-600"
                          >
                            Redeem
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="stake" className="space-y-4 mt-6">
                          {!connected && (
                            <div className="flex justify-center mb-4">
                              <Button className="bg-white text-black hover:bg-gray-200 px-8">
                                Connect Wallet
                              </Button>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label
                              htmlFor="stake-amount"
                              className="text-gray-300"
                            >
                              Amount to Stake
                            </Label>
                            <div className="relative">
                              <Input
                                id="stake-amount"
                                type="text"
                                inputMode="decimal"
                                placeholder={
                                  selectedAsset === "APT" ? "0.00" : "0.00"
                                }
                                value={
                                  selectedAsset === "APT"
                                    ? stakeAmount
                                    : usdcStakeAmount
                                }
                                onChange={
                                  selectedAsset === "APT"
                                    ? handleStakeAmountChange
                                    : handleUsdcStakeAmountChange
                                }
                                disabled={false}
                                onKeyDown={(e) => {
                                  // Prevent minus sign and other invalid characters
                                  if (
                                    e.key === "-" ||
                                    e.key === "e" ||
                                    e.key === "E" ||
                                    e.key === "+"
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                                className={`bg-gray-700 border-gray-600 text-white pr-20 ${
                                  selectedAsset === "USDC"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={
                                    selectedAsset === "APT"
                                      ? handleMaxStake
                                      : handleMaxUsdcStake
                                  }
                                  disabled={false}
                                  className="h-6 px-2 text-xs text-gray-400 hover:text-white"
                                >
                                  MAX
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                              <span>
                                Available: {currentPool.available.toFixed(4)}{" "}
                                {selectedAsset}
                              </span>
                            </div>
                          </div>

                          {stakeAmountNum > 0 && (
                            <Alert className="bg-gray-700 border-gray-600">
                              <Info className="h-4 w-4 text-blue-400" />
                              <AlertDescription className="text-gray-300">
                                You will receive ~
                                {expectedLiquidTokens.toFixed(4)} st
                                {currentPool.symbol} tokens
                              </AlertDescription>
                            </Alert>
                          )}

                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                            disabled={
                              !connected ||
                              (selectedAsset === "APT"
                                ? stakeAmountNum <= 0
                                : usdcStakeAmountNum <= 0) ||
                              (selectedAsset === "APT"
                                ? isStaking
                                : isUsdcStaking)
                            }
                            onClick={handleStake}
                          >
                            {(
                              selectedAsset === "APT"
                                ? isStaking
                                : isUsdcStaking
                            ) ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Staking...
                              </>
                            ) : (
                              <>
                                <ArrowUpRight className="h-4 w-4 mr-2" />
                                Mint st{currentPool.symbol}
                              </>
                            )}
                          </Button>
                        </TabsContent>

                        <TabsContent value="unstake" className="space-y-4 mt-6">
                          {!connected && (
                            <div className="flex justify-center mb-4">
                              <Button className="bg-white text-black hover:bg-gray-200 px-8">
                                Connect Wallet
                              </Button>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label
                              htmlFor="unstake-amount"
                              className="text-gray-300"
                            >
                              Amount to Unstake
                            </Label>
                            <div className="relative">
                              <Input
                                id="unstake-amount"
                                type="text"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={
                                  selectedAsset === "APT"
                                    ? unstakeAmount
                                    : usdcUnstakeAmount
                                }
                                onChange={
                                  selectedAsset === "APT"
                                    ? handleUnstakeAmountChange
                                    : handleUsdcUnstakeAmountChange
                                }
                                disabled={false}
                                onKeyDown={(e) => {
                                  // Prevent minus sign and other invalid characters
                                  if (
                                    e.key === "-" ||
                                    e.key === "e" ||
                                    e.key === "E" ||
                                    e.key === "+"
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                                className={`bg-gray-700 border-gray-600 text-white pr-20 ${
                                  selectedAsset === "USDC"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={
                                    selectedAsset === "APT"
                                      ? handleMaxUnstake
                                      : handleMaxUsdcUnstake
                                  }
                                  disabled={false}
                                  className="h-6 px-2 text-xs text-gray-400 hover:text-white"
                                >
                                  MAX
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                              <span>
                                Available: {currentPool.staked.toFixed(4)} st
                                {selectedAsset}
                              </span>
                            </div>
                          </div>

                          {unstakeAmountNum > 0 && (
                            <Alert className="bg-gray-700 border-gray-600">
                              <Info className="h-4 w-4 text-blue-400" />
                              <AlertDescription className="text-gray-300">
                                You will receive ~
                                {(
                                  unstakeAmountNum *
                                  parseFloat(currentPool.conversionRate)
                                ).toFixed(4)}{" "}
                                {currentPool.symbol}
                              </AlertDescription>
                            </Alert>
                          )}

                          <div className="space-y-3">
                            <Button
                              className="w-full bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
                              disabled={
                                !connected ||
                                (selectedAsset === "APT"
                                  ? unstakeAmountNum <= 0
                                  : usdcUnstakeAmountNum <= 0) ||
                                (selectedAsset === "APT"
                                  ? isUnstaking
                                  : isUsdcUnstaking)
                              }
                              onClick={() => handleUnstake(true)}
                            >
                              {(
                                selectedAsset === "APT"
                                  ? isUnstaking
                                  : isUsdcUnstaking
                              ) ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Zap className="h-4 w-4 mr-2" />
                                  Instant Unstake (5% fee)
                                </>
                              )}
                            </Button>

                            <Button
                              variant="outline"
                              className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600 disabled:opacity-50"
                              disabled={
                                !connected ||
                                (selectedAsset === "APT"
                                  ? unstakeAmountNum <= 0
                                  : usdcUnstakeAmountNum <= 0) ||
                                (selectedAsset === "APT"
                                  ? isUnstaking
                                  : isUsdcUnstaking)
                              }
                              onClick={() => handleUnstake(false)}
                            >
                              {(
                                selectedAsset === "APT"
                                  ? isUnstaking
                                  : isUsdcUnstaking
                              ) ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Delayed Unstake (7 days, no fee)
                                </>
                              )}
                            </Button>
                          </div>
                        </TabsContent>

                        {/* USDC Tab
                        <TabsContent value="usdc" className="space-y-4 mt-6">
                          {!connected && (
                            <div className="flex justify-center mb-4">
                              <Button className="bg-white text-black hover:bg-gray-200 px-8">
                                Connect Wallet
                              </Button>
                            </div>
                          )} */}

                        {/* USD Coin Balance Display */}
                        {/* <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-4">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-white text-sm">
                                USD Coin Balance (Custom Token)
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-green-400 mb-2">
                                {formattedUsdcCoinBalance} USD Coin
                              </div>
                              <div className="text-sm text-gray-400 mb-4">
                                ≈ ${formattedUsdcCoinBalance} USD
                              </div> */}
                        {/* <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-blue-900 border-blue-600 text-blue-300 hover:bg-blue-800"
                                  onClick={async () => {
                                    try {
                                      await registerForUSDCCoin();
                                      toast.success("Registered for USD Coin!");
                                      await refreshUSDCCoinBalance();
                                    } catch (error) {
                                      toast.error("Registration failed");
                                    }
                                  }}
                                  disabled={!connected}
                                >
                                  Register
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-900 border-green-600 text-green-300 hover:bg-green-800"
                                  onClick={async () => {
                                    try {
                                      await mintUSDC(10); // Mint 10 USD Coin
                                      toast.success(
                                        "Minted 10 USD Coin for testing!"
                                      );
                                      await refreshUSDCCoinBalance();
                                    } catch (error) {
                                      toast.error("Minting failed");
                                    }
                                  }}
                                  disabled={!connected}
                                >
                                  Mint 10 USD Coin
                                </Button>
                              </div> */}
                        {/* </CardContent>
                          </Card>
                        </TabsContent> */}
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Modal for prompting connection */}
      <WalletModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default StakingInterface;
