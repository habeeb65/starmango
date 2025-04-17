import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  Button,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Slider,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';

// Sample product data
const products = [
  {
    id: 1,
    name: 'Alphonso Mangoes',
    origin: 'Ratnagiri, Maharashtra',
    description: 'Known as the "King of Mangoes", Alphonso is renowned for its rich, creamy, tender texture and delicate, distinctive flavor.',
    price: 800,
    unit: 'Dozen',
    image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    inStock: true,
    category: 'premium'
  },
  {
    id: 2,
    name: 'Kesar Mangoes',
    origin: 'Junagadh, Gujarat',
    description: 'Kesar mangoes have a bright orange pulp with a sweet flavor and are often used to make mango products like juices and desserts.',
    price: 650,
    unit: 'Dozen',
    image: 'https://images.unsplash.com/photo-1626082896492-766af4eb6501?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    inStock: true,
    category: 'premium'
  },
  {
    id: 3,
    name: 'Banganapalli Mangoes',
    origin: 'Andhra Pradesh',
    description: 'Known for their fiber-less pulp, Banganapalli mangoes have a sweet taste with a subtle spicy undertone.',
    price: 550,
    unit: 'Dozen',
    image: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    inStock: true,
    category: 'standard'
  },
  {
    id: 4,
    name: 'Dasheri Mangoes',
    origin: 'Malihabad, Uttar Pradesh',
    description: 'Dasheri mangoes are known for their distinct aroma, delicious taste, and fiber-less flesh with sweet flavor.',
    price: 500,
    unit: 'Dozen',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    inStock: true,
    category: 'standard'
  },
  {
    id: 5,
    name: 'Langra Mangoes',
    origin: 'Varanasi, Uttar Pradesh',
    description: 'Langra mangoes are characterized by their green skin even when ripe and delicious, fiber-less pulp with a distinct taste.',
    price: 450,
    unit: 'Dozen',
    image: 'https://images.unsplash.com/photo-1590244256530-33212d4710e6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fG1hbmdvZXN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    inStock: false,
    category: 'standard'
  },
  {
    id: 6,
    name: 'Chausa Mangoes',
    origin: 'Bihar',
    description: 'Chausa mangoes are extremely sweet with a light yellow pulp that is fiber-less, aromatic, and has a delightful taste.',
    price: 480,
    unit: 'Dozen',
    image: 'https://images.unsplash.com/photo-1623930170520-eac7d433f320?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fG1hbmdvZXN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    inStock: true,
    category: 'standard'
  },
  {
    id: 7,
    name: 'Himsagar Mangoes',
    origin: 'West Bengal',
    description: 'Himsagar mangoes have a fiber-less pulp with a distinct aroma and sweet taste, making them a favorite in eastern India.',
    price: 520,
    unit: 'Dozen',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8bWFuZ29lc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    inStock: true,
    category: 'standard'
  },
  {
    id: 8,
    name: 'Mango Gift Box',
    origin: 'Assorted Regions',
    description: 'A premium selection of various mango varieties, carefully packaged in an elegant gift box, perfect for gifting to loved ones.',
    price: 1200,
    unit: 'Box',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    inStock: true,
    category: 'gift'
  }
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'premium', label: 'Premium' },
  { value: 'standard', label: 'Standard' },
  { value: 'gift', label: 'Gift Boxes' }
];

const sortOptions = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'price_desc', label: 'Price (High to Low)' }
];

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc');
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Filter products based on search, category, and price
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // Paginate products
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{
          bgcolor: 'primary.light',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Our Products
          </Typography>
          <Typography 
            variant="h5" 
            align="center" 
            color="text.secondary" 
            paragraph
            sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}
          >
            Explore our collection of premium quality mangoes sourced directly from farms across India
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Filters
              </Typography>
              
              {/* Search */}
              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              {/* Category Filter */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Category
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <Select
                    value={category}
                    onChange={handleCategoryChange}
                  >
                    {categories.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              {/* Price Range Filter */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Price Range
                </Typography>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1500}
                    step={50}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      ₹{priceRange[0]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{priceRange[1]}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              {/* Sort By */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Sort By
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <SortIcon />
                      </InputAdornment>
                    }
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              {/* Results count */}
              <Typography variant="body2" color="text.secondary">
                Showing {sortedProducts.length} results
              </Typography>
            </Box>
          </Grid>
          
          {/* Products Grid */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'translateY(-8px)'
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="220"
                          image={product.image}
                          alt={product.name}
                        />
                        {!product.inStock && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'rgba(0, 0, 0, 0.5)',
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                color: 'white',
                                bgcolor: 'error.main',
                                px: 2,
                                py: 1,
                                borderRadius: 1,
                              }}
                            >
                              Out of Stock
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} sx={{ mb: 1 }}>
                          <Typography variant="h6" component="h2" gutterBottom>
                            {product.name}
                          </Typography>
                          <Chip 
                            label={`₹${product.price}`} 
                            color="primary" 
                            sx={{ fontWeight: 'bold' }} 
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Origin: {product.origin}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {product.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Price per {product.unit}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          variant="contained" 
                          fullWidth 
                          disabled={!product.inStock}
                        >
                          Add to Cart
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h5" gutterBottom>
                      No products found
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Try adjusting your search or filter criteria
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
            
            {/* Pagination */}
            {sortedProducts.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination 
                  count={Math.ceil(sortedProducts.length / itemsPerPage)} 
                  page={page} 
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductsPage; 