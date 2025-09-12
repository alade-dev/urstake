import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Copy,
  ExternalLink,
} from "lucide-react";
import { AptWithUsd } from "./UsdValue";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";

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

interface TransactionCardProps {
  transaction: Transaction;
  getTxUrl: (hash: string) => string;
  showProgress?: boolean;
}

export const TransactionCard = ({
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "stake":
        return <ArrowUpRight className="h-5 w-5" />;
      case "unstake_request":
        return <Clock className="h-5 w-5" />;
      case "unstake_complete":
        return <ArrowDownRight className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "stake":
        return "Stake APT";
      case "unstake_request":
        return "Unstake Request";
      case "unstake_complete":
        return "Unstake Complete";
      case "usdc_stake":
        return "Stake USDC";
      case "usdc_unstake_request":
        return "USDC Unstake Request";
      case "usdc_unstake_complete":
        return "USDC Unstake Complete";
      case "usdc_claim_rewards":
        return "Claim USDC Rewards";
      default:
        return type;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getCompletionProgress = () => {
    if (
      (transaction.type !== "unstake_request" &&
        transaction.type !== "usdc_unstake_request") ||
      transaction.status !== "pending"
    )
      return 0;

    const now = new Date().getTime();
    const requestTime = new Date(transaction.timestamp).getTime();
    const completionTime = new Date(transaction.completionTime!).getTime();
    const totalDuration = completionTime - requestTime;
    const elapsed = now - requestTime;

    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  };

  return (
    <div className="p-6 rounded-lg border border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(
              transaction.type
            )}`}
          >
            {getTypeIcon(transaction.type)}
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">
              {getTypeLabel(transaction.type)}
            </h3>
            <p className="text-sm text-gray-400 flex items-center mt-1">
              <Clock className="h-4 w-4 mr-2" />
              {formatTimestamp(transaction.timestamp)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(transaction.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white mb-2">
            {transaction.type === "stake" && (
              <>
                <div className="text-right">
                  <AptWithUsd
                    aptAmount={Number(
                      parseFloat(transaction.amount).toFixed(2)
                    )}
                    aptClassName="text-xl font-bold"
                    usdClassName="text-sm text-gray-400"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  → {Number(transaction.stTokensReceived).toFixed(2)} stAPT
                </p>
              </>
            )}
            {transaction.type === "unstake_request" && (
              <>
                <p className="text-xl font-bold">
                  {Number(transaction.amount).toFixed(2)} stAPT
                </p>
                <div className="text-right mt-1">
                  <p className="text-sm text-gray-400">→ </p>
                  <AptWithUsd
                    aptAmount={Number(
                      parseFloat(transaction.aptToReceive || "0").toFixed(2)
                    )}
                    aptClassName="text-sm text-gray-400"
                    usdClassName="text-xs text-gray-500"
                  />
                </div>
              </>
            )}
            {transaction.type === "unstake_complete" && (
              <>
                <div className="text-right">
                  <AptWithUsd
                    aptAmount={Number(
                      parseFloat(transaction.aptReceived || "0").toFixed(2)
                    )}
                    aptClassName="text-xl font-bold"
                    usdClassName="text-sm text-gray-400"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  from {Number(transaction.amount).toFixed(2)} stAPT
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
                ? "bg-green-900 text-green-300"
                : "bg-yellow-900 text-yellow-300"
            }
          >
            {transaction.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {showProgress &&
        transaction.type === "unstake_request" &&
        transaction.status === "pending" && (
          <div className="mb-4 p-4 bg-gray-700/30 rounded-lg">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Unstaking Progress</span>
              <span>{Math.round(getCompletionProgress())}%</span>
            </div>
            <Progress value={getCompletionProgress()} className="h-3 mb-2" />
            <p className="text-sm text-gray-400">
              Completes on{" "}
              {new Date(transaction.completionTime!).toLocaleDateString()} at{" "}
              {new Date(transaction.completionTime!).toLocaleTimeString()}
            </p>
          </div>
        )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        {/* Hide transaction hash and actions for pending transactions */}
        {transaction.status === "pending" ? (
          <span className="text-sm text-gray-400">Pending transaction</span>
        ) : (
          <>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Transaction:</span>
              <span className="font-mono text-gray-300 text-sm">
                {transaction.txHash.slice(0, 20)}...
                {transaction.txHash.slice(-8)}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              {transaction.fee && (
                <span className="text-xs text-gray-500">
                  Fee: {transaction.fee}{" "}
                  {transaction.type === "stake"
                    ? "APT"
                    : transaction.instant
                    ? "APT (5% instant)"
                    : "APT"}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(transaction.txHash)}
                className="text-gray-400 hover:text-white"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  window.open(getTxUrl(transaction.txHash), "_blank")
                }
                className="text-gray-400 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
