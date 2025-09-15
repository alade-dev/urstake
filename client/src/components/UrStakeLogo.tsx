import { cn } from "@/lib/utils";

interface UrStakeLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const UrStakeLogo = ({ size = "lg", className }: UrStakeLogoProps) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  };

  // Using the PNG logo with round white background
  return (
    <div
      className={cn(
        sizeClasses[size],
        "bg-white/90 rounded-full flex items-center  border-blue-800 border-4 justify-center p-1 shadow-lg",
        className
      )}
    >
      <img
        src="/urstake.png"
        alt="UrStake Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default UrStakeLogo;
