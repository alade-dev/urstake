/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useUrStakeContract } from "@/hooks/useUrStakeContract";
import { useUSDCStaking } from "@/hooks/useUSDCStaking";
import { UsdValue, AptWithUsd } from "@/components/UsdValue";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Copy,
  BarChart3,
  PieChart,
  ArrowLeft,
  Zap,
  Calendar,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface StakingPosition {
  asset: string;
  symbol: string;
  staked: string;
  stakedValue: string;
  underlyingAmount: string;
  apy: string;
  dailyRewards: string;
  conversionRate: string;
  active: boolean;
}

const StakingPositions = () => {
  const { balance, walletAddress } = useWallet();
  const {
    getProtocolStats,
    getUserStakeInfo,
    getExchangeRate,
    getPendingUnstakingRequests,
    getAptPrice,
    connected,
  } = useUrStakeContract();

  const {
    getUSDCProtocolStats,
    getUserUSDCStakeInfo,
    getUSDCExchangeRate,
    getPendingUSDCUnstakingRequests,
  } = useUSDCStaking();

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
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [aptPrice, setAptPrice] = useState(0); // Default fallback price

  // Fetch real protocol and user data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      // Don't require wallet connection to view the page
      if (!connected || !walletAddress) {
        setLoading(false);
        setPositionsLoading(false);
        setOverviewLoading(false);
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

          setOverviewLoading(false);
          setPositionsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching staking data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
          setOverviewLoading(false);
          setPositionsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [connected, walletAddress]); // Simplified dependencies

  // Calculate real values with proper null checks
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

  const stakingApy = 7.8;
  const usdcStakingApy = usdcProtocolStats?.apy || 5.2;

  const estimatedDailyRewards = isNaN((totalStaked * stakingApy) / 100 / 365)
    ? 0
    : (totalStaked * stakingApy) / 100 / 365;
  const estimatedMonthlyRewards = estimatedDailyRewards * 30;
  const estimatedYearlyRewards = estimatedDailyRewards * 365;

  const estimatedUSDCDailyRewards = isNaN(
    (totalUSDCStaked * usdcStakingApy) / 100 / 365
  )
    ? 0
    : (totalUSDCStaked * usdcStakingApy) / 100 / 365;
  const estimatedUSDCMonthlyRewards = estimatedUSDCDailyRewards * 30;
  const estimatedUSDCYearlyRewards = estimatedUSDCDailyRewards * 365;

  // Real staking positions
  const stakingPositions: StakingPosition[] = [
    {
      asset: "stAPT",
      symbol: "APT",
      staked: safeStAptBalance.toFixed(4),
      stakedValue: totalStaked.toFixed(2),
      underlyingAmount: (safeStAptBalance * safeExchangeRate).toFixed(4),
      apy: "7.8%",
      dailyRewards: estimatedDailyRewards.toFixed(4),
      conversionRate: safeExchangeRate.toFixed(6),
      active: safeStAptBalance > 0,
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

  const navigate = useNavigate();

  const navigateToStake = () => {
    navigate("/stake");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Loading skeleton components
  const OverviewCardsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <Card
          key={i}
          className="bg-gray-800/50 border-gray-700 backdrop-blur-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 bg-gray-600 rounded w-20 animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-600 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-gray-600 rounded w-24 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-700 rounded w-32 animate-pulse"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const PositionsLoadingSkeleton = () => (
    <div className="space-y-6 max-h-[600px] overflow-y-auto">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="p-6 rounded-lg border border-gray-700 bg-gray-800/30 animate-pulse"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-600"></div>
              <div>
                <div className="h-6 bg-gray-600 rounded w-20 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-32"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="h-8 bg-gray-600 rounded w-24 mb-2"></div>
              <div className="h-6 bg-gray-700 rounded w-16"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((j) => (
              <div key={j} className="p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-3 bg-gray-700 rounded w-20"></div>
                  <div className="h-4 w-4 bg-gray-700 rounded"></div>
                </div>
                <div className="h-6 bg-gray-600 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-20"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((j) => (
              <div key={j}>
                <div className="h-3 bg-gray-700 rounded w-20 mb-1"></div>
                <div className="h-5 bg-gray-600 rounded w-16"></div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex-1 h-10 bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background */}
      <div className="absolute inset-0 opacity-25">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
        >
          <path
            d="M-100 150C350 50 550 250 750 150C950 50 1150 250 1450 150"
            stroke="url(#positionsGradient1)"
            strokeWidth="1.5"
            fill="none"
          />
          <defs>
            <linearGradient
              id="positionsGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10">
        <Navigation />

        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="text-gray-400 hover:text-white mb-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Staking Positions
                  </h1>
                  <p className="text-gray-400">
                    Manage and monitor your liquid staking positions
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Total Portfolio Value</p>
                  {overviewLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-8 bg-gray-600 rounded w-32 animate-pulse"></div>
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-white">
                      $
                      {(
                        safeAptBalance * aptPrice +
                        totalStaked +
                        totalUSDCStaked
                      ).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Overview Cards */}
            {overviewLoading ? (
              <OverviewCardsSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      Total Staked
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      ${(totalStaked + totalUSDCStaked).toFixed(2)}
                    </div>
                    <p className="text-xs text-gray-400">
                      {safeStAptBalance.toFixed(4)} stAPT +{" "}
                      {safeStUSDCBalance.toFixed(4)} stUSDC
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      Daily Rewards
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      $
                      {(
                        estimatedDailyRewards + estimatedUSDCDailyRewards
                      ).toFixed(2)}
                    </div>
                    <p className="text-xs text-green-400">
                      +
                      {(
                        ((estimatedDailyRewards + estimatedUSDCDailyRewards) /
                          (totalStaked + totalUSDCStaked)) *
                        100
                      ).toFixed(3)}
                      % daily
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      Current APY
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      {stakingApy.toFixed(2)}%
                    </div>
                    <p className="text-xs text-gray-400">
                      Estimated annual yield
                    </p>
                  </CardContent>
                </Card>

                {/* <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Pending Requests
                  </CardTitle>
                  <Clock className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {userStakeInfo.pendingRequests +
                      userUSDCStakeInfo.pendingRequests}
                  </div>
                  <p className="text-xs text-gray-400">Unstaking requests</p>
                </CardContent>
              </Card> */}
              </div>
            )}

            {/* Active Positions */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>Active Staking Positions</span>
                    {positionsLoading && (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>
                  {!positionsLoading && (
                    <Badge
                      variant="secondary"
                      className="bg-gray-700 text-gray-300"
                    >
                      {stakingPositions.filter((p) => p.active).length} active
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your current liquid staking positions and earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {positionsLoading ? (
                  <PositionsLoadingSkeleton />
                ) : stakingPositions.filter((p) => p.active).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <Wallet className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-xl font-medium mb-2">
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
                ) : (
                  <div className="space-y-6 max-h-[600px] overflow-y-auto">
                    {stakingPositions
                      .filter((position) => position.active)
                      .map((position, index) => (
                        <div
                          key={position.asset}
                          className="p-6 rounded-lg border  border-gray-700 bg-gray-800/30"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                              {position.asset === "stAPT" ? (
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-2">
                                  <img
                                    src={stAptosLogo}
                                    alt="stAptos"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ) : position.asset === "stUSDC" ? (
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center p-2">
                                  <img
                                    src={usdcLogo}
                                    alt="stUSDC"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                  {position.asset.slice(0, 3)}
                                </div>
                              )}
                              <div>
                                <h3 className="text-xl font-bold text-white">
                                  {position.asset}
                                </h3>
                                <p className="text-gray-400">
                                  Liquid Staking Token
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-white">
                                ${position.stakedValue}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge
                                  variant="secondary"
                                  className="bg-green-900 text-green-300"
                                >
                                  {position.apy} APY
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="p-4 bg-gray-700/30 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-sm">
                                  Staked Amount
                                </span>
                                <Wallet className="h-4 w-4 text-blue-400" />
                              </div>
                              <p className="text-xl font-bold text-white">
                                {position.staked} {position.asset}
                              </p>
                              <p className="text-sm text-gray-400">
                                ≈ {position.underlyingAmount} {position.symbol}
                              </p>
                            </div>

                            <div className="p-4 bg-gray-700/30 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-sm">
                                  Daily Rewards
                                </span>
                                <TrendingUp className="h-4 w-4 text-green-400" />
                              </div>
                              <p className="text-xl font-bold text-green-400">
                                +${position.dailyRewards}
                              </p>
                              <p className="text-sm text-gray-400">
                                ≈{" "}
                                {position.asset === "stAPT"
                                  ? (
                                      parseFloat(position.dailyRewards) /
                                      aptPrice
                                    ).toFixed(4)
                                  : parseFloat(position.dailyRewards).toFixed(
                                      4
                                    )}{" "}
                                {position.symbol}
                              </p>
                            </div>

                            <div className="p-4 bg-gray-700/30 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-sm">
                                  Exchange Rate
                                </span>
                                <BarChart3 className="h-4 w-4 text-purple-400" />
                              </div>
                              <p className="text-xl font-bold text-white">
                                {position.conversionRate}
                              </p>
                              <p className="text-sm text-gray-400">
                                1 {position.asset} = {position.conversionRate}{" "}
                                {position.symbol}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                              <Label className="text-gray-400 text-sm">
                                Monthly Rewards
                              </Label>
                              <p className="text-lg font-semibold text-white">
                                $
                                {position.asset === "stAPT"
                                  ? estimatedMonthlyRewards.toFixed(2)
                                  : estimatedUSDCMonthlyRewards.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <Label className="text-gray-400 text-sm">
                                Yearly Rewards
                              </Label>
                              <p className="text-lg font-semibold text-white">
                                $
                                {position.asset === "stAPT"
                                  ? estimatedYearlyRewards.toFixed(2)
                                  : estimatedUSDCYearlyRewards.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <Label className="text-gray-400 text-sm">
                                Performance
                              </Label>
                              <p className="text-lg font-semibold text-green-400">
                                +
                                {position.asset === "stAPT"
                                  ? stakingApy.toFixed(2)
                                  : usdcStakingApy.toFixed(2)}
                                % APY
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700">
                            <Button
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                              onClick={navigateToStake}
                            >
                              <ArrowUpRight className="h-4 w-4 mr-2" />
                              Stake More
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                              onClick={navigateToStake}
                            >
                              <ArrowDownRight className="h-4 w-4 mr-2" />
                              Unstake
                            </Button>
                            <Link to={"/transaction-history"}>
                              <Button
                                variant="outline"
                                className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                              >
                                <BarChart3 className="h-4 w-4 mr-2" />
                                View History
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rewards Analytics */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">
                    Rewards Projection
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Estimated earnings over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-400">1 Day</span>
                      <span className="text-white font-semibold">
                        ${estimatedDailyRewards.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-400">1 Week</span>
                      <span className="text-white font-semibold">
                        ${(estimatedDailyRewards * 7).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-400">1 Month</span>
                      <span className="text-white font-semibold">
                        ${estimatedMonthlyRewards.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
                      <span className="text-green-400">1 Year</span>
                      <span className="text-green-400 font-bold text-lg">
                        ${estimatedYearlyRewards.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">
                    Performance Metrics
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your staking performance overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">APY Performance</span>
                        <span className="text-white">
                          {stakingApy.toFixed(2)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min((stakingApy / 25) * 100, 100)}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Position Health</span>
                        <span className="text-green-400">Excellent</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Market Exposure</span>
                        <span className="text-white">
                          {(
                            (totalStaked /
                              (safeAptBalance * aptPrice + totalStaked)) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (totalStaked /
                            (safeAptBalance * aptPrice + totalStaked)) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingPositions;
