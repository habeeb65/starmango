
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Box, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  
  const navItems = [
    { 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      href: '/dashboard' 
    },
    { 
      name: 'Invoices', 
      icon: FileText, 
      href: '/dashboard/invoices' 
    },
    { 
      name: 'Lots', 
      icon: Box, 
      href: '/dashboard/lots' 
    },
    { 
      name: 'Customers', 
      icon: Users, 
      href: '/dashboard/customers' 
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      href: '/dashboard/settings' 
    },
  ];

  return (
    <div 
      className={cn(
        "h-screen fixed top-0 left-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col transition-all duration-300 z-40",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="py-4 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center">
        <Link to="/dashboard" className="flex items-center">
          {!collapsed && (
            <span className="text-xl font-bold text-gradient">TenantBloom</span>
          )}
          {collapsed && (
            <span className="text-xl font-bold text-gradient">TB</span>
          )}
        </Link>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 py-6 px-3 flex flex-col">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" 
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600 dark:text-blue-400" : "")} />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto">
          <Link
            to="/logout"
            className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-md"
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Link>
        </div>
      </div>
      
      {/* Collapse button */}
      <div className="py-4 px-3 border-t border-slate-200 dark:border-slate-800 flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
