
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../ThemeToggle';

const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Toggle the mobile sidebar
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      </div>
      
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div 
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-40 transition-transform transform duration-300",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar collapsed={false} setCollapsed={() => {}} />
      </div>
      
      {/* Main content */}
      <div 
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[240px]"
        )}
      >
        {/* Dashboard top bar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center px-4 sticky top-0 z-10">
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden mr-2" 
            onClick={toggleMobileSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <div className="flex-1 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* User avatar */}
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                J
              </div>
            </div>
          </div>
        </header>
        
        {/* Dashboard content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
