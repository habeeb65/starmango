import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Divider, 
  Button, 
  IconButton, 
  Tooltip, 
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';

/**
 * RecentOrders Component
 * 
 * Displays a table of recent orders with details such as order ID, customer name,
 * amount, status, and action buttons.
 * 
 * @param {Object[]} orders - Array of order objects to display
 * @param {boolean} loading - Whether the data is currently loading
 * @param {Function} onRefresh - Function to refresh the orders data
 * @param {Function} onViewAll - Function to navigate to the orders page
 * @param {Function} onViewOrder - Function to view a specific order detail
 */
const RecentOrders = ({ orders = sampleOrders, loading = false, onRefresh, onViewAll, onViewOrder }) => {
  return (
    <Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Orders
          </Typography>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={onRefresh}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, boxShadow: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell align="right">₹{order.amount.toLocaleString()}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={order.status} 
                        size="small"
                        color={
                          order.status === 'completed' ? 'success' : 
                          order.status === 'pending' ? 'warning' : 
                          'default'
                        }
                        variant="outlined"
                        sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => onViewOrder(order.id)}
                        sx={{ color: 'primary.main' }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        <Button 
          variant="outlined" 
          color="primary" 
          size="small" 
          fullWidth 
          sx={{ mt: 2 }}
          onClick={onViewAll}
        >
          View All Orders
        </Button>
      </CardContent>
    </Card>
  );
};

// Sample data for development and testing
const sampleOrders = [
  { id: 'SO-1001', customerName: 'Fruit Market Ltd', amount: 12500, status: 'completed' },
  { id: 'SO-1002', customerName: 'Organic Foods', amount: 8750, status: 'pending' },
  { id: 'SO-1003', customerName: 'Fresh Harvest Co', amount: 15300, status: 'completed' },
  { id: 'SO-1004', customerName: 'Sunrise Exports', amount: 23000, status: 'processing' },
  { id: 'SO-1005', customerName: 'Green Valley Fruits', amount: 9800, status: 'completed' },
];

export default RecentOrders; 