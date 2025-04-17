import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Typography, Chip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

/**
 * StatCard Component
 * 
 * A reusable card component for displaying statistics with icons, values, and percentage changes.
 * 
 * @param {Object} props
 * @param {string} props.title - The title of the statistic
 * @param {number|string} props.value - The main value to display
 * @param {number} props.percentChange - The percentage change (positive or negative)
 * @param {React.ReactNode} props.icon - The icon to display
 * @param {string} props.iconColor - The background color for the icon
 * @returns {React.Component} The StatCard component
 */
const StatCard = ({ title, value, percentChange, icon, iconColor }) => {
  const isPositive = percentChange >= 0;
  
  // Format the value as Indian currency if it's a number
  const formattedValue = typeof value === 'number' 
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(value)
    : value;
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        height: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 2,
            backgroundColor: iconColor + '20', // Adding transparency
            color: iconColor,
          }}
        >
          {icon}
        </Box>
        <Chip
          icon={isPositive ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
          label={`${isPositive ? '+' : ''}${percentChange}%`}
          size="small"
          color={isPositive ? 'success' : 'error'}
          sx={{
            fontWeight: 'bold',
            height: 24,
            '& .MuiChip-icon': {
              marginLeft: 0.5,
              marginRight: -0.5,
            }
          }}
        />
      </Box>
      
      <Typography variant="h5" component="div" sx={{ mb: 0.5, fontWeight: 'bold' }}>
        {formattedValue}
      </Typography>
      
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </Paper>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  percentChange: PropTypes.number.isRequired,
  icon: PropTypes.node.isRequired,
  iconColor: PropTypes.string.isRequired
};

export default StatCard; 