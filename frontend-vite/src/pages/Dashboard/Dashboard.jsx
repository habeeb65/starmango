import { useState } from 'react';
import { 
  Box, 
  Grid,
  Typography
} from '@mui/material';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import InventoryIcon from '@mui/icons-material/Inventory';
import SalesChart from '../../components/Dashboard/SalesChart';
import StatisticsCard from '../../components/Dashboard/StatisticsCard';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';

// Sample transactions data
const recentTransactions = [
  { id: 1, date: '2023-07-25', customerName: 'Acme Corp', amount: 2500, type: 'sale', status: 'completed' },
  { id: 2, date: '2023-07-24', customerName: 'Global Traders', amount: 1800, type: 'sale', status: 'completed' },
  { id: 3, date: '2023-07-23', customerName: 'Fresh Farms', amount: 3200, type: 'purchase', status: 'pending' },
  { id: 4, date: '2023-07-22', customerName: 'Local Market', amount: 950, type: 'sale', status: 'completed' },
  { id: 5, date: '2023-07-21', customerName: 'Organic Supplies', amount: 1200, type: 'purchase', status: 'completed' },
];

const Dashboard = () => {
  // Statistics data
  const statisticsData = [
    { 
      title: 'Total Sales', 
      value: '₹382,500', 
      percentChange: 15, 
      icon: <PointOfSaleIcon />, 
      color: 'success' 
    },
    { 
      title: 'Total Purchases', 
      value: '₹245,800', 
      percentChange: 8, 
      icon: <ShoppingCartIcon />, 
      color: 'primary' 
    },
    { 
      title: 'Net Profit', 
      value: '₹136,700', 
      percentChange: 22, 
      icon: <AccountBalanceWalletIcon />, 
      color: 'secondary' 
    },
    { 
      title: 'Inventory Value', 
      value: '₹175,300', 
      percentChange: -5, 
      icon: <InventoryIcon />, 
      color: 'warning' 
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Dashboard
      </Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statisticsData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatisticsCard 
              title={item.title}
              value={item.value}
              percentChange={item.percentChange}
              icon={item.icon}
              color={item.color}
            />
          </Grid>
        ))}
      </Grid>

      {/* Charts and Transactions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <SalesChart />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <RecentTransactions transactions={recentTransactions} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 