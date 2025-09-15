import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import UrStakeLogo from "./UrStakeLogo";
import WalletConnection from "./WalletConnection";

interface NavItem {
  label: string;
  href: string;
  badge?: {
    text: string;
    variant: string;
  };
}

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Stake", href: "/stake" },
    {
      label: "Send",
      href: "/send",
      badge: { text: "HOT", variant: "yellow" },
    },
    { label: "Faucet", href: "/faucet" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-44 pt-3">
      <nav className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-full shadow-xl">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <UrStakeLogo size="sm" />
                <span className="text-xl font-bold text-white">UrStake</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                      isActive
                        ? " bg-white/80 text-blue-600"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <div className="relative flex items-center">
                      {item.badge && (
                        <Badge
                          className="absolute -top-2 -right-6 bg-yellow-500 text-black text-[8px] py-0 px-1 min-w-[20px] h-4 font-bold"
                          variant="outline"
                        >
                          {item.badge.text}
                        </Badge>
                      )}
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* CTA Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <WalletConnection />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-700 bg-gray-900/95 backdrop-blur-md rounded-b-md">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;

                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={`relative px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-md mx-2 ${
                        isActive
                          ? "text-white bg-gray-800"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="relative flex items-center">
                        {item.badge && (
                          <Badge
                            className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[8px] py-0 px-1 min-w-[20px] h-4 font-bold"
                            variant="outline"
                          >
                            {item.badge.text}
                          </Badge>
                        )}
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
                <div className="px-4 pt-2">
                  <WalletConnection />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
