
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  FileText,
  Box,
  Users,
  TrendingUp,
  Calendar,
  Bell,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Sample data for charts
const salesData = [
  { month: 'Jan', amount: 4000 },
  { month: 'Feb', amount: 3000 },
  { month: 'Mar', amount: 2000 },
  { month: 'Apr', amount: 2780 },
  { month: 'May', amount: 1890 },
  { month: 'Jun', amount: 2390 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Welcome back! Here's an overview of your business
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button>
            <Bell className="h-4 w-4 mr-2" />
            View Notifications
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Invoices" 
          value="189" 
          description="32 pending payment" 
          icon={FileText} 
          trend="up" 
          percentage="12"
        />
        <StatsCard 
          title="Active Lots" 
          value="24" 
          description="8 low on inventory" 
          icon={Box} 
          trend="down" 
          percentage="5"
        />
        <StatsCard 
          title="Customers" 
          value="543" 
          description="12 new this month" 
          icon={Users} 
          trend="up" 
          percentage="8"
        />
        <StatsCard 
          title="Revenue" 
          value="$48,423" 
          description="This month" 
          icon={TrendingUp} 
          trend="up" 
          percentage="15"
        />
      </div>

      {/* Charts and data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="card-3d">
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
            <CardDescription>Sales performance for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card className="card-3d">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Activity items */}
              <ActivityItem
                icon={FileText}
                title="New Invoice Created"
                description="Invoice #1234 for Customer A"
                time="10 minutes ago"
              />
              <ActivityItem
                icon={Users}
                title="New Customer Added"
                description="Mango Wholesalers Ltd."
                time="2 hours ago"
              />
              <ActivityItem
                icon={Box}
                title="Inventory Updated"
                description="Lot #24 quantity decreased by 50 units"
                time="Yesterday"
              />
              <ActivityItem
                icon={TrendingUp}
                title="Payment Received"
                description="$2,450 for Invoice #1122"
                time="2 days ago"
              />
            </div>
            
            <div className="mt-6">
              <Button variant="ghost" size="sm" className="w-full">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick actions */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ActionCard
            title="Create Invoice"
            icon={FileText}
            href="/dashboard/invoices/new"
          />
          <ActionCard
            title="Add Customer"
            icon={Users}
            href="/dashboard/customers/new"
          />
          <ActionCard
            title="Manage Lots"
            icon={Box}
            href="/dashboard/lots"
          />
          <ActionCard
            title="Customize Branding"
            icon={TrendingUp}
            href="/dashboard/settings"
          />
        </div>
      </div>
    </div>
  );
};

// Helper components
type StatsCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: 'up' | 'down' | 'neutral';
  percentage: string;
};

const StatsCard = ({ title, value, description, icon: Icon, trend, percentage }: StatsCardProps) => {
  return (
    <Card className="card-3d">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
          </div>
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="mt-4 flex items-center">
          {trend === 'up' && (
            <div className="text-green-600 dark:text-green-400 flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className="ml-1">{percentage}%</span>
            </div>
          )}
          
          {trend === 'down' && (
            <div className="text-red-600 dark:text-red-400 flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span className="ml-1">{percentage}%</span>
            </div>
          )}
          
          <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">vs. last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

type ActivityItemProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  time: string;
};

const ActivityItem = ({ icon: Icon, title, description, time }: ActivityItemProps) => {
  return (
    <div className="flex space-x-4">
      <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-2">
        <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

type ActionCardProps = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

const ActionCard = ({ title, icon: Icon, href }: ActionCardProps) => {
  return (
    <Link to={href}>
      <Card className="hover:border-blue-500 transition-colors cursor-pointer card-3d">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mb-3">
            <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="font-medium">{title}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Dashboard;
