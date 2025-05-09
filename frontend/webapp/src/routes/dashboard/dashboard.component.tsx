import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  useColorModeValue,
  Container,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  HStack,
  VStack,
  Divider,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@sb/webapp-tenants';
import { useAuth, apiClient } from '@sb/webapp-api-client';
import {
  FaFileInvoice,
  FaUsers,
  FaChartLine,
  FaBuilding,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaShoppingCart,
  FaMoneyBillWave,
  FaClipboardList,
  FaDatabase,
} from 'react-icons/fa';

// Stats card props
interface StatsCardProps {
  title: string;
  stat: string | number;
  icon: React.ReactElement;
  helpText?: string;
}

const StatsCard = ({ title, stat, icon, helpText }: StatsCardProps) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const statColor = useColorModeValue('gray.900', 'white');
  
  return (
    <Stat
      px={{ base: 4, md: 6 }}
      py="5"
      bg={bgColor}
      shadow="base"
      rounded="lg"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Box pl={2}>
          <StatLabel fontWeight="medium" isTruncated color={textColor}>
            {title}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold" color={statColor}>
            {stat}
          </StatNumber>
          {helpText && (
            <StatHelpText fontSize="sm" color={textColor}>
              {helpText}
            </StatHelpText>
          )}
        </Box>
        <Box
          my="auto"
          color={useColorModeValue('primary.500', 'primary.300')}
          alignContent="center"
        >
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
};

// Navigation item props
interface NavItemProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  href: string;
}

const NavItem = ({ icon, title, description, href }: NavItemProps) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  
  return (
    <Box
      as="button"
      w="full"
      p={4}
      bg={bgColor}
      rounded="lg"
      shadow="base"
      borderWidth="1px"
      borderColor={borderColor}
      onClick={() => navigate(href)}
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'lg',
      }}
      transition="all 0.2s"
    >
      <HStack spacing={4}>
        <Icon as={icon} w={6} h={6} color="primary.500" />
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold">{title}</Text>
          <Text fontSize="sm" color="gray.500">
            {description}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export const Dashboard = () => {
  const { currentTenant } = useTenant();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalPurchases: 0,
    activeCustomers: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch vendors and their outstanding invoices
        const [vendors, outstandingInvoices, customers] = await Promise.all([
          apiClient.vendor.getVendors(),
          apiClient.vendor.getOutstandingInvoices(),
          apiClient.customer.getCustomers()
        ]);
        
        // Calculate total purchases from vendors
        const totalPurchases = vendors.reduce((sum, vendor) => sum + (vendor.total_purchases || 0), 0);
        
        // Calculate pending payments from outstanding invoices
        const pendingPayments = outstandingInvoices.reduce((sum, invoice) => sum + (invoice.due_amount || 0), 0);
        
        // Calculate total sales from customers
        const totalSales = customers.reduce((sum, customer) => sum + (customer.total_sales || 0), 0);
        
        setStats({
          totalSales,
          totalPurchases,
          activeCustomers: customers.length,
          pendingPayments,
        });
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch dashboard data. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleAdminAccess = () => {
    const adminUrl = `http://localhost:8000/admin/`;
    window.open(adminUrl, '_blank');
  };

  const navigationItems = [
    {
      icon: FaFileInvoice,
      title: 'Invoices',
      description: 'Create and manage purchase and sales invoices',
      href: '/dashboard/invoices',
    },
    {
      icon: FaUsers,
      title: 'Customers & Vendors',
      description: 'Manage customer and vendor relationships',
      href: '/dashboard/contacts',
    },
    {
      icon: FaShoppingCart,
      title: 'Inventory',
      description: 'Track and manage your inventory',
      href: '/dashboard/inventory',
    },
    {
      icon: FaMoneyBillWave,
      title: 'Payments',
      description: 'Track payments and manage credit limits',
      href: '/dashboard/payments',
    },
    {
      icon: FaClipboardList,
      title: 'Reports',
      description: 'View business reports and analytics',
      href: '/dashboard/reports',
    },
    {
      icon: FaCog,
      title: 'Settings',
      description: 'Configure your business settings',
      href: '/dashboard/settings',
    },
    {
      icon: FaBuilding,
      title: 'Multi-tenant',
      description: 'Manage multiple business operations',
      href: '/dashboard/tenants',
    },
  ];

  const quickActions = [
    {
      icon: FaFileInvoice,
      title: 'New Invoice',
      href: '/dashboard/invoices/new',
    },
    {
      icon: FaUsers,
      title: 'Add Contact',
      href: '/dashboard/contacts/new',
    },
    {
      icon: FaShoppingCart,
      title: 'Add Product',
      href: '/dashboard/inventory/new',
    },
    {
      icon: FaMoneyBillWave,
      title: 'Record Payment',
      href: '/dashboard/payments/new',
    },
  ];

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="primary.500" />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Header */}
      <Box bg={useColorModeValue('white', 'gray.800')} shadow="sm">
        <Container maxW="7xl">
          <Flex
            h={16}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack spacing={4}>
              <Heading size="md">Star Mango</Heading>
              <Text color="gray.500">|</Text>
              <Text>{currentTenant?.name}</Text>
            </HStack>

            <HStack spacing={4}>
              <Button
                leftIcon={<FaDatabase />}
                variant="ghost"
                onClick={handleAdminAccess}
                title="Access Django Admin"
                colorScheme="blue"
              >
                Admin Panel
              </Button>
              <Button
                leftIcon={<FaBuilding />}
                variant="ghost"
                onClick={() => navigate('/dashboard/tenants')}
              >
                Switch Organization
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  leftIcon={<Avatar size="sm" />}
                >
                  <Text>{currentTenant?.name}</Text>
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FaUserCircle />}>Profile</MenuItem>
                  <MenuItem icon={<FaCog />}>Settings</MenuItem>
                  <Divider />
                  <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        <Stack spacing={8}>
          {/* Welcome Section */}
          <Box>
            <Heading size="lg" mb={2}>
              Welcome back, {currentTenant?.name}
            </Heading>
            <Text color="gray.600">
              Here's an overview of your business operations
            </Text>
          </Box>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <StatsCard
              title="Total Sales"
              stat={`₹${stats.totalSales.toLocaleString()}`}
              icon={<FaMoneyBillWave />}
              helpText="Total sales amount"
            />
            <StatsCard
              title="Total Purchases"
              stat={`₹${stats.totalPurchases.toLocaleString()}`}
              icon={<FaShoppingCart />}
              helpText="Total purchase amount"
            />
            <StatsCard
              title="Active Customers"
              stat={stats.activeCustomers}
              icon={<FaUsers />}
              helpText="Total active customers"
            />
            <StatsCard
              title="Pending Payments"
              stat={`₹${stats.pendingPayments.toLocaleString()}`}
              icon={<FaFileInvoice />}
              helpText="Total pending payments"
            />
          </SimpleGrid>

          {/* Quick Actions */}
          <Box>
            <Heading size="md" mb={4}>Quick Actions</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  leftIcon={<action.icon />}
                  colorScheme="primary"
                  onClick={() => navigate(action.href)}
                >
                  {action.title}
                </Button>
              ))}
            </SimpleGrid>
          </Box>

          {/* Navigation Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {navigationItems.map((item, index) => (
              <NavItem key={index} {...item} />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
};
