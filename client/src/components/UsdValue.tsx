import React, { useEffect, useState } from "react";
import { getFormattedUsdValue } from "@/utils/priceService";

interface UsdValueProps {
  aptAmount: number;
  className?: string;
  showSymbol?: boolean;
  loading?: boolean;
}

export const UsdValue: React.FC<UsdValueProps> = ({
  aptAmount,
  className = "",
  showSymbol = true,
  loading = false,
}) => {
  const [usdValue, setUsdValue] = useState<string>("");

  useEffect(() => {
    if (loading || aptAmount === 0) {
      setUsdValue(showSymbol ? "$0.00" : "0.00");
      return;
    }

    getFormattedUsdValue(aptAmount)
      .then(setUsdValue)
      .catch(() => setUsdValue(showSymbol ? "$--" : "--"));
  }, [aptAmount, showSymbol, loading]);

  if (loading) {
    return (
      <span className={`text-gray-400 animate-pulse ${className}`}>
        {showSymbol ? "$..." : "..."}
      </span>
    );
  }

  return <span className={`text-gray-500 ${className}`}>{usdValue}</span>;
};

interface AptWithUsdProps {
  aptAmount: number;
  aptClassName?: string;
  usdClassName?: string;
  showAptSymbol?: boolean;
  loading?: boolean;
}

export const AptWithUsd: React.FC<AptWithUsdProps> = ({
  aptAmount,
  aptClassName = "",
  usdClassName = "text-sm text-gray-500",
  showAptSymbol = true,
  loading = false,
}) => {
  return (
    <div className="flex flex-col">
      <span className={aptClassName}>
        {loading
          ? "..."
          : `${aptAmount.toFixed(6)}${showAptSymbol ? " APT" : ""}`}
      </span>
      <UsdValue
        aptAmount={aptAmount}
        className={usdClassName}
        loading={loading}
      />
    </div>
  );
};

export default UsdValue;
