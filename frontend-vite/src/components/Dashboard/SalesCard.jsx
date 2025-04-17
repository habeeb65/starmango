import { 
  Card, 
  CardContent, 
  Typography, 
  Box
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const SalesCard = ({ title, value, change, color }) => {
  const isPositive = change && change.startsWith('+');
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        borderLeft: `4px solid ${color}`,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        
        <Typography variant="h5" component="div" sx={{ fontWeight: 600, mb: 1 }}>
          {value}
        </Typography>
        
        {change && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isPositive ? (
              <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
            ) : (
              <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
            )}
            <Typography 
              variant="body2" 
              sx={{ 
                color: isPositive ? 'success.main' : 'error.main',
                fontWeight: 500
              }}
            >
              {change} from last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesCard; 