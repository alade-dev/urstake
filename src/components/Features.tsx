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
  Coins
} from "lucide-react";

const Features = () => {
  const coreFeatures = [
    {
      title: "Multi-Asset Liquid Staking",
      description: "Stake APT and USDC while maintaining liquidity through tradeable staking tokens.",
      icon: Lock,
      gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
      title: "Automated Yield Optimization",
      description: "AI-powered strategies automatically compound rewards and optimize yield across protocols.",
      icon: TrendingUp,
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      title: "Instant Liquidity",
      description: "Trade your staked assets instantly through DEX integration without unstaking delays.",
      icon: Zap,
      gradient: "from-yellow-500/20 to-orange-500/20"
    },
    {
      title: "Social Staking Pools",
      description: "Join community-managed pools with shared strategies and governance participation.",
      icon: Users,
      gradient: "from-pink-500/20 to-red-500/20"
    }
  ];

  const advancedFeatures = [
    {
      title: "Cross-Protocol Integration",
      description: "Seamlessly interact with multiple DeFi protocols for maximum yield opportunities",
      icon: Globe,
      stats: "5+ Protocols"
    },
    {
      title: "Advanced Analytics",
      description: "Real-time insights and performance tracking powered by industry-leading analytics",
      icon: BarChart3,
      stats: "Real-time Data"
    },
    {
      title: "Enterprise Security",
      description: "Multi-signature wallets and audited smart contracts for institutional-grade security",
      icon: Shield,
      stats: "99.9% Uptime"
    },
    {
      title: "Multi-Currency Support",
      description: "Native support for APT, USDC, and other major assets with global accessibility",
      icon: Coins,
      stats: "Global Access"
    }
  ];

  return (
    <section id="features" className="py-20 bg-muted/30 relative">
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
              className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm p-8 hover:shadow-glow/20 transition-all duration-300 group"
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon size={28} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Advanced Features */}
        <div className="space-y-12">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Advanced Capabilities
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade features built for institutional and professional users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedFeatures.map((feature, index) => (
              <Card 
                key={feature.title}
                className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm p-6 hover:shadow-glow/20 transition-all duration-300 group hover:scale-105"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <feature.icon size={24} className="text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.stats}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
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
                Join thousands of users who are already earning optimized returns 
                through our advanced liquid staking platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button className="bg-gradient-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:shadow-glow hover:scale-105 transition-all duration-300">
                  Start Staking Now
                </button>
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