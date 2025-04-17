import React from 'react';
import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

/**
 * StatisticsCard Component
 * 
 * Displays a card with key business statistics including a title, value, percentage change and icon.
 * The card shows positive changes in green and negative changes in red.
 * 
 * @param {Object} props
 * @param {string} props.title - The title of the statistic (e.g., "Total Sales")
 * @param {string|number} props.value - The current value of the statistic
 * @param {number} props.percentChange - The percentage change (positive or negative)
 * @param {React.ReactNode} props.icon - The icon to display
 * @param {string} props.iconBgColor - Background color for the icon avatar
 */
const StatisticsCard = ({ 
  title, 
  value, 
  percentChange = 0, 
  icon, 
  iconBgColor = 'primary.main'
}) => {
  const isPositive = percentChange >= 0;
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
        borderRadius: 3,
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography 
              variant="subtitle2" 
              color="text.secondary" 
              sx={{ mb: 1, fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ fontWeight: 700, mb: 1.5 }}
            >
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isPositive ? (
                <ArrowUpwardIcon 
                  fontSize="small" 
                  sx={{ 
                    color: 'success.main', 
                    fontSize: '1rem',
                    mr: 0.5 
                  }} 
                />
              ) : (
                <ArrowDownwardIcon 
                  fontSize="small" 
                  sx={{ 
                    color: 'error.main', 
                    fontSize: '1rem',
                    mr: 0.5 
                  }} 
                />
              )}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: isPositive ? 'success.main' : 'error.main',
                  fontWeight: 500
                }}
              >
                {Math.abs(percentChange)}%
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ ml: 0.5 }}
              >
                vs last month
              </Typography>
            </Box>
          </Box>
          <Avatar 
            sx={{ 
              bgcolor: iconBgColor,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              width: 48, 
              height: 48 
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard; 