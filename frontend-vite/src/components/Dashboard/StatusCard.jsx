import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

const StatusCard = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Box 
        sx={{
          position: 'absolute',
          top: -10,
          right: -15,
          opacity: 0.2,
          transform: 'rotate(30deg)',
          zIndex: 0
        }}
      >
        <Avatar
          sx={{
            bgcolor: color || 'primary.main',
            height: 80,
            width: 80,
          }}
        >
          {icon}
        </Avatar>
      </Box>
      
      <CardContent sx={{ zIndex: 1, width: '100%' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatusCard; 