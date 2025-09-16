import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  TrendingUp,
  Zap,
  Users,
  Shield,
  Globe,
  BarChart3,
  Coins,
  DollarSign,
  ArrowLeftRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  const coreFeatures = [
    {
      title: "Liquid APT & USDC Staking",
      description:
        "Stake your APT and USDC tokens while receiving stAPT and stUSDC - tradeable liquid staking tokens that represent your staked position and continue earning rewards.",
      icon: Lock,
      gradient: "from-blue-500 via-purple-500 to-indigo-600",
      bgGradient: "from-blue-500/10 via-purple-500/5 to-indigo-600/10",
      iconColor: "text-blue-400",
    },
    {
      title: "Smart Yield Compounding",
      description:
        "UrStake automatically compounds your staking rewards, maximizing your returns without manual intervention. Watch your yield grow exponentially over time.",
      icon: TrendingUp,
      gradient: "from-emerald-500 via-green-500 to-teal-600",
      bgGradient: "from-emerald-500/10 via-green-500/5 to-teal-600/10",
      iconColor: "text-emerald-400",
    },
    {
      title: "Instant Exit Liquidity",
      description:
        "No more waiting for unstaking periods. Trade your stAPT and stUSDC tokens instantly on DEXs or use our built-in swap feature for immediate liquidity access.",
      icon: Zap,
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      bgGradient: "from-yellow-500/10 via-orange-500/5 to-red-500/10",
      iconColor: "text-yellow-400",
    },
    {
      title: "Community Governance",
      description:
        "Participate in UrStake governance decisions. Stake holders can vote on protocol upgrades, fee structures, and new feature implementations through our DAO.",
      icon: Users,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      bgGradient: "from-pink-500/10 via-rose-500/5 to-red-500/10",
      iconColor: "text-pink-400",
    },
  ];

  const advancedFeatures = [
    {
      title: "Cross-Protocol Integration",
      description:
        "Seamlessly interact with multiple DeFi protocols for maximum yield opportunities",
      icon: Globe,
      stats: "5+ Protocols",
    },
    {
      title: "Advanced Analytics",
      description:
        "Real-time insights and performance tracking powered by industry-leading analytics",
      icon: BarChart3,
      stats: "Real-time Data",
    },
    {
      title: "Enterprise Security",
      description:
        "Multi-signature wallets and audited smart contracts for institutional-grade security",
      icon: Shield,
      stats: "99.9% Uptime",
    },
    {
      title: "Multi-Currency Support",
      description:
        "Native support for APT, USDC, and other major assets with global accessibility",
      icon: Coins,
      stats: "Global Access",
    },
  ];

  return (
    <section id="features" className="py-10 bg-muted/30 relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <Badge variant="outline" className="text-primary border-primary/50">
            Platform Features
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Built for the Future of DeFi
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience next-generation liquid staking with automated strategies,
            social features, and seamless protocol integration.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {coreFeatures.map((feature, index) => (
            <Card
              key={feature.title}
              className="relative bg-gradient-to-br from-white/5 to-white/10 border border-white/10 shadow-2xl backdrop-blur-md p-8 hover:shadow-blue-500/20 transition-all duration-500 group overflow-hidden hover:scale-[1.02] hover:-translate-y-1"
            >
              {/* Animated Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>

              {/* Floating Orbs Animation */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-orange-600/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700 delay-100"></div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                  >
                    <feature.icon
                      size={32}
                      className={`${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
                      {feature.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Seamless Protocol Integration
          </h3>
          <div className="bg-gradient-card border border-border/50 rounded-2xl p-8 shadow-card">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <DollarSign size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Deposit
                </span>
              </div>
              <div className="w-8 h-0.5 bg-primary/50 hidden md:block"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <TrendingUp size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Stake
                </span>
              </div>
              <div className="w-8 h-0.5 bg-primary/50 hidden md:block"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <ArrowLeftRight size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Trade
                </span>
              </div>
              <div className="w-8 h-0.5 bg-primary/50 hidden md:block"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <BarChart3 size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Optimize
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm p-12 max-w-4xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-foreground">
                Ready to Maximize Your Yield?
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of users who are already earning optimized
                returns through our advanced liquid staking platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/dashboard">
                  <button className="bg-gradient-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:shadow-glow hover:scale-105 transition-all duration-300">
                    Start Staking Now
                  </button>
                </Link>
                <button className="bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-secondary/80 transition-colors">
                  View Documentation
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
