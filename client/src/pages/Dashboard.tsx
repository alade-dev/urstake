/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useUrStakeContract } from "@/hooks/useUrStakeContract";
import { useUSDC } from "@/hooks/useUSDC";
import { useUSDCStaking } from "@/hooks/useUSDCStaking";
import { getFormattedUsdValue } from "@/utils/priceService";
import { UsdValue, AptWithUsd } from "@/components/UsdValue";
import { UsdcValue, UsdcBalanceCard } from "@/components/UsdcValue";
import stAptosLogo from "@/assets/logo/stAptos.png";
import usdcLogo from "@/assets/logo/usdc.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import {
  TrendingUp,
  DollarSign,
  Wallet,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  Copy,
  HelpCircle,
  BarChart3,
  PieChart,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

// Transaction interfaces
interface Transaction {
  id: number;
  type: "stake" | "unstake_request" | "unstake_complete";
  asset: string;
  amount: string;
  timestamp: string;
  status: "completed" | "pending";
  txHash: string;
  fee?: string;
  stTokensReceived?: string;
  aptToReceive?: string;
  aptReceived?: string;
  completionTime?: string;
  instant?: boolean;
}

interface TransactionCardProps {
  transaction: Transaction;
  getTxUrl: (hash: string) => string;
  showProgress?: boolean;
}

// Transaction Card Component
const TransactionCard = ({
  transaction,
  getTxUrl,
  showProgress = false,
}: TransactionCardProps) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Less than 1 hour ago";
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "stake":
        return <ArrowUpRight className="h-4 w-4" />;
      case "unstake_request":
        return <Clock className="h-4 w-4" />;
      case "unstake_complete":
        return <ArrowDownRight className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "stake":
        return "bg-green-900 text-green-400";
      case "unstake_request":
        return "bg-yellow-900 text-yellow-400";
      case "unstake_complete":
        return "bg-orange-900 text-orange-400";
      default:
        return "bg-blue-900 text-blue-400";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "stake":
        return "Stake";
      case "unstake_request":
        return "Unstake Request";
      case "unstake_complete":
        return "Unstake Complete";
      default:
        return type;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getCompletionProgress = () => {
    if (
      transaction.type !== "unstake_request" ||
      transaction.status !== "pending"
    )
      return 0;

    const now = new Date().getTime();
    const requestTime = new Date(transaction.timestamp).getTime();
    const completionTime = new Date(transaction.completionTime).getTime();
    const totalDuration = completionTime - requestTime;
    const elapsed = now - requestTime;

    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  };

  return (
    <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(
              transaction.type
            )}`}
          >
            {getTypeIcon(transaction.type)}
          </div>
          <div>
            <p className="font-medium text-white">
              {getTypeLabel(transaction.type)}
            </p>
            <p className="text-sm text-gray-400 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatTimestamp(transaction.timestamp)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white">
            {transaction.type === "stake" && (
              <>
                <AptWithUsd
                  aptAmount={parseFloat(transaction.amount)}
                  aptClassName="font-medium"
                />
                <p className="text-sm text-gray-400">
                  → {transaction.stTokensReceived} stAPT
                </p>
              </>
            )}
            {transaction.type === "unstake_request" && (
              <>
                <p className="font-medium">{transaction.amount} stAPT</p>
                <p className="text-sm text-gray-400">
                  → {transaction.aptToReceive} APT
                </p>
              </>
            )}
            {transaction.type === "unstake_complete" && (
              <>
                <p className="font-medium">{transaction.aptReceived} APT</p>
                <p className="text-sm text-gray-400">
                  from {transaction.amount} stAPT
                </p>
              </>
            )}
          </div>
          <Badge
            variant={
              transaction.status === "completed" ? "default" : "secondary"
            }
            className={
              transaction.status === "completed"
                ? "bg-green-900 text-green-300 mt-1"
                : "bg-yellow-900 text-yellow-300 mt-1"
            }
          >
            {transaction.status}
          </Badge>
        </div>
      </div>

      {showProgress &&
        transaction.type === "unstake_request" &&
        transaction.status === "pending" && (
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Unstaking Progress</span>
              <span>{Math.round(getCompletionProgress())}%</span>
            </div>
            <Progress value={getCompletionProgress()} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              Completes on{" "}
              {new Date(transaction.completionTime).toLocaleDateString()}
            </p>
          </div>
        )}

      <div className="flex items-center justify-between text-sm text-gray-400">
        <span className="font-mono">
          {transaction.txHash.slice(0, 20)}...{transaction.txHash.slice(-8)}
        </span>
        <div className="flex items-center space-x-2">
          <Copy
            className="h-3 w-3 cursor-pointer hover:text-white"
            onClick={() => copyToClipboard(transaction.txHash)}
          />
          <ExternalLink
            className="h-3 w-3 cursor-pointer hover:text-white"
            onClick={() => window.open(getTxUrl(transaction.txHash), "_blank")}
          />
        </div>
      </div>

      {transaction.fee && (
        <div className="mt-2 text-xs text-gray-500">
          Fee: {transaction.fee}{" "}
          {transaction.type === "stake"
            ? "APT"
            : transaction.instant
            ? "APT (5% instant fee)"
            : "APT"}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { balance, walletAddress } = useWallet();
  const {
    getProtocolStats,
    getUserStakeInfo,
    getExchangeRate,
    getPendingUnstakingRequests,
    getAptPrice,
    getTxUrl,
    connected,
  } = useUrStakeContract();

  const {
    getUSDCProtocolStats,
    getUserUSDCStakeInfo,
    getUSDCExchangeRate,
    getPendingUSDCUnstakingRequests,
  } = useUSDCStaking();

  const { usdcBalance, formattedUsdcBalance } = useUSDC();

  const [protocolStats, setProtocolStats] = useState({
    totalStaked: 0,
    totalStakedAPT: 0,
    aptPoolValue: 0,
    exchangeRate: 1.0,
  });

  const [userStakeInfo, setUserStakeInfo] = useState({
    stAptBalance: 0,
    pendingRequests: 0,
  });

  const [userUSDCStakeInfo, setUserUSDCStakeInfo] = useState({
    stUSDCBalance: 0,
    pendingRequests: 0,
    pendingRewards: 0,
  });

  const [usdcProtocolStats, setUSDCProtocolStats] = useState({
    totalStaked: 0,
    totalStUSDCSupply: 0,
    usdcPoolValue: 0,
    apy: 0,
    exchangeRate: 1.0,
  });

  const [pendingUnstakingRequests, setPendingUnstakingRequests] = useState([]);
  const [pendingUSDCUnstakingRequests, setPendingUSDCUnstakingRequests] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [aptPrice, setAptPrice] = useState(0); // Default fallback price

  // Fetch real protocol and user data only when needed
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!connected || !walletAddress) {
        setLoading(false);
        return;
      }

      try {
        const [
          stats,
          userInfo,
          pendingRequests,
          currentAptPrice,
          usdcStats,
          userUSDCInfo,
          pendingUSDCRequests,
        ] = await Promise.all([
          getProtocolStats(),
          getUserStakeInfo(),
          getPendingUnstakingRequests(),
          getAptPrice(),
          getUSDCProtocolStats(),
          getUserUSDCStakeInfo(),
          getPendingUSDCUnstakingRequests
            ? getPendingUSDCUnstakingRequests()
            : [],
        ]);

        if (isMounted) {
          setProtocolStats(stats);
          if (userInfo) setUserStakeInfo(userInfo);
          setPendingUnstakingRequests(pendingRequests);
          setAptPrice(currentAptPrice);

          if (usdcStats) setUSDCProtocolStats(usdcStats);
          if (userUSDCInfo) setUserUSDCStakeInfo(userUSDCInfo);
          setPendingUSDCUnstakingRequests(pendingUSDCRequests);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [connected, walletAddress]); // Simplified dependencies

  // Calculate real portfolio values with proper null checks
  const safeAptBalance = balance?.apt || 0;
  const safeStAptBalance = userStakeInfo?.stAptBalance || 0;
  const safeExchangeRate = protocolStats?.exchangeRate || 1.0;

  // USDC calculations
  const safeStUSDCBalance = userUSDCStakeInfo?.stUSDCBalance || 0;
  const safeUSDCExchangeRate = usdcProtocolStats?.exchangeRate || 1.0;

  const totalStaked = isNaN(safeStAptBalance * aptPrice * safeExchangeRate)
    ? 0
    : safeStAptBalance * aptPrice * safeExchangeRate;

  const totalUSDCStaked = isNaN(safeStUSDCBalance * safeUSDCExchangeRate)
    ? 0
    : safeStUSDCBalance * safeUSDCExchangeRate;

  const portfolioValue = isNaN(
    safeAptBalance * aptPrice +
      safeStAptBalance * aptPrice * safeExchangeRate +
      totalUSDCStaked
  )
    ? 0
    : safeAptBalance * aptPrice +
      safeStAptBalance * aptPrice * safeExchangeRate +
      totalUSDCStaked;

  const stakingApy = 7.8; // This would come from the protocol stats
  const usdcStakingApy = usdcProtocolStats?.apy || 5.2;
  const estimatedDailyRewards = isNaN((totalStaked * stakingApy) / 100 / 365)
    ? 0
    : (totalStaked * stakingApy) / 100 / 365;

  const estimatedUSDCDailyRewards = isNaN(
    (totalUSDCStaked * usdcStakingApy) / 100 / 365
  )
    ? 0
    : (totalUSDCStaked * usdcStakingApy) / 100 / 365;

  // Real staking positions based on user data with null checks
  const stakingPositions = [
    {
      asset: "stAPT",
      symbol: "APT",
      staked: safeStAptBalance.toFixed(4),
      stakedValue: totalStaked.toFixed(2),
      underlyingAmount: (safeStAptBalance * safeExchangeRate).toFixed(4),
      apy: "7.8%",
      dailyRewards: estimatedDailyRewards.toFixed(4),
      conversionRate: safeExchangeRate.toFixed(6),
      active: userStakeInfo.stAptBalance > 0,
    },
    {
      asset: "stUSDC",
      symbol: "USDC",
      staked: safeStUSDCBalance.toFixed(4),
      stakedValue: totalUSDCStaked.toFixed(2),
      underlyingAmount: (safeStUSDCBalance * safeUSDCExchangeRate).toFixed(4),
      apy: `${usdcStakingApy.toFixed(1)}%`,
      dailyRewards: estimatedUSDCDailyRewards.toFixed(4),
      conversionRate: safeUSDCExchangeRate.toFixed(6),
      active: safeStUSDCBalance > 0,
    },
  ];

  // Real transaction history state
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
    []
  );

  // Fetch real transaction data
  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!connected || !walletAddress) return;

      try {
        // In a real implementation, you would fetch from an indexer or transaction service
        // For now, we'll use only pending unstaking requests as real data
        const realTransactions: Transaction[] = [];

        // Add pending unstaking requests as transactions
        pendingUnstakingRequests.forEach(
          (
            request: {
              amount: number;
              timestamp: number;
              instant: boolean;
              requestIndex: number;
            },
            index: number
          ) => {
            realTransactions.push({
              id: index + 1,
              type: "unstake_request",
              asset: "stAPT",
              amount: request.amount.toString(),
              aptToReceive: (request.amount * safeExchangeRate).toFixed(4),
              timestamp: new Date(request.timestamp * 1000).toISOString(),
              status: "pending",
              txHash: "0x" + Math.random().toString(16).substr(2, 64),
              completionTime: new Date(
                request.timestamp * 1000 + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
              instant: request.instant,
            });
          }
        );

        // Add pending USDC unstaking requests as transactions
        pendingUSDCUnstakingRequests.forEach(
          (
            request: {
              amount: number;
              timestamp: number;
              instant: boolean;
              requestIndex: number;
            },
            index: number
          ) => {
            realTransactions.push({
              id: Date.now() + index + 5000, // Unique ID
              type: "unstake_request",
              asset: "stUSDC",
              amount: request.amount.toString(),
              aptToReceive: (request.amount * safeUSDCExchangeRate).toFixed(4),
              timestamp: new Date(request.timestamp * 1000).toISOString(),
              status: "pending",
              txHash: "pending_usdc_" + request.requestIndex,
              completionTime: new Date(
                request.timestamp * 1000 + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
              instant: request.instant,
            });
          }
        );

        setTransactionHistory(realTransactions);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        setTransactionHistory([]);
      }
    };

    fetchTransactionHistory();
  }, [
    connected,
    walletAddress,
    pendingUnstakingRequests,
    pendingUSDCUnstakingRequests,
    safeExchangeRate,
    safeUSDCExchangeRate,
  ]);

  const completedTransactions = transactionHistory.filter(
    (tx) => tx.status === "completed"
  );
  const pendingTransactions = transactionHistory.filter(
    (tx) => tx.status === "pending"
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Aesthetic Background Curves */}
      <div className="absolute inset-0 opacity-25">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
        >
          <path
            d="M-100 150C350 50 550 250 750 150C950 50 1150 250 1450 150"
            stroke="url(#dashboardGradient1)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-100 450C250 350 450 550 650 450C850 350 1050 550 1350 450"
            stroke="url(#dashboardGradient2)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M-100 650C400 550 600 750 800 650C1000 550 1200 750 1500 650"
            stroke="url(#dashboardGradient3)"
            strokeWidth="1"
            fill="none"
          />
          <defs>
            <linearGradient
              id="dashboardGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient
              id="dashboardGradient2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient
              id="dashboardGradient3"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Portfolio Dashboard
              </h1>
              <div className="flex items-center text-gray-400">
                <span>Connected: </span>
                <span className="ml-2 font-mono text-white">
                  {walletAddress
                    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(
                        -4
                      )}`
                    : "Not connected"}
                </span>
                {walletAddress && (
                  <Copy
                    className="h-4 w-4 ml-2 cursor-pointer hover:text-white"
                    onClick={() => copyToClipboard(walletAddress)}
                  />
                )}
              </div>
            </div>

            {/* Portfolio Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                    Total Portfolio
                    <HelpCircle className="h-4 w-4 ml-2 text-gray-500" />
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ${portfolioValue.toFixed(2)}
                  </div>
                  <p className="text-xs text-green-400 flex items-center">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +0% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                    Total Staked
                    <HelpCircle className="h-4 w-4 ml-2 text-gray-500" />
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    ${(totalStaked + totalUSDCStaked).toFixed(2)}
                  </div>
                  <p className="text-xs text-gray-400">
                    Across {stakingPositions.filter((p) => p.active).length}{" "}
                    positions
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                    Average APY
                    <HelpCircle className="h-4 w-4 ml-2 text-gray-500" />
                  </CardTitle>
                  <Activity className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {totalStaked + totalUSDCStaked > 0
                      ? (
                          (stakingApy * totalStaked +
                            usdcStakingApy * totalUSDCStaked) /
                          (totalStaked + totalUSDCStaked)
                        ).toFixed(2)
                      : stakingApy.toFixed(2)}
                    %
                  </div>
                  <p className="text-xs text-gray-400">
                    Estimated annual yield
                  </p>
                </CardContent>
              </Card>

              {/* <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                    USDC Balance
                    <HelpCircle className="h-4 w-4 ml-2 text-gray-500" />
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    <UsdcValue
                      usdcAmount={usdcBalance}
                      showSymbol={false}
                      precision={2}
                    />
                  </div>
                  <p className="text-xs text-green-400 mt-1">
                    Stable value ready for DeFi
                  </p>
                </CardContent>
              </Card> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Active Positions */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    Active Staking Positions
                    <Link to={"/staking-positions"}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your current liquid staking positions and rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stakingPositions
                      .filter((position) => position.active)
                      .map((position) => (
                        <div
                          key={position.asset}
                          className="p-4 rounded-lg border border-gray-700 bg-gray-800/30"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              {position.asset === "stAPT" ? (
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5">
                                  <img
                                    src={stAptosLogo}
                                    alt="stAptos"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ) : position.asset === "stUSDC" ? (
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5">
                                  <img
                                    src={usdcLogo}
                                    alt="stUSDC"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                  {position.asset.slice(0, 3)}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-white">
                                  {position.asset}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {position.staked} staked
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-white">
                                ${position.stakedValue}
                              </p>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant="secondary"
                                  className="bg-green-900 text-green-300"
                                >
                                  {position.apy}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">
                                Underlying APT:
                              </span>
                              <p className="text-white font-mono">
                                {position.underlyingAmount} APT
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-400">
                                Daily Rewards:
                              </span>
                              <p className="text-green-400 font-medium">
                                +${position.dailyRewards}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {stakingPositions.filter((p) => p.active).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                      <Wallet className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">
                        No Active Positions
                      </p>
                      <p className="text-sm mb-4">
                        Start staking to see your positions here
                      </p>
                      <Link to={"/stake"}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Start Staking
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Transaction History */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    Transaction History
                    <Link to="/transaction-history">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your staking and unstaking transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                      <TabsTrigger value="all" className="text-gray-300">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="completed" className="text-gray-300">
                        Completed
                      </TabsTrigger>
                      <TabsTrigger value="pending" className="text-gray-300">
                        Pending
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4 mt-4">
                      {transactionHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                          <Activity className="h-12 w-12 mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2">
                            No Transactions Yet
                          </p>
                          <p className="text-sm mb-4">
                            Start staking to see your transaction history
                          </p>
                        </div>
                      ) : (
                        transactionHistory
                          .slice(0, 3)
                          .map((tx) => (
                            <TransactionCard
                              key={tx.id}
                              transaction={tx}
                              getTxUrl={getTxUrl}
                            />
                          ))
                      )}
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-4 mt-4">
                      {completedTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                          <CheckCircle className="h-8 w-8 mb-2 opacity-50" />
                          <p className="text-sm">No completed transactions</p>
                        </div>
                      ) : (
                        completedTransactions
                          .slice(0, 3)
                          .map((tx) => (
                            <TransactionCard
                              key={tx.id}
                              transaction={tx}
                              getTxUrl={getTxUrl}
                            />
                          ))
                      )}
                    </TabsContent>

                    <TabsContent value="pending" className="space-y-4 mt-4">
                      {pendingTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                          <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                          <p className="text-sm">No pending transactions</p>
                        </div>
                      ) : (
                        pendingTransactions.map((tx) => (
                          <TransactionCard
                            key={tx.id}
                            transaction={tx}
                            getTxUrl={getTxUrl}
                            showProgress
                          />
                        ))
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mt-8 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-400">
                  Common actions to manage your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/stake">
                  <Button
                    variant="outline"
                    className="mb-4 w-full h-12 flex items-center justify-center space-x-2 bg-blue-600 border-blue-500 text-white hover:bg-blue-700"
                  >
                    <DollarSign className="h-5 w-5" />
                    <span>Stake APT</span>
                  </Button>
                </Link>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    <ArrowUpRight className="h-6 w-6" />
                    <span>Mint stTokens</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    <ArrowDownRight className="h-6 w-6" />
                    <span>Redeem Tokens</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    <TrendingUp className="h-6 w-6" />
                    <span>Claim Rewards</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span>View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
