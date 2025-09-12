import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface UrStakeLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const UrStakeLogo = ({ size = "lg", className }: UrStakeLogoProps) => {
  const sizeClasses = {
    sm: "w-12 h-8",
    md: "w-20 h-12",
    lg: "w-32 h-20",
    xl: "w-40 h-24",
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 28,
    xl: 32,
  };

  const dotSizes = {
    sm: {
      large: "w-1.5 h-1.5",
      medium: "w-1 h-1",
      small: "w-1 h-1",
    },
    md: {
      large: "w-2 h-2",
      medium: "w-1.5 h-1.5",
      small: "w-1.5 h-1.5",
    },
    lg: {
      large: "w-3 h-3",
      medium: "w-2 h-2",
      small: "w-2 h-2",
    },
    xl: {
      large: "w-4 h-4",
      medium: "w-3 h-3",
      small: "w-3 h-3",
    },
  };

  const positions = {
    sm: {
      dot1: "top-1 left-1",
      dot2: "top-1 left-3",
      dot3: "top-3 left-2",
    },
    md: {
      dot1: "top-1.5 left-1.5",
      dot2: "top-1.5 left-4",
      dot3: "top-4 left-2.5",
    },
    lg: {
      dot1: "top-2 left-2",
      dot2: "top-2 left-7",
      dot3: "top-6 left-4",
    },
    xl: {
      dot1: "top-2.5 left-2.5",
      dot2: "top-2.5 left-8",
      dot3: "top-7 left-5",
    },
  };

  return (
    <div
      className={cn(
        sizeClasses[size],
        "bg-foreground rounded-lg flex items-center justify-center relative",
        className
      )}
    >
      <div
        className={cn(
          "absolute bg-background rounded-full",
          dotSizes[size].large,
          positions[size].dot1
        )}
      ></div>
      <div
        className={cn(
          "absolute bg-background rounded-full",
          dotSizes[size].medium,
          positions[size].dot2
        )}
      ></div>
      <div
        className={cn(
          "absolute bg-background rounded-full",
          dotSizes[size].small,
          positions[size].dot3
        )}
      ></div>
      <TrendingUp size={iconSizes[size]} className="text-background" />
    </div>
  );
};

export default UrStakeLogo;
