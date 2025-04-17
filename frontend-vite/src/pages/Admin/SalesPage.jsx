import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

// Sample sales data
const sales = [
  {
    id: 'SL-2023-001',
    date: '2023-06-18',
    customerName: 'Sharma Fruits Mart',
    customerType: 'Retailer',
    items: [
      { name: 'Alphonso', quantity: 100, unit: 'kg', price: 120, total: 12000 },
      { name: 'Kesar', quantity: 50, unit: 'kg', price: 90, total: 4500 }
    ],
    totalAmount: 16500,
    paymentStatus: 'paid',
    deliveryStatus: 'delivered'
  },
  {
    id: 'SL-2023-002',
    date: '2023-06-20',
    customerName: 'Fresh Foods Corp',
    customerType: 'Wholesaler',
    items: [
      { name: 'Alphonso', quantity: 200, unit: 'kg', price: 110, total: 22000 },
      { name: 'Banganapalli', quantity: 150, unit: 'kg', price: 75, total: 11250 }
    ],
    totalAmount: 33250,
    paymentStatus: 'partial',
    deliveryStatus: 'delivered'
  },
  {
    id: 'SL-2023-003',
    date: '2023-06-25',
    customerName: 'Sweet Delights Bakery',
    customerType: 'B2B',
    items: [
      { name: 'Kesar', quantity: 80, unit: 'kg', price: 85, total: 6800 }
    ],
    totalAmount: 6800,
    paymentStatus: 'paid',
    deliveryStatus: 'delivered'
  },
  {
    id: 'SL-2023-004',
    date: '2023-06-28',
    customerName: 'City Fruit Market',
    customerType: 'Retailer',
    items: [
      { name: 'Alphonso', quantity: 100, unit: 'kg', price: 120, total: 12000 },
      { name: 'Dasheri', quantity: 120, unit: 'kg', price: 70, total: 8400 },
      { name: 'Himsagar', quantity: 50, unit: 'kg', price: 85, total: 4250 }
    ],
    totalAmount: 24650,
    paymentStatus: 'unpaid',
    deliveryStatus: 'pending'
  },
  {
    id: 'SL-2023-005',
    date: '2023-07-05',
    customerName: 'Luxury Hotels Ltd',
    customerType: 'B2B',
    items: [
      { name: 'Alphonso', quantity: 50, unit: 'kg', price: 130, total: 6500 },
      { name: 'Kesar', quantity: 30, unit: 'kg', price: 95, total: 2850 }
    ],
    totalAmount: 9350,
    paymentStatus: 'paid',
    deliveryStatus: 'delivered'
  },
  {
    id: 'SL-2023-006',
    date: '2023-07-08',
    customerName: 'Green Grocers',
    customerType: 'Retailer',
    items: [
      { name: 'Banganapalli', quantity: 100, unit: 'kg', price: 70, total: 7000 },
      { name: 'Chausa', quantity: 80, unit: 'kg', price: 75, total: 6000 }
    ],
    totalAmount: 13000,
    paymentStatus: 'partial',
    deliveryStatus: 'in-transit'
  },
  {
    id: 'SL-2023-007',
    date: '2023-07-10',
    customerName: 'Online Fruit Delivery',
    customerType: 'E-commerce',
    items: [
      { name: 'Alphonso', quantity: 120, unit: 'kg', price: 125, total: 15000 },
      { name: 'Kesar', quantity: 100, unit: 'kg', price: 90, total: 9000 },
      { name: 'Dasheri', quantity: 80, unit: 'kg', price: 75, total: 6000 }
    ],
    totalAmount: 30000,
    paymentStatus: 'paid',
    deliveryStatus: 'delivered'
  },
  {
    id: 'SL-2023-008',
    date: '2023-07-15',
    customerName: 'Fresh Foods Corp',
    customerType: 'Wholesaler',
    items: [
      { name: 'Alphonso', quantity: 150, unit: 'kg', price: 110, total: 16500 },
      { name: 'Banganapalli', quantity: 200, unit: 'kg', price: 70, total: 14000 }
    ],
    totalAmount: 30500,
    paymentStatus: 'unpaid',
    deliveryStatus: 'pending'
  }
];

const SalesPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter sales based on search and filter
  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      sale.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customerType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      sale.paymentStatus === filterStatus ||
      sale.deliveryStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate the slice of data to display
  const displayedSales = filteredSales.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  // Handle view sale details
  const handleViewSale = (sale) => {
    setSelectedSale(sale);
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Get payment status chip color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'partial':
        return 'warning';
      case 'unpaid':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get delivery status chip color
  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'in-transit':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Calculate total sales amount
  const totalSalesAmount = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  // Calculate total number of mangoes sold (in kg)
  const totalQuantitySold = sales.reduce((sum, sale) => {
    return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  // Calculate pending payments total
  const pendingPaymentsTotal = sales
    .filter(sale => sale.paymentStatus === 'unpaid' || sale.paymentStatus === 'partial')
    .reduce((sum, sale) => sum + sale.totalAmount, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Sales Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Sales
              </Typography>
              <Typography variant="h4">
                ₹{totalSalesAmount.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                From {sales.length} transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Quantity Sold
              </Typography>
              <Typography variant="h4">
                {totalQuantitySold} kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Across all mango varieties
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Pending Payments
              </Typography>
              <Typography variant="h4">
                ₹{pendingPaymentsTotal.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                From {sales.filter(sale => sale.paymentStatus !== 'paid').length} orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Pending Deliveries
              </Typography>
              <Typography variant="h4">
                {sales.filter(sale => sale.deliveryStatus === 'pending').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Orders awaiting shipment
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
        >
          <TextField
            placeholder="Search sales..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: '300px' } }}
          />
          
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="filter-status-label">Filter Status</InputLabel>
              <Select
                labelId="filter-status-label"
                value={filterStatus}
                label="Filter Status"
                onChange={handleFilterChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="partial">Partially Paid</MenuItem>
                <MenuItem value="unpaid">Unpaid</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="in-transit">In Transit</MenuItem>
                <MenuItem value="pending">Pending Delivery</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              sx={{ whiteSpace: 'nowrap' }}
            >
              New Sale
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Sales Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>Invoice ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Delivery Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell component="th" scope="row">
                    {sale.id}
                  </TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>{sale.customerType}</TableCell>
                  <TableCell>
                    {sale.items.length} {sale.items.length === 1 ? 'variety' : 'varieties'}
                  </TableCell>
                  <TableCell>₹{sale.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={sale.paymentStatus.charAt(0).toUpperCase() + sale.paymentStatus.slice(1)} 
                      color={getPaymentStatusColor(sale.paymentStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={sale.deliveryStatus.charAt(0).toUpperCase() + sale.deliveryStatus.slice(1)} 
                      color={getDeliveryStatusColor(sale.deliveryStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleViewSale(sale)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="secondary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="info">
                        <ReceiptIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {displayedSales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      No sales found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search or filter criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSales.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Sale Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedSale && (
          <>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  Sales Invoice - {selectedSale.id}
                </Typography>
                <Chip 
                  label={selectedSale.paymentStatus.charAt(0).toUpperCase() + selectedSale.paymentStatus.slice(1)}
                  color={getPaymentStatusColor(selectedSale.paymentStatus)}
                />
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                  <Typography variant="body1">{selectedSale.customerName}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedSale.customerType}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} textAlign={{ sm: 'right' }}>
                  <Typography variant="subtitle2" color="text.secondary">Invoice Date</Typography>
                  <Typography variant="body1">{selectedSale.date}</Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Delivery Status</Typography>
                  <Chip 
                    label={selectedSale.deliveryStatus.charAt(0).toUpperCase() + selectedSale.deliveryStatus.slice(1)} 
                    color={getDeliveryStatusColor(selectedSale.deliveryStatus)}
                    size="small"
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Items
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedSale.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">{item.quantity} {item.unit}</TableCell>
                        <TableCell align="right">₹{item.price}/{item.unit}</TableCell>
                        <TableCell align="right">₹{item.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} />
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Grand Total:</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        ₹{selectedSale.totalAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Payment Information
                </Typography>
                <Typography variant="body2">
                  Payment Status: {selectedSale.paymentStatus.charAt(0).toUpperCase() + selectedSale.paymentStatus.slice(1)}
                </Typography>
                <Typography variant="body2">
                  Payment Method: Bank Transfer
                </Typography>
              </Box>

              <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
              <Typography variant="body2">
                No additional notes for this sale.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                variant="outlined"
                startIcon={<ReceiptIcon />}
              >
                Generate Invoice
              </Button>
              <Button variant="contained" color="primary">
                Edit Details
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default SalesPage; 