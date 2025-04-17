import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme, color }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderLeft: `4px solid ${color || theme.palette.primary.main}`,
  boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
  '&:hover': {
    boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease',
  },
}));

const KPICard = ({ title, value, icon, color, prefix = '₹', formatNumber = true }) => {
  // Format number with commas if needed
  const formattedValue = formatNumber && typeof value === 'number' 
    ? value.toLocaleString('en-IN')
    : value;

  return (
    <StyledCard color={color}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {prefix && typeof value === 'number' ? prefix : ''}{formattedValue}
            </Typography>
          </Box>
          {icon && (
            <Box display="flex" alignItems="center" justifyContent="center" 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  bgcolor: `${color}20`,
                  color: color 
                }}>
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default KPICard; 