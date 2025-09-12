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
    { label: "Faucet", href: "/faucet" },

    { label: "Dashboard", href: "/dashboard" },
    { label: "Stake", href: "/stake" },
    {
      label: "Send",
      href: "/send",
      badge: { text: "HOT", variant: "yellow" },
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <UrStakeLogo size="sm" />
              <span className="text-xl font-bold text-white">UrStake</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;

              // Check if it's an anchor link (starts with #) or a route
              if (item.href.startsWith("#")) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                );
              } else {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`relative transition-colors duration-200 ${
                      isActive ? "text-white" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <div className="relative flex flex-col items-center">
                      {item.badge && (
                        <Badge
                          className="absolute -top-3 -right-5 bg-yellow-500 text-black text-[8px] py-0 px-1 min-w-[20px] h-4"
                          variant="outline"
                        >
                          {item.badge.text}
                        </Badge>
                      )}
                      <span className="pb-1">{item.label}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </Link>
                );
              }
            })}
          </div>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <WalletConnection />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700 bg-gray-800/50 backdrop-blur-md">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;

                // Check if it's an anchor link (starts with #) or a route
                if (item.href.startsWith("#")) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 px-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  );
                } else {
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={`relative transition-colors duration-200 px-4 ${
                        isActive
                          ? "text-white"
                          : "text-gray-300 hover:text-white"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="relative flex items-center">
                        {item.badge && (
                          <Badge
                            className="absolute -top-2 -right-1 bg-green-600 text-white text-[8px] py-0 px-1 min-w-[20px] h-4"
                            variant="outline"
                          >
                            {item.badge.text}
                          </Badge>
                        )}
                        <span
                          className={`${
                            isActive ? "border-b-2 border-blue-500 pb-1" : ""
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    </Link>
                  );
                }
              })}
              <div className="px-4 pt-2">
                <WalletConnection />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
