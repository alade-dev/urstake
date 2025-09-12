/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
import { useUrStakeContract } from "@/hooks/useUrStakeContract";
import { useUSDCStaking } from "@/hooks/useUSDCStaking";
import { UsdValue, AptWithUsd } from "@/components/UsdValue";
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
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Activity,
  Search,
  Filter,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { TransactionCard } from "@/components/TransactionCard";

// Transaction interfaces
interface Transaction {
  id: number;
  type:
    | "stake"
    | "unstake_request"
    | "unstake_complete"
    | "usdc_stake"
    | "usdc_unstake_request"
    | "usdc_unstake_complete"
    | "usdc_claim_rewards";
  asset: string;
  amount: string;
  timestamp: string;
  status: "completed" | "pending";
  txHash: string;
  fee?: string;
  stTokensReceived?: string;
  aptToReceive?: string;
  aptReceived?: string;
  usdcToReceive?: string;
  usdcReceived?: string;
  rewardsClaimed?: string;
  completionTime?: string;
  instant?: boolean;
}

// Transaction Card Component

const TransactionHistory = () => {
  const { walletAddress } = useWallet();
  const {
    getTxUrl,
    getPendingUnstakingRequests,
    getTransactionHistory,
    connected,
  } = useUrStakeContract();

  const { getPendingUSDCUnstakingRequests, getTxUrl: getUSDCTxUrl } =
    useUSDCStaking();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch real transaction history
  useEffect(() => {
    let isMounted = true;

    const fetchTransactionHistory = async () => {
      // Don't require wallet connection to load the page, but show empty state
      if (!connected || !walletAddress) {
        setLoading(false);
        setAllTransactions([]);
        return;
      }

      setLoading(true);

      try {
        // Fetch both pending requests and historical transactions
        const [pendingRequests, historicalTxs, pendingUSDCRequests] =
          await Promise.all([
            getPendingUnstakingRequests(),
            getTransactionHistory ? getTransactionHistory(walletAddress) : [],
            getPendingUSDCUnstakingRequests
              ? getPendingUSDCUnstakingRequests()
              : [],
          ]);

        const realTransactions: Transaction[] = [];

        // Convert pending unstaking requests to transactions
        pendingRequests.forEach(
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
              id: Date.now() + index, // Unique ID
              type: "unstake_request",
              asset: "stAPT",
              amount: request.amount.toString(),
              aptToReceive: (request.amount * 1.05).toFixed(4),
              timestamp: new Date(request.timestamp * 1000).toISOString(),
              status: "pending",
              txHash: `pending_${request.requestIndex}`,
              completionTime: new Date(
                request.timestamp * 1000 + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
              instant: request.instant,
            });
          }
        );

        // Convert pending USDC unstaking requests to transactions
        pendingUSDCRequests.forEach(
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
              type: "usdc_unstake_request",
              asset: "stUSDC",
              amount: request.amount.toString(),
              usdcToReceive: (request.amount * 1.02).toFixed(4),
              timestamp: new Date(request.timestamp * 1000).toISOString(),
              status: "pending",
              txHash: `pending_usdc_${request.requestIndex}`,
              completionTime: new Date(
                request.timestamp * 1000 + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
              instant: request.instant,
            });
          }
        );

        // Convert historical transactions
        if (Array.isArray(historicalTxs)) {
          historicalTxs.forEach((tx: any, index: number) => {
            const payload = tx.payload;
            const functionName = payload?.function || "";

            let transactionType:
              | "stake"
              | "unstake_request"
              | "unstake_complete"
              | "usdc_stake"
              | "usdc_unstake_request"
              | "usdc_unstake_complete"
              | "usdc_claim_rewards" = "stake";
            let asset = "APT";
            let amount = tx.parsedAmount || "0";
            let stTokensReceived = tx.stTokensReceived || "";
            let aptToReceive = tx.aptToReceive || "";
            let aptReceived = "";
            let usdcToReceive = "";
            let usdcReceived = "";
            let rewardsClaimed = "";

            if (functionName.includes("usdc_staking")) {
              // USDC transactions
              if (functionName.includes("stake_usdc")) {
                transactionType = "usdc_stake";
                asset = "USDC";
                stTokensReceived = tx.stTokensReceived || amount;
              } else if (functionName.includes("request_unstake_usdc")) {
                transactionType = "usdc_unstake_request";
                asset = "stUSDC";
                usdcToReceive = tx.usdcToReceive || amount;
              } else if (functionName.includes("complete_unstaking_usdc")) {
                transactionType = "usdc_unstake_complete";
                asset = "stUSDC";
                usdcReceived = amount;
              } else if (functionName.includes("claim_rewards")) {
                transactionType = "usdc_claim_rewards";
                asset = "stUSDC";
                rewardsClaimed = amount;
              }
            } else {
              // APT transactions
              if (functionName.includes("request_unstake")) {
                transactionType = "unstake_request";
                asset = "stAPT";
                amount = tx.parsedAmount || "0";
                aptToReceive = tx.aptToReceive || amount;
              } else if (functionName.includes("complete_unstake")) {
                transactionType = "unstake_complete";
                asset = "stAPT";
                amount = tx.parsedAmount || "0";
                aptReceived = amount;
              } else if (functionName.includes("stake")) {
                transactionType = "stake";
                asset = "APT";
                amount = tx.parsedAmount || "0";
                stTokensReceived = tx.stTokensReceived || amount;
              }
            }

            realTransactions.push({
              id: Date.now() + index + 1000,
              type: transactionType,
              asset,
              amount,
              stTokensReceived,
              aptToReceive,
              aptReceived,
              usdcToReceive,
              usdcReceived,
              rewardsClaimed,
              timestamp: new Date(
                Math.floor(parseInt(tx.timestamp) / 1000)
              ).toISOString(),
              status: tx.success ? "completed" : "pending",
              txHash: tx.hash,
              fee: (
                (parseInt(tx.gas_used || "0") *
                  parseInt(tx.gas_unit_price || "100")) /
                100000000
              ).toFixed(6),
            });
          });
        }

        if (isMounted) {
          // Sort by timestamp (newest first)
          realTransactions.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setAllTransactions(realTransactions);
        }
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        if (isMounted) {
          setAllTransactions([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTransactionHistory();

    return () => {
      isMounted = false;
    };
  }, [connected, walletAddress]); // Simplified dependencies

  const filteredTransactions = allTransactions.filter((tx) => {
    const matchesSearch =
      tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount.includes(searchTerm);
    const matchesType =
      selectedType === "all" ||
      tx.status === selectedType ||
      tx.type === selectedType;
    return matchesSearch && matchesType;
  });

  const completedTransactions = filteredTransactions.filter(
    (tx) => tx.status === "completed"
  );
  const pendingTransactions = filteredTransactions.filter(
    (tx) => tx.status === "pending"
  );

  const navigate = useNavigate();

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
            stroke="url(#txGradient1)"
            strokeWidth="1.5"
            fill="none"
          />
          <defs>
            <linearGradient id="txGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
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
                    Transaction History
                  </h1>
                  <p className="text-gray-400">
                    View and manage all your staking transactions
                  </p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-white">Filters & Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by transaction hash, type, or amount..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedType === "all" ? "default" : "outline"}
                      onClick={() => setSelectedType("all")}
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    >
                      All
                    </Button>
                    <Button
                      variant={
                        selectedType === "completed" ? "default" : "outline"
                      }
                      onClick={() => setSelectedType("completed")}
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    >
                      Completed
                    </Button>
                    <Button
                      variant={
                        selectedType === "pending" ? "default" : "outline"
                      }
                      onClick={() => setSelectedType("pending")}
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    >
                      Pending
                    </Button>
                    <Button
                      variant={selectedType === "stake" ? "default" : "outline"}
                      onClick={() => setSelectedType("stake")}
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    >
                      Stakes
                    </Button>
                    <Button
                      variant={
                        selectedType === "unstake_request"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setSelectedType("unstake_request")}
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    >
                      Unstakes
                    </Button>
                    <Button
                      variant={
                        selectedType === "usdc_stake" ? "default" : "outline"
                      }
                      onClick={() => setSelectedType("usdc_stake")}
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    >
                      USDC
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction List */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  All Transactions
                  <Badge
                    variant="secondary"
                    className="bg-gray-700 text-gray-300"
                  >
                    {filteredTransactions.length} transactions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <Activity className="h-16 w-16 mb-4 opacity-50 animate-spin" />
                    <p className="text-xl font-medium mb-2">
                      Loading Transactions
                    </p>
                    <p className="text-sm">
                      Fetching your transaction history...
                    </p>
                  </div>
                ) : (
                  <Tabs defaultValue="all" className="w-full">
                    <div className="px-6 pt-6">
                      <TabsList className="grid w-full grid-cols-3 bg-gray-700 mb-6">
                        <TabsTrigger value="all" className="text-gray-300">
                          All ({filteredTransactions.length})
                        </TabsTrigger>
                        <TabsTrigger
                          value="completed"
                          className="text-gray-300"
                        >
                          Completed ({completedTransactions.length})
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="text-gray-300">
                          Pending ({pendingTransactions.length})
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent
                      value="all"
                      className="space-y-6 max-h-[600px] overflow-y-auto px-6 pb-6"
                    >
                      {filteredTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                          <Activity className="h-16 w-16 mb-4 opacity-50" />
                          <p className="text-xl font-medium mb-2">
                            No Transactions Found
                          </p>
                          <p className="text-sm">
                            Try adjusting your search or filters
                          </p>
                        </div>
                      ) : (
                        filteredTransactions.map((tx) => (
                          <TransactionCard
                            key={tx.id}
                            transaction={tx}
                            getTxUrl={
                              tx.asset.includes("USDC")
                                ? getUSDCTxUrl
                                : getTxUrl
                            }
                          />
                        ))
                      )}
                    </TabsContent>

                    <TabsContent
                      value="completed"
                      className="space-y-6 max-h-[600px] overflow-y-auto px-6 pb-6"
                    >
                      {completedTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                          <CheckCircle className="h-16 w-16 mb-4 opacity-50" />
                          <p className="text-xl font-medium mb-2">
                            No Completed Transactions
                          </p>
                          <p className="text-sm">
                            Completed transactions will appear here
                          </p>
                        </div>
                      ) : (
                        completedTransactions.map((tx) => (
                          <TransactionCard
                            key={tx.id}
                            transaction={tx}
                            getTxUrl={
                              tx.asset.includes("USDC")
                                ? getUSDCTxUrl
                                : getTxUrl
                            }
                          />
                        ))
                      )}
                    </TabsContent>

                    <TabsContent
                      value="pending"
                      className="space-y-6 max-h-[600px] overflow-y-auto px-6 pb-6"
                    >
                      {pendingTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                          <AlertCircle className="h-16 w-16 mb-4 opacity-50" />
                          <p className="text-xl font-medium mb-2">
                            No Pending Transactions
                          </p>
                          <p className="text-sm">
                            Pending transactions will appear here
                          </p>
                        </div>
                      ) : (
                        pendingTransactions.map((tx) => (
                          <TransactionCard
                            key={tx.id}
                            transaction={tx}
                            getTxUrl={
                              tx.asset.includes("USDC")
                                ? getUSDCTxUrl
                                : getTxUrl
                            }
                            showProgress={false}
                          />
                        ))
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
