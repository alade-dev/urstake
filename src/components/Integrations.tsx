import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  BarChart3, 
  TrendingUp, 
  Users, 
  ArrowLeftRight,
  Palette
} from "lucide-react";

const Integrations = () => {
  const integrations = [
    {
      name: "Circle",
      description: "USDC integration for global staking and cross-border rewards",
      icon: DollarSign,
      color: "bg-blue-500/20 text-blue-400",
      features: ["USDC Staking", "Global Payments", "Stable Rewards"]
    },
    {
      name: "Hyperion",
      description: "DEX integration for liquid token trading and LP farming",
      icon: ArrowLeftRight,
      color: "bg-purple-500/20 text-purple-400",
      features: ["Token Swaps", "LP Farming", "Price Feeds"]
    },
    {
      name: "Merkle Trade",
      description: "Advanced trading with leveraged liquid staking positions", 
      icon: TrendingUp,
      color: "bg-green-500/20 text-green-400",
      features: ["Leveraged Staking", "Derivatives", "Advanced Strategies"]
    },
    {
      name: "Panora",
      description: "Real-time analytics and yield optimization insights",
      icon: BarChart3,
      color: "bg-yellow-500/20 text-yellow-400",
      features: ["Analytics Dashboard", "Yield Optimization", "Performance Tracking"]
    },
    {
      name: "Kofi",
      description: "Social staking pools and community-driven strategies",
      icon: Users,
      color: "bg-pink-500/20 text-pink-400",
      features: ["Social Pools", "Community Strategies", "Referral System"]
    },
    {
      name: "Move Language",
      description: "Advanced smart contracts for secure multi-asset staking",
      icon: Palette,
      color: "bg-orange-500/20 text-orange-400",
      features: ["Smart Contracts", "Security", "Composability"]
    }
  ];

  return (
    <section id="integrations" className="py-20 bg-background relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center space-y-6 mb-16">
          <Badge variant="outline" className="text-primary border-primary/50">
            Sponsor Integrations
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Powered by Industry Leaders
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AptosStake Pro integrates with the best protocols in the ecosystem to deliver 
            unparalleled DeFi functionality and yield optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {integrations.map((integration, index) => (
            <Card 
              key={integration.name}
              className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm p-8 hover:shadow-glow/20 transition-all duration-300 group hover:scale-105"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${integration.color}`}>
                    <integration.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{integration.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      Integration Partner
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {integration.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/80">Key Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {integration.features.map((feature) => (
                      <Badge 
                        key={feature} 
                        variant="outline" 
                        className="text-xs border-primary/30 text-muted-foreground"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Integration Flow Visualization */}
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
                <span className="text-sm font-medium text-foreground">Deposit</span>
              </div>
              <div className="w-8 h-0.5 bg-primary/50 hidden md:block"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <TrendingUp size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Stake</span>
              </div>
              <div className="w-8 h-0.5 bg-primary/50 hidden md:block"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <ArrowLeftRight size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Trade</span>
              </div>
              <div className="w-8 h-0.5 bg-primary/50 hidden md:block"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <BarChart3 size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Optimize</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;