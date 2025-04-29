
import { FileText, Box, Users, ChartBar, Settings, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    name: 'Invoice Management',
    description: 'Create, edit, and track invoices. Send professional invoices to your customers.',
    icon: FileText,
    color: 'blue',
  },
  {
    name: 'Lot Management',
    description: 'Group your inventory into lots. Track inventory levels and movements.',
    icon: Box,
    color: 'green',
  },
  {
    name: 'Customer & Vendor Management',
    description: 'Manage your customer and vendor relationships. Store contact information and track interactions.',
    icon: Users,
    color: 'purple',
  },
  {
    name: 'Payment Tracking',
    description: 'Track installment-based payments. Get notified when payments are due.',
    icon: ChartBar,
    color: 'amber',
  },
  {
    name: 'Customizable Branding',
    description: 'Customize your platform with your branding. Upload logo, choose color scheme, and edit about info.',
    icon: Settings,
    color: 'rose',
  },
  {
    name: '3D Interactive Dashboard',
    description: 'Visualize your data with interactive 3D charts and graphs. Make informed business decisions.',
    icon: BarChart3,
    color: 'indigo',
  }
];

const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const getIconColor = (color: string) => {
    const colorMap: Record<string, string> = {
      'blue': 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
      'green': 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
      'purple': 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
      'amber': 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
      'rose': 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30',
      'indigo': 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30',
    };
    return colorMap[color] || colorMap['blue'];
  };

  return (
    <div className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Powerful Features
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Everything you need to manage your wholesale business efficiently
          </p>
        </div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              className="card-3d bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-xl shadow-sm"
              variants={itemVariants}
              whileHover="hover"
            >
              <div className={`h-14 w-14 rounded-xl flex items-center justify-center mb-6 ${getIconColor(feature.color)}`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{feature.name}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
              
              <div className="mt-6">
                <a 
                  href="#" 
                  className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Learn more
                  <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-20 text-center">
          <a 
            href="/demo" 
            className="inline-flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-8 rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 transition-all duration-300"
          >
            Request a Demo
            <svg className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <p className="text-sm mt-4 text-slate-500 dark:text-slate-400">
            See how our platform can transform your wholesale business
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
