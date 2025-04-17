import React from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Stack, 
  Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import NatureIcon from '@mui/icons-material/Nature';

// Hero section background image
const heroBackground = 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80';

// Featured product images
const products = [
  {
    id: 1,
    name: 'Alphonso Mangoes',
    description: 'Known as the "King of Mangoes", Alphonso is renowned for its rich, creamy, tender texture and delicate, distinctive flavor.',
    image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
  },
  {
    id: 2,
    name: 'Kesar Mangoes',
    description: 'Kesar mangoes have a bright orange pulp with a sweet flavor and are often used to make mango products like juices and desserts.',
    image: 'https://images.unsplash.com/photo-1626082896492-766af4eb6501?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: 3,
    name: 'Banganapalli Mangoes',
    description: 'Known for their fiber-less pulp, Banganapalli mangoes have a sweet taste with a subtle spicy undertone.',
    image: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  }
];

// Testimonials
const testimonials = [
  {
    id: 1,
    name: 'Raj Patel',
    role: 'Restaurant Owner',
    comment: 'Star Mango consistently delivers the freshest mangoes for our desserts. Our customers love the quality!',
    avatar: 'R'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Regular Customer',
    comment: 'I\'ve been buying from Star Mango for years. Their Alphonso mangoes are unmatched in flavor and quality.',
    avatar: 'P'
  },
  {
    id: 3,
    name: 'Ankit Singh',
    role: 'Fruit Retailer',
    comment: 'Star Mango provides exceptional wholesale services with reliable delivery and consistent quality.',
    avatar: 'A'
  }
];

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{
          height: { xs: '70vh', md: '80vh' },
          position: 'relative',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 8
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', color: 'white' }}>
          <Typography 
            variant="h2" 
            component="h1"
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' } 
            }}
          >
            The Finest Mangoes From Premium Farms
          </Typography>
          <Typography 
            variant="h5" 
            component="h2"
            sx={{ 
              mb: 4,
              fontWeight: 400,
              fontSize: { xs: '1.25rem', md: '1.5rem' } 
            }}
          >
            Directly sourced from farms to ensure quality, freshness, and taste
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
          >
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              component={Link}
              to="/products"
              sx={{ py: 1.5, px: 4, fontSize: '1rem' }}
            >
              Browse Products
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large"
              component={Link}
              to="/contact"
              sx={{ py: 1.5, px: 4, fontSize: '1rem', borderColor: 'white' }}
            >
              Contact Us
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', px: 2 }}>
              <LocalShippingIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                Fast & Free Delivery
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Free delivery on orders over ₹500 within the city limits. Quick nationwide shipping available.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', px: 2 }}>
              <VerifiedIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                Quality Guaranteed
              </Typography>
              <Typography variant="body1" color="text.secondary">
                All our mangoes are handpicked to ensure premium quality. Not satisfied? Get a replacement or refund.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', px: 2 }}>
              <NatureIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                Sustainably Sourced
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We partner with farms that follow sustainable farming practices for a better environment.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Product Showcase */}
      <Box sx={{ bgcolor: 'primary.light', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 600 }}>
            Our Premium Mangoes
          </Typography>
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item xs={12} md={4} key={product.id}>
                <Card 
                  elevation={0}
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
                  <Box 
                    sx={{ 
                      height: 240, 
                      width: '100%', 
                      overflow: 'hidden' 
                    }}
                  >
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              component={Link}
              to="/products"
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 600 }}>
          What Our Customers Say
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial) => (
            <Grid item xs={12} md={4} key={testimonial.id}>
              <Card sx={{ height: '100%', p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.role}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                  "{testimonial.comment}"
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: 6 
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Ready to taste the best mangoes in India?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 400 }}>
            Place your order now or contact us for bulk orders and special requirements.
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
          >
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={Link}
              to="/products"
              sx={{ py: 1.5, px: 4 }}
            >
              Shop Now
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large"
              component={Link}
              to="/contact"
              sx={{ py: 1.5, px: 4, borderColor: 'white' }}
            >
              Contact Us
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 