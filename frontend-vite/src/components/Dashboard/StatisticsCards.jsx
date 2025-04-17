import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import StatCard from './StatCard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

/**
 * StatisticsCards Component
 * 
 * A component that displays multiple StatCard components in a grid layout
 * for showing different statistics like sales, purchases, customers, and expenses.
 * 
 * @param {Object} props
 * @param {Object} props.data - Object containing statistics data
 * @returns {React.Component} The StatisticsCards component
 */
const StatisticsCards = ({ data }) => {
  const stats = [
    {
      id: 'sales',
      title: 'Total Sales',
      value: data?.sales?.value || 0,
      percentChange: data?.sales?.percentChange || 0,
      icon: <ShoppingCartIcon />,
      iconColor: '#4caf50'
    },
    {
      id: 'purchases',
      title: 'Total Purchases',
      value: data?.purchases?.value || 0,
      percentChange: data?.purchases?.percentChange || 0,
      icon: <LocalMallIcon />,
      iconColor: '#2196f3'
    },
    {
      id: 'customers',
      title: 'Total Customers',
      value: data?.customers?.value || 0,
      percentChange: data?.customers?.percentChange || 0,
      icon: <PeopleIcon />,
      iconColor: '#ff9800'
    },
    {
      id: 'expenses',
      title: 'Total Expenses',
      value: data?.expenses?.value || 0,
      percentChange: data?.expenses?.percentChange || 0,
      icon: <AccountBalanceWalletIcon />,
      iconColor: '#f44336'
    }
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} md={3} key={stat.id}>
          <StatCard
            title={stat.title}
            value={stat.value}
            percentChange={stat.percentChange}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        </Grid>
      ))}
    </Grid>
  );
};

StatisticsCards.propTypes = {
  data: PropTypes.shape({
    sales: PropTypes.shape({
      value: PropTypes.number,
      percentChange: PropTypes.number
    }),
    purchases: PropTypes.shape({
      value: PropTypes.number,
      percentChange: PropTypes.number
    }),
    customers: PropTypes.shape({
      value: PropTypes.number,
      percentChange: PropTypes.number
    }),
    expenses: PropTypes.shape({
      value: PropTypes.number,
      percentChange: PropTypes.number
    })
  })
};

StatisticsCards.defaultProps = {
  data: {
    sales: { value: 0, percentChange: 0 },
    purchases: { value: 0, percentChange: 0 },
    customers: { value: 0, percentChange: 0 },
    expenses: { value: 0, percentChange: 0 }
  }
};

export default StatisticsCards; 