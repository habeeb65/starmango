import React from 'react';
import { Box, Card, CardContent, Typography, Divider, CircularProgress } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ title, data, loading }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.formattedValue || '';
            return `${label}: ${value}%`;
          }
        }
      }
    },
    cutout: '70%'
  };

  return (
    <Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ height: 170, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Doughnut data={data} options={chartOptions} />
              {data.centerText && (
                <Box 
                  sx={{ 
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" sx={{ opacity: 0.9 }}>
                    {data.centerText.value}
                  </Typography>
                  {data.centerText.label && (
                    <Typography variant="caption" color="text.secondary">
                      {data.centerText.label}
                    </Typography>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DonutChart; 