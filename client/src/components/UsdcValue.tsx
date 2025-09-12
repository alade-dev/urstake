import { useState, useEffect } from "react";

interface UsdcValueProps {
  usdcAmount: number | string;
  className?: string;
  showSymbol?: boolean;
  precision?: number;
}

interface UsdcDisplayProps {
  usdcAmount: number | string;
  usdcClassName?: string;
  showSymbol?: boolean;
  precision?: number;
}

export const UsdcValue = ({
  usdcAmount,
  className = "",
  showSymbol = true,
  precision = 2,
}: UsdcValueProps) => {
  const [displayAmount, setDisplayAmount] = useState<string>("0.00");

  useEffect(() => {
    const amount =
      typeof usdcAmount === "string" ? parseFloat(usdcAmount) : usdcAmount;
    if (isNaN(amount)) {
      setDisplayAmount("0.00");
    } else {
      setDisplayAmount(amount.toFixed(precision));
    }
  }, [usdcAmount, precision]);

  return (
    <span className={className}>
      {showSymbol && "$"}
      {displayAmount} {showSymbol && "USDC"}
    </span>
  );
};

export const UsdcDisplay = ({
  usdcAmount,
  usdcClassName = "text-green-400",
  showSymbol = true,
  precision = 2,
}: UsdcDisplayProps) => {
  return (
    <div className="flex flex-col">
      <UsdcValue
        usdcAmount={usdcAmount}
        className={usdcClassName}
        showSymbol={showSymbol}
        precision={precision}
      />
    </div>
  );
};

// Helper component for USDC balance display with styling
export const UsdcBalanceCard = ({
  balance,
  title = "USDC Balance",
  className = "",
}: {
  balance: number;
  title?: string;
  className?: string;
}) => {
  return (
    <div
      className={`p-4 rounded-lg bg-green-900/20 border border-green-600/30 ${className}`}
    >
      <p className="text-sm text-green-400 mb-1">{title}</p>
      <UsdcValue
        usdcAmount={balance}
        className="text-xl font-bold text-green-400"
        showSymbol={true}
        precision={2}
      />
    </div>
  );
};
