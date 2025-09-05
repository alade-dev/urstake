import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Integrations from "@/components/Integrations";
import Features from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <Integrations />
        <Features />
      </main>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
                </div>
                <span className="text-xl font-bold text-foreground">AptosStake Pro</span>
              </div>
              <p className="text-muted-foreground">
                The ultimate liquid staking platform on Aptos blockchain.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Platform</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Staking Pools</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Yield Farming</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Analytics</a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Resources</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">API Reference</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Github</a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Community</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Discord</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Telegram</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 AptosStake Pro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
