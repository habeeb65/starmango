import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  Spinner,
  Text,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FaPlus, FaEllipsisV, FaSearch, FaFilePdf, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@sb/webapp-api-client';

interface Invoice {
  id: number;
  invoice_number: string;
  date: string;
  vendor_name: string;
  net_total: number;
  status: 'paid' | 'pending' | 'overdue';
  due_date?: string;
}

export const Invoices = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await apiClient.invoice.getInvoices();
      setInvoices(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch invoices',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.invoice.deleteInvoice(id);
      toast({
        title: 'Success',
        description: 'Invoice deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchInvoices();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete invoice',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDownloadPDF = async (id: number) => {
    try {
      const pdfUrl = await apiClient.invoice.getInvoicePDF(id);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download PDF',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.vendor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'overdue':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="primary.500" />
      </Box>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      <Stack spacing={8}>
        <Flex justify="space-between" align="center">
          <Heading size="lg">Invoices</Heading>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="primary"
            onClick={() => navigate('/dashboard/invoices/new')}
          >
            New Invoice
          </Button>
        </Flex>

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Invoice #</Th>
                <Th>Date</Th>
                <Th>Vendor</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredInvoices.map((invoice) => (
                <Tr key={invoice.id}>
                  <Td>{invoice.invoice_number}</Td>
                  <Td>{new Date(invoice.date).toLocaleDateString()}</Td>
                  <Td>{invoice.vendor_name}</Td>
                  <Td>₹{invoice.net_total.toLocaleString()}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FaEllipsisV />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<FaFilePdf />}
                          onClick={() => handleDownloadPDF(invoice.id)}
                        >
                          Download PDF
                        </MenuItem>
                        <MenuItem
                          icon={<FaEdit />}
                          onClick={() => navigate(`/dashboard/invoices/${invoice.id}/edit`)}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          icon={<FaTrash />}
                          onClick={() => handleDelete(invoice.id)}
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {filteredInvoices.length === 0 && (
          <Box textAlign="center" py={8}>
            <Text color="gray.500">No invoices found</Text>
          </Box>
        )}
      </Stack>
    </Container>
  );
}; 