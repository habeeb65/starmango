import { 
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Box,
  Avatar
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const RecentTransactions = ({ transactions = [] }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card sx={{ height: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
      <CardHeader 
        title="Recent Transactions" 
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Customer/Vendor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 28, 
                          height: 28, 
                          mr: 1,
                          bgcolor: transaction.type === 'sale' 
                            ? 'success.light' 
                            : transaction.type === 'purchase' 
                              ? 'primary.light' 
                              : 'warning.light'
                        }}
                      >
                        {transaction.type === 'sale' ? (
                          <ArrowUpwardIcon fontSize="small" />
                        ) : (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                      </Avatar>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {transaction.type}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{transaction.customerName}</TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell align="right">₹{transaction.amount.toLocaleString()}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={transaction.status} 
                      size="small"
                      sx={{
                        textTransform: 'capitalize',
                        bgcolor: transaction.status === 'completed' 
                          ? 'success.light' 
                          : 'warning.light',
                        color: '#fff'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions; 