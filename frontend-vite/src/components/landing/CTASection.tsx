
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-cyan-500 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your Business?</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of wholesale businesses that are already using TenantBloom to streamline their operations.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="btn-3d">
              Get Started
            </Button>
          </Link>
          <Link to="/demo">
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              Request a Demo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
