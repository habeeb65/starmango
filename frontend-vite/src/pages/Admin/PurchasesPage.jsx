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
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Sample purchase data
const purchases = [
  {
    id: 'PUR-2023-001',
    date: '2023-06-15',
    vendorName: 'Ratnagiri Farms',
    mangoType: 'Alphonso',
    quantity: 500,
    unit: 'kg',
    totalAmount: 40000,
    paymentStatus: 'paid',
    deliveryStatus: 'delivered'
  },
  {
    id: 'PUR-2023-002',
    date: '2023-06-17',
    vendorName: 'Gujarat Mango Suppliers',
    mangoType: 'Kesar',
    quantity: 450,
    unit: 'kg',
    totalAmount: 29000,
    paymentStatus: 'partial',
    deliveryStatus: 'delivered'
  },
  {
    id: 'PUR-2023-003',
    date: '2023-06-20',
    vendorName: 'Andhra Fruits Co.',
    mangoType: 'Banganapalli',
    quantity: 600,
    unit: 'kg',
    totalAmount: 33000,
    paymentStatus: 'paid',
    deliveryStatus: 'delivered'
  },
  {
    id: 'PUR-2023-004',
    date: '2023-06-25',
    vendorName: 'UP Mango Exports',
    mangoType: 'Dasheri',
    quantity: 350,
    unit: 'kg',
    totalAmount: 17500,
    paymentStatus: 'unpaid',
    deliveryStatus: 'pending'
  },
  {
    id: 'PUR-2023-005',
    date: '2023-06-28',
    vendorName: 'Bihar Fruit Traders',
    mangoType: 'Chausa',
    quantity: 400,
    unit: 'kg',
    totalAmount: 19200,
    paymentStatus: 'partial',
    deliveryStatus: 'in-transit'
  },
  {
    id: 'PUR-2023-006',
    date: '2023-07-02',
    vendorName: 'Bengal Fresh Fruits',
    mangoType: 'Himsagar',
    quantity: 300,
    unit: 'kg',
    totalAmount: 15600,
    paymentStatus: 'paid',
    deliveryStatus: 'delivered'
  },
  {
    id: 'PUR-2023-007',
    date: '2023-07-05',
    vendorName: 'Ratnagiri Farms',
    mangoType: 'Alphonso',
    quantity: 250,
    unit: 'kg',
    totalAmount: 20000,
    paymentStatus: 'paid',
    deliveryStatus: 'delivered'
  },
  {
    id: 'PUR-2023-008',
    date: '2023-07-12',
    vendorName: 'Gujarat Mango Suppliers',
    mangoType: 'Kesar',
    quantity: 400,
    unit: 'kg',
    totalAmount: 26000,
    paymentStatus: 'unpaid',
    deliveryStatus: 'pending'
  }
];

const PurchasesPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter purchases based on search and filter
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = 
      purchase.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.mangoType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      purchase.paymentStatus === filterStatus ||
      purchase.deliveryStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate the slice of data to display
  const displayedPurchases = filteredPurchases.slice(
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

  // Handle view purchase details
  const handleViewPurchase = (purchase) => {
    setSelectedPurchase(purchase);
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Purchase Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Purchases
              </Typography>
              <Typography variant="h4">
                {purchases.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Quantity
              </Typography>
              <Typography variant="h4">
                {purchases.reduce((sum, purchase) => sum + purchase.quantity, 0)} kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Amount
              </Typography>
              <Typography variant="h4">
                ₹{purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0).toLocaleString()}
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
                {purchases.filter(purchase => purchase.deliveryStatus === 'pending').length}
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
            placeholder="Search purchases..."
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
              New Purchase
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Purchases Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>Purchase ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Mango Type</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Delivery Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell component="th" scope="row">
                    {purchase.id}
                  </TableCell>
                  <TableCell>{purchase.date}</TableCell>
                  <TableCell>{purchase.vendorName}</TableCell>
                  <TableCell>{purchase.mangoType}</TableCell>
                  <TableCell>{purchase.quantity} {purchase.unit}</TableCell>
                  <TableCell>₹{purchase.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={purchase.paymentStatus.charAt(0).toUpperCase() + purchase.paymentStatus.slice(1)} 
                      color={getPaymentStatusColor(purchase.paymentStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={purchase.deliveryStatus.charAt(0).toUpperCase() + purchase.deliveryStatus.slice(1)} 
                      color={getDeliveryStatusColor(purchase.deliveryStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleViewPurchase(purchase)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="secondary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {displayedPurchases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      No purchases found
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
          count={filteredPurchases.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Purchase Details Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedPurchase && (
          <>
            <DialogTitle>
              Purchase Details - {selectedPurchase.id}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                  <Typography variant="body1">{selectedPurchase.date}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Vendor</Typography>
                  <Typography variant="body1">{selectedPurchase.vendorName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Mango Type</Typography>
                  <Typography variant="body1">{selectedPurchase.mangoType}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Quantity</Typography>
                  <Typography variant="body1">{selectedPurchase.quantity} {selectedPurchase.unit}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                  <Typography variant="body1">₹{selectedPurchase.totalAmount.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Unit Price</Typography>
                  <Typography variant="body1">
                    ₹{(selectedPurchase.totalAmount / selectedPurchase.quantity).toFixed(2)} per {selectedPurchase.unit}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Payment Status</Typography>
                  <Chip 
                    label={selectedPurchase.paymentStatus.charAt(0).toUpperCase() + selectedPurchase.paymentStatus.slice(1)} 
                    color={getPaymentStatusColor(selectedPurchase.paymentStatus)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Delivery Status</Typography>
                  <Chip 
                    label={selectedPurchase.deliveryStatus.charAt(0).toUpperCase() + selectedPurchase.deliveryStatus.slice(1)} 
                    color={getDeliveryStatusColor(selectedPurchase.deliveryStatus)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Additional Notes</Typography>
                  <Typography variant="body2">
                    No additional notes for this purchase.
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button variant="contained" color="primary">Edit Details</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default PurchasesPage; 