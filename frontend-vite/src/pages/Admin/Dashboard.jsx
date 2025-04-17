import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, useTheme } from '@mui/material';
import {
  PointOfSale as SalesIcon,
  ShoppingCart as PurchasesIcon,
  Inventory as InventoryIcon,
  AccountBalanceWallet as ProfitIcon,
} from '@mui/icons-material';

// Custom components
import StatCard from '../../components/Dashboard/StatCard';
import SalesChart from '../../components/Dashboard/SalesChart';
import InventoryStatus from '../../components/Dashboard/InventoryStatus';
import RecentOrders from '../../components/Dashboard/RecentOrders';
import DonutChart from '../../components/Dashboard/DonutChart';

// Services
import adminService from '../../services/adminService';

const Dashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: '₹0',
    totalPurchases: '₹0',
    inventoryValue: '₹0',
    profit: '₹0',
    salesPercentChange: 0,
    purchasesPercentChange: 0,
    inventoryPercentChange: 0,
    profitPercentChange: 0
  });

  // Mock inventory data
  const [inventory, setInventory] = useState([
    { name: 'Alphonso', stock: 250, unit: 'kg', maxStock: 500 },
    { name: 'Kesar', stock: 45, unit: 'kg', maxStock: 300 },
    { name: 'Banganapalli', stock: 320, unit: 'kg', maxStock: 400 },
    { name: 'Dasheri', stock: 150, unit: 'kg', maxStock: 300 },
  ]);
  
  // Mock recent orders
  const [recentOrders, setRecentOrders] = useState([
    { id: 'SO2023785', customerName: 'Akash Traders', amount: 25000, status: 'completed' },
    { id: 'SO2023784', customerName: 'Fresh Fruits Co.', amount: 18000, status: 'pending' },
    { id: 'SO2023783', customerName: 'Metro Market', amount: 32000, status: 'completed' },
    { id: 'SO2023782', customerName: 'City Grocers', amount: 9500, status: 'pending' },
    { id: 'SO2023781', customerName: 'Organic Foods', amount: 12000, status: 'completed' },
  ]);
  
  // Sales & Purchases chart data
  const [salesChartData, setSalesChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    sales: [320000, 350000, 310000, 380000, 420000, 450000, 400000, 430000, 480000, 450000, 470000, 425800],
    purchases: [210000, 230000, 200000, 250000, 280000, 290000, 270000, 290000, 310000, 290000, 300000, 285400]
  });
  
  // Payment status data
  const [paymentStatusData, setPaymentStatusData] = useState({
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [{
      data: [65, 25, 10],
      backgroundColor: [
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.error.main
      ],
      borderWidth: 0
    }],
    centerText: {
      value: '65%',
      label: 'Paid'
    }
  });
  
  // Sales by variety data
  const [salesByVarietyData, setSalesByVarietyData] = useState({
    labels: ['Alphonso', 'Kesar', 'Banganapalli', 'Dasheri', 'Others'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFC107',
        '#FF9800'
      ],
      borderWidth: 0
    }]
  });

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // In production, use this:
      // const response = await adminService.getDashboardStats();
      // setStats(response);
      
      // Mock data for demonstration - simulate API delay
      setTimeout(() => {
        setStats({
          totalSales: '₹4,25,800',
          totalPurchases: '₹2,85,400',
          inventoryValue: '₹1,95,750',
          profit: '₹1,40,400',
          salesPercentChange: 12.5,
          purchasesPercentChange: 8.2,
          inventoryPercentChange: -3.4,
          profitPercentChange: 15.8
        });
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle refresh for inventory
  const handleRefreshInventory = () => {
    setLoading(true);
    setTimeout(() => {
      setInventory([
        { name: 'Alphonso', stock: 275, unit: 'kg', maxStock: 500 },
        { name: 'Kesar', stock: 52, unit: 'kg', maxStock: 300 },
        { name: 'Banganapalli', stock: 298, unit: 'kg', maxStock: 400 },
        { name: 'Dasheri', stock: 175, unit: 'kg', maxStock: 300 },
      ]);
      setLoading(false);
    }, 800);
  };

  // Handle refresh for orders
  const handleRefreshOrders = () => {
    setLoading(true);
    setTimeout(() => {
      setRecentOrders([
        { id: 'SO2023786', customerName: 'Premium Stores', amount: 28500, status: 'pending' },
        ...recentOrders.slice(0, 4)
      ]);
      setLoading(false);
    }, 800);
  };

  // View single order
  const handleViewOrder = (orderId) => {
    console.log(`Viewing order details for: ${orderId}`);
    // In production: navigate to order details page
  };

  // View all orders
  const handleViewAllOrders = () => {
    console.log('Viewing all orders');
    // In production: navigate to orders page
  };

  // View all inventory
  const handleViewAllInventory = () => {
    console.log('Viewing all inventory');
    // In production: navigate to inventory page
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Dashboard
      </Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Sales"
            value={stats.totalSales}
            icon={<SalesIcon />}
            percentChange={stats.salesPercentChange}
            color="primary"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Purchases"
            value={stats.totalPurchases}
            icon={<PurchasesIcon />}
            percentChange={stats.purchasesPercentChange}
            color="secondary"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Inventory Value"
            value={stats.inventoryValue}
            icon={<InventoryIcon />}
            percentChange={stats.inventoryPercentChange}
            color="info"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Net Profit"
            value={stats.profit}
            icon={<ProfitIcon />}
            percentChange={stats.profitPercentChange}
            color="success"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Sales & Purchases Chart */}
        <Grid item xs={12} lg={8}>
          <SalesChart salesData={salesChartData} loading={loading} />
        </Grid>
        
        {/* Payment Status & Sales by Category */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DonutChart 
                title="Payment Status" 
                data={paymentStatusData} 
                loading={loading} 
              />
            </Grid>
            
            <Grid item xs={12}>
              <DonutChart 
                title="Sales by Variety" 
                data={salesByVarietyData} 
                loading={loading} 
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      {/* Recent Orders & Inventory Status */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <RecentOrders 
            orders={recentOrders} 
            loading={loading} 
            onRefresh={handleRefreshOrders}
            onViewAll={handleViewAllOrders}
            onViewOrder={handleViewOrder}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <InventoryStatus 
            products={inventory} 
            loading={loading} 
            onRefresh={handleRefreshInventory}
            onViewAll={handleViewAllInventory}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 