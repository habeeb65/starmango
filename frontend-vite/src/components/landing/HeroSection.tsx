
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="hero-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col lg:flex-row items-center">
        {/* Hero content */}
        <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
            Wholesale Management <span className="text-gradient">Made Simple</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl">
            A powerful multi-tenant SaaS platform designed specifically for wholesale businesses. Manage your inventory, customers, and invoices all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/signup">
              <Button size="lg" className="btn-3d">
                Get Started
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg">
                Request a Demo
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Hero image */}
        <div className="lg:w-1/2 relative animate-[fade-in_0.6s_ease-out]">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-2xl opacity-30 animate-float"></div>
            <div className="glass-card p-4 relative z-10">
              <img 
                src="/placeholder.svg" 
                alt="Dashboard Preview" 
                className="rounded-lg shadow-md" 
              />
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-[10%] -right-12 glass-card p-3 hidden md:block animate-float" style={{animationDelay: "0.5s"}}>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <p className="text-sm font-medium">Sales Increasing</p>
            </div>
          </div>
          
          <div className="absolute bottom-[15%] -left-8 glass-card p-3 hidden md:block animate-float" style={{animationDelay: "1s"}}>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
              <p className="text-sm font-medium">Inventory Updated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
