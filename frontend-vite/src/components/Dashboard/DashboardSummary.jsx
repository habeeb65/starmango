import React, { useState, useEffect } from 'react';
import { Grid, Box, Paper, Typography, CircularProgress } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StatisticsCard from './StatisticsCard';
import SalesChart from './SalesChart';
import PaymentStatusChart from './PaymentStatusChart';
import RecentOrders from './RecentOrders';

/**
 * DashboardSummary Component
 * 
 * Displays the main dashboard summary containing statistics cards, 
 * sales & purchase charts, and a list of recent orders.
 * 
 * @returns {React.Component} The dashboard summary component
 */
const DashboardSummary = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalPurchases: 0,
    totalCustomers: 0,
    totalExpenses: 0,
    salesGrowth: 0,
    purchasesGrowth: 0,
    customersGrowth: 0,
    expensesGrowth: 0
  });

  // Sample data for charts
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales',
        data: [30000, 45000, 42000, 50000, 63000, 58000, 70000, 85000, 80000, 95000, 92000, 100000],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4
      },
      {
        label: 'Purchases',
        data: [22000, 35000, 32000, 40000, 53000, 48000, 60000, 75000, 72000, 85000, 83000, 90000],
        borderColor: '#FFC107',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        tension: 0.4
      }
    ]
  };

  const paymentStatusData = {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        borderWidth: 0
      }
    ]
  };

  // Sample orders data for RecentOrders component
  const recentOrders = [
    { id: 'INV-001', customerName: 'John Doe', amount: '₹25,000', status: 'paid' },
    { id: 'INV-002', customerName: 'Jane Smith', amount: '₹13,500', status: 'pending' },
    { id: 'INV-003', customerName: 'Robert Johnson', amount: '₹42,800', status: 'paid' },
    { id: 'INV-004', customerName: 'Emily Davis', amount: '₹18,300', status: 'overdue' },
    { id: 'INV-005', customerName: 'Michael Brown', amount: '₹31,750', status: 'paid' }
  ];

  // Simulate fetching data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real application, this would be an API call
        // For now, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStats({
          totalSales: '₹12,45,000',
          totalPurchases: '₹9,87,500',
          totalCustomers: 124,
          totalExpenses: '₹2,34,500',
          salesGrowth: 12.5,
          purchasesGrowth: 8.3,
          customersGrowth: 15.2,
          expensesGrowth: -3.7
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticsCard
            title="Total Sales"
            value={stats.totalSales}
            percentChange={stats.salesGrowth}
            icon={<AttachMoneyIcon />}
            iconBgColor="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticsCard
            title="Total Purchases"
            value={stats.totalPurchases}
            percentChange={stats.purchasesGrowth}
            icon={<ShoppingCartIcon />}
            iconBgColor="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticsCard
            title="Total Customers"
            value={stats.totalCustomers}
            percentChange={stats.customersGrowth}
            icon={<PeopleIcon />}
            iconBgColor="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticsCard
            title="Total Expenses"
            value={stats.totalExpenses}
            percentChange={stats.expensesGrowth}
            icon={<ReceiptIcon />}
            iconBgColor="warning.main"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Monthly Sales & Purchases
            </Typography>
            <SalesChart data={salesData} height={300} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Payment Status
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <PaymentStatusChart data={paymentStatusData} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Grid container>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Orders
            </Typography>
            <RecentOrders orders={recentOrders} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardSummary; 