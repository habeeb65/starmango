import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import Chart from 'chart.js/auto';

/**
 * PaymentStatusChart Component
 * 
 * Displays a donut chart showing the distribution of payment statuses
 * (e.g., paid, pending, overdue).
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Chart data with labels and datasets
 * @param {number} props.size - Size of the chart (width/height)
 * @param {string} props.centerText - Text to display in the center of the donut
 * @returns {React.Component} The payment status chart component
 */
const PaymentStatusChart = ({ data, size = 200, centerText }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // If chart instance exists, destroy it
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Get canvas context
    const ctx = chartRef.current.getContext('2d');

    // Create new chart instance
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.formattedValue || '';
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((context.raw / total) * 100);
                return `${label}: ${percentage}% (${value})`;
              }
            }
          }
        },
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <Box sx={{ 
      position: 'relative', 
      width: size, 
      height: size, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <canvas ref={chartRef} />
      
      {centerText && (
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {centerText.value}
          </Typography>
          {centerText.label && (
            <Typography variant="caption" color="text.secondary">
              {centerText.label}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

PaymentStatusChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.number).isRequired,
        backgroundColor: PropTypes.arrayOf(PropTypes.string)
      })
    ).isRequired
  }).isRequired,
  size: PropTypes.number,
  centerText: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  })
};

export default PaymentStatusChart; 