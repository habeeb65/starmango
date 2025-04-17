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
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

// Sample inventory data
const inventory = [
  {
    id: 1,
    name: 'Alphonso',
    totalStock: 450,
    availableStock: 420,
    damagedStock: 30,
    unit: 'kg',
    unitPrice: 120,
    origin: 'Ratnagiri, Maharashtra',
    lastRestocked: '2023-07-10',
    category: 'premium',
    status: 'in-stock'
  },
  {
    id: 2,
    name: 'Kesar',
    totalStock: 380,
    availableStock: 370,
    damagedStock: 10,
    unit: 'kg',
    unitPrice: 90,
    origin: 'Junagadh, Gujarat',
    lastRestocked: '2023-07-08',
    category: 'premium',
    status: 'in-stock'
  },
  {
    id: 3,
    name: 'Banganapalli',
    totalStock: 520,
    availableStock: 500,
    damagedStock: 20,
    unit: 'kg',
    unitPrice: 70,
    origin: 'Andhra Pradesh',
    lastRestocked: '2023-07-12',
    category: 'standard',
    status: 'in-stock'
  },
  {
    id: 4,
    name: 'Dasheri',
    totalStock: 300,
    availableStock: 280,
    damagedStock: 20,
    unit: 'kg',
    unitPrice: 75,
    origin: 'Malihabad, Uttar Pradesh',
    lastRestocked: '2023-07-05',
    category: 'standard',
    status: 'in-stock'
  },
  {
    id: 5,
    name: 'Langra',
    totalStock: 50,
    availableStock: 40,
    damagedStock: 10,
    unit: 'kg',
    unitPrice: 80,
    origin: 'Varanasi, Uttar Pradesh',
    lastRestocked: '2023-06-20',
    category: 'standard',
    status: 'low-stock'
  },
  {
    id: 6,
    name: 'Chausa',
    totalStock: 250,
    availableStock: 240,
    damagedStock: 10,
    unit: 'kg',
    unitPrice: 75,
    origin: 'Bihar',
    lastRestocked: '2023-07-03',
    category: 'standard',
    status: 'in-stock'
  },
  {
    id: 7,
    name: 'Himsagar',
    totalStock: 180,
    availableStock: 170,
    damagedStock: 10,
    unit: 'kg',
    unitPrice: 85,
    origin: 'West Bengal',
    lastRestocked: '2023-06-28',
    category: 'standard',
    status: 'in-stock'
  },
  {
    id: 8,
    name: 'Neelam',
    totalStock: 0,
    availableStock: 0,
    damagedStock: 0,
    unit: 'kg',
    unitPrice: 65,
    origin: 'Tamil Nadu',
    lastRestocked: '2023-06-15',
    category: 'standard',
    status: 'out-of-stock'
  }
];

const InventoryPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  // Filter inventory based on search and filter
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      filterCategory === 'all' || 
      item.category === filterCategory ||
      item.status === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Calculate the slice of data to display
  const displayedInventory = filteredInventory.slice(
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
    setFilterCategory(event.target.value);
    setPage(0);
  };

  // Handle view item details
  const handleViewItem = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Get stock status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock':
        return 'success';
      case 'low-stock':
        return 'warning';
      case 'out-of-stock':
        return 'error';
      default:
        return 'default';
    }
  };

  // Format display text for status
  const formatStatus = (status) => {
    switch (status) {
      case 'in-stock':
        return 'In Stock';
      case 'low-stock':
        return 'Low Stock';
      case 'out-of-stock':
        return 'Out of Stock';
      default:
        return status;
    }
  };

  // Calculate inventory value
  const inventoryValue = inventory.reduce((sum, item) => {
    return sum + (item.availableStock * item.unitPrice);
  }, 0);

  // Calculate total available stock
  const totalAvailableStock = inventory.reduce((sum, item) => {
    return sum + item.availableStock;
  }, 0);

  // Calculate total damaged stock
  const totalDamagedStock = inventory.reduce((sum, item) => {
    return sum + item.damagedStock;
  }, 0);

  // Calculate low stock items count
  const lowStockCount = inventory.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock').length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Inventory Management
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Inventory Value
              </Typography>
              <Typography variant="h4">
                ₹{inventoryValue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Based on current unit prices
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Stock
              </Typography>
              <Typography variant="h4">
                {totalAvailableStock} kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available for sale
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Damaged Stock
              </Typography>
              <Typography variant="h4">
                {totalDamagedStock} kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {((totalDamagedStock / (totalAvailableStock + totalDamagedStock)) * 100).toFixed(1)}% of total inventory
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Low/Out of Stock
              </Typography>
              <Typography variant="h4">
                {lowStockCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items requiring attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alert for low stock items */}
      {lowStockCount > 0 && (
        <Alert 
          severity="warning" 
          icon={<WarningIcon />}
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small">
              Order Now
            </Button>
          }
        >
          {lowStockCount} {lowStockCount === 1 ? 'item' : 'items'} {lowStockCount === 1 ? 'is' : 'are'} currently low or out of stock. Consider restocking.
        </Alert>
      )}

      {/* Table Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
        >
          <TextField
            placeholder="Search inventory..."
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
              <InputLabel id="filter-category-label">Filter Category</InputLabel>
              <Select
                labelId="filter-category-label"
                value={filterCategory}
                label="Filter Category"
                onChange={handleFilterChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Items</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="in-stock">In Stock</MenuItem>
                <MenuItem value="low-stock">Low Stock</MenuItem>
                <MenuItem value="out-of-stock">Out of Stock</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Add New Item
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Inventory Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Origin</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Available Stock</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Stock Value</TableCell>
                <TableCell>Last Restocked</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.name}
                  </TableCell>
                  <TableCell>{item.origin}</TableCell>
                  <TableCell>
                    <Chip 
                      label={item.category.charAt(0).toUpperCase() + item.category.slice(1)} 
                      color={item.category === 'premium' ? 'secondary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {item.availableStock} {item.unit}
                    <LinearProgress 
                      variant="determinate" 
                      value={(item.availableStock / 600) * 100} 
                      color={
                        item.status === 'out-of-stock' ? 'error' : 
                        item.status === 'low-stock' ? 'warning' : 'success'
                      }
                      sx={{ height: 4, borderRadius: 2, mt: 1 }}
                    />
                  </TableCell>
                  <TableCell align="right">₹{item.unitPrice}/{item.unit}</TableCell>
                  <TableCell align="right">₹{(item.availableStock * item.unitPrice).toLocaleString()}</TableCell>
                  <TableCell>{item.lastRestocked}</TableCell>
                  <TableCell>
                    <Chip 
                      label={formatStatus(item.status)} 
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleViewItem(item)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="info">
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="success">
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {displayedInventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      No inventory items found
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
          count={filteredInventory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Item Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedItem && (
          <>
            <DialogTitle>
              Edit Inventory Item - {selectedItem.name}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Item Name"
                    variant="outlined"
                    margin="normal"
                    defaultValue={selectedItem.name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Origin"
                    variant="outlined"
                    margin="normal"
                    defaultValue={selectedItem.origin}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                      defaultValue={selectedItem.category}
                      label="Category"
                    >
                      <MenuItem value="premium">Premium</MenuItem>
                      <MenuItem value="standard">Standard</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Unit"
                    variant="outlined"
                    margin="normal"
                    defaultValue={selectedItem.unit}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Unit Price"
                    variant="outlined"
                    margin="normal"
                    type="number"
                    defaultValue={selectedItem.unitPrice}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Available Stock"
                    variant="outlined"
                    margin="normal"
                    type="number"
                    defaultValue={selectedItem.availableStock}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{selectedItem.unit}</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Damaged Stock"
                    variant="outlined"
                    margin="normal"
                    type="number"
                    defaultValue={selectedItem.damagedStock}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{selectedItem.unit}</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Restocked"
                    variant="outlined"
                    margin="normal"
                    type="date"
                    defaultValue={selectedItem.lastRestocked}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                      defaultValue={selectedItem.status}
                      label="Status"
                    >
                      <MenuItem value="in-stock">In Stock</MenuItem>
                      <MenuItem value="low-stock">Low Stock</MenuItem>
                      <MenuItem value="out-of-stock">Out of Stock</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default InventoryPage; 