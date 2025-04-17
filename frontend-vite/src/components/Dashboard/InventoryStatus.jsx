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
  CircularProgress 
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';

const InventoryStatus = ({ products, loading, onRefresh, onViewAll }) => {
  return (
    <Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Inventory Status
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
          <Box sx={{ mt: 2 }}>
            {products.map((product, index) => {
              const stockPercentage = (product.stock / product.maxStock) * 100;
              const isLow = stockPercentage < 20;
              
              return (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {product.name}
                      </Typography>
                      {isLow && (
                        <Tooltip title="Low stock">
                          <WarningIcon color="warning" fontSize="small" sx={{ ml: 1 }} />
                        </Tooltip>
                      )}
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                      {product.stock} {product.unit}
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 8, 
                      bgcolor: 'grey.200', 
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      sx={{ 
                        height: '100%', 
                        width: `${stockPercentage}%`, 
                        bgcolor: isLow ? 'warning.main' : stockPercentage < 50 ? 'info.main' : 'success.main',
                        borderRadius: 4
                      }} 
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
        
        <Button 
          variant="outlined" 
          color="primary" 
          size="small" 
          fullWidth 
          sx={{ mt: 2 }}
          onClick={onViewAll}
        >
          View All Inventory
        </Button>
      </CardContent>
    </Card>
  );
};

export default InventoryStatus; 