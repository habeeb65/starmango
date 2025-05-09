import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Spinner,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { apiClient } from '@sb/webapp-api-client';

interface Vendor {
  id: number;
  name: string;
  contact_number: string;
  area: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export const NewInvoice = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 },
  ]);

  const [formData, setFormData] = useState({
    vendor_id: '',
    date: new Date().toISOString().split('T')[0],
    lot_number: '',
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await apiClient.vendor.getVendors();
      setVendors(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch vendors',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      amount: field === 'quantity' || field === 'rate'
        ? Number(newItems[index].quantity) * Number(newItems[index].rate)
        : newItems[index].amount,
    };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const invoiceData = {
        ...formData,
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
        })),
        net_total: calculateTotal(),
      };

      await apiClient.invoice.createInvoice(invoiceData);
      toast({
        title: 'Success',
        description: 'Invoice created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard/invoices');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create invoice',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
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
          <Heading size="lg">New Invoice</Heading>
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/invoices')}
          >
            Cancel
          </Button>
        </Flex>

        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            <Flex gap={4}>
              <FormControl isRequired>
                <FormLabel>Vendor</FormLabel>
                <Select
                  name="vendor_id"
                  value={formData.vendor_id}
                  onChange={handleInputChange}
                >
                  <option value="">Select a vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Lot Number</FormLabel>
                <Input
                  name="lot_number"
                  value={formData.lot_number}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Flex>

            <Box>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Items</Heading>
                <Button
                  leftIcon={<FaPlus />}
                  onClick={addItem}
                  size="sm"
                >
                  Add Item
                </Button>
              </Flex>

              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Description</Th>
                      <Th>Quantity</Th>
                      <Th>Rate</Th>
                      <Th>Amount</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {items.map((item, index) => (
                      <Tr key={index}>
                        <Td>
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            placeholder="Item description"
                          />
                        </Td>
                        <Td>
                          <NumberInput
                            value={item.quantity}
                            onChange={(_, value) => handleItemChange(index, 'quantity', value)}
                            min={1}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Td>
                        <Td>
                          <NumberInput
                            value={item.rate}
                            onChange={(_, value) => handleItemChange(index, 'rate', value)}
                            min={0}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Td>
                        <Td>₹{item.amount.toLocaleString()}</Td>
                        <Td>
                          <IconButton
                            icon={<FaTrash />}
                            aria-label="Remove item"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => removeItem(index)}
                            isDisabled={items.length === 1}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>

            <Flex justify="space-between" align="center">
              <Heading size="md">Total: ₹{calculateTotal().toLocaleString()}</Heading>
              <Button
                type="submit"
                colorScheme="primary"
                isLoading={submitting}
                loadingText="Creating..."
              >
                Create Invoice
              </Button>
            </Flex>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}; 