import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  CardMedia, 
  Stack, 
  Divider 
} from '@mui/material';

// Team members
const teamMembers = [
  {
    name: 'Rajesh Kumar',
    role: 'Founder & CEO',
    bio: 'With over 20 years of experience in fruit trading, Rajesh founded Star Mango to provide premium quality mangoes directly from farms to customers.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Priya Singh',
    role: 'Operations Manager',
    bio: 'Priya oversees our supply chain and ensures that quality standards are maintained at every step of the process.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'Amit Sharma',
    role: 'Farm Relations',
    bio: 'Amit works directly with our partner farms to source the best mangoes and ensure sustainable farming practices.',
    image: 'https://randomuser.me/api/portraits/men/75.jpg'
  }
];

// Values
const values = [
  {
    title: 'Quality',
    description: 'We are committed to providing only the finest quality mangoes. Each fruit is handpicked and goes through a rigorous quality control process.',
  },
  {
    title: 'Sustainability',
    description: 'We partner with farms that follow eco-friendly and sustainable farming practices to ensure a better environment for future generations.',
  },
  {
    title: 'Transparency',
    description: 'We maintain complete transparency in our operations, from sourcing to pricing, to build trust with our customers and partners.',
  },
  {
    title: 'Customer Satisfaction',
    description: 'Customer satisfaction is at the heart of everything we do. We strive to exceed expectations with our products and services.',
  }
];

// History milestones
const milestones = [
  {
    year: '2012',
    title: 'Foundation',
    description: 'Star Mango was founded with a mission to deliver premium quality mangoes directly from farms to customers.'
  },
  {
    year: '2015',
    title: 'Expansion',
    description: 'Expanded operations to include partnerships with 25+ mango farms across 5 regions in India.'
  },
  {
    year: '2018',
    title: 'E-commerce Launch',
    description: 'Launched our online platform to reach customers across the country and provide a seamless ordering experience.'
  },
  {
    year: '2022',
    title: 'Sustainable Initiative',
    description: 'Implemented a comprehensive sustainability program with all partner farms to promote eco-friendly farming practices.'
  }
];

const AboutPage = () => {
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
            About Star Mango
          </Typography>
          <Typography 
            variant="h5" 
            align="center" 
            color="text.secondary" 
            paragraph
            sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}
          >
            We are passionate about providing the finest quality mangoes sourced directly from premium farms across India.
          </Typography>
        </Container>
      </Box>

      {/* Our Story Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              Founded in 2012, Star Mango began with a simple mission: to connect mango lovers with the finest fruits directly from farms. Our founder, Rajesh Kumar, noticed a gap in the market – despite India being the largest producer of mangoes in the world, many consumers never got to taste truly premium mangoes at their peak ripeness.
            </Typography>
            <Typography variant="body1" paragraph>
              We started by partnering with a small network of farms in Maharashtra and gradually expanded our operations to include farms from various mango-growing regions in India, including Ratnagiri, Devgad, Malihabad, and Chittoor.
            </Typography>
            <Typography variant="body1">
              Today, Star Mango works with over 25 partner farms and delivers premium mangoes to thousands of customers across India. We take pride in our farm-to-table approach, ensuring that each mango reaches our customers at the perfect stage of ripeness.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
              alt="Mango farm"
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Our Values */}
      <Box sx={{ bgcolor: 'grey.50', py: 8, mb: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            gutterBottom 
            sx={{ fontWeight: 600, mb: 5 }}
          >
            Our Values
          </Typography>
          
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    borderTop: '4px solid', 
                    borderColor: 'primary.main',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)'
                    }
                  }}
                >
                  <Typography variant="h5" component="h3" gutterBottom>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Our Team */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          gutterBottom 
          sx={{ fontWeight: 600, mb: 5 }}
        >
          Meet Our Team
        </Typography>
        
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="280"
                  image={member.image}
                  alt={member.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Our History */}
      <Box sx={{ bgcolor: 'primary.light', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            gutterBottom 
            sx={{ fontWeight: 600, mb: 6 }}
          >
            Our Journey
          </Typography>
          
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            {milestones.map((milestone, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  mb: index === milestones.length - 1 ? 0 : 4,
                  position: 'relative'
                }}
              >
                {/* Timeline connector */}
                {index < milestones.length - 1 && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      left: 60, 
                      top: 70, 
                      bottom: -40, 
                      width: 2, 
                      bgcolor: 'primary.main',
                      zIndex: 0
                    }} 
                  />
                )}
                
                {/* Year badge */}
                <Box 
                  sx={{ 
                    minWidth: 120,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 2,
                    fontWeight: 'bold',
                    mr: 3,
                    zIndex: 1
                  }}
                >
                  {milestone.year}
                </Box>
                
                {/* Content */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {milestone.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {milestone.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage; 