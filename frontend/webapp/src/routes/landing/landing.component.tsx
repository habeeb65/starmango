import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Stack,
  Image,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Link,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  useToast,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { TenantSwitcher } from '@sb/webapp-tenants';
import { useAuth } from '@sb/webapp-api-client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaBuilding, FaChartLine, FaUsers, FaFileInvoice, FaMoneyBillWave, FaClipboardList } from 'react-icons/fa';

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  tenantName: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

/**
 * Landing page component
 * Serves as the main entry point with tenant selection
 */
export const Landing = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const { isLoggedIn, currentUser } = useAuth();
  
  // Chakra color mode values
  const bgGradient = useColorModeValue(
    'linear(to-b, primary.50, gray.50)',
    'linear(to-b, gray.900, gray.800)'
  );
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Features list for the landing page
  const features = [
    {
      icon: FaFileInvoice,
      title: 'Invoice Management',
      description: 'Create and manage purchase and sales invoices with ease. Support for multiple currencies and tax calculations.',
    },
    {
      icon: FaUsers,
      title: 'Customer & Vendor Management',
      description: 'Track customer and vendor relationships, payments, and credit limits. Manage multiple business relationships efficiently.',
    },
    {
      icon: FaChartLine,
      title: 'Inventory Management',
      description: 'Real-time inventory tracking and management. Support for multiple warehouses and stock locations.',
    },
    {
      icon: FaBuilding,
      title: 'Multi-tenant Support',
      description: 'Separate data and operations for multiple businesses. Easy organization switching and management.',
    },
    {
      icon: FaMoneyBillWave,
      title: 'Payment Tracking',
      description: 'Track payments, manage credit limits, and handle multiple payment methods. Automated payment reminders.',
    },
    {
      icon: FaClipboardList,
      title: 'Business Analytics',
      description: 'Comprehensive reports and analytics. Track sales, purchases, and inventory trends.',
    },
  ];
  
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSignup = async (data: SignupFormData) => {
    try {
      // TODO: Implement signup API call
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onLogin = async (data: LoginFormData) => {
    try {
      // TODO: Implement login API call
      toast({
        title: 'Logged in successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid credentials. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box bg={bgGradient} py={20} px={4}>
        <Container maxW="container.xl">
          <Flex 
            direction={{ base: 'column', lg: 'row' }} 
            align="center" 
            justify="space-between"
            gap={10}
          >
            <Stack spacing={8} maxW={{ base: 'full', lg: '50%' }}>
              <Heading 
                as="h1" 
                size="2xl" 
                color={headingColor}
                lineHeight="1.2"
              >
                Streamline Your Business Operations with StarMango
              </Heading>
              <Text fontSize="xl" color={textColor} maxW="600px">
                A powerful SaaS platform for inventory management, vendor tracking, and customer relationship management. Perfect for businesses of all sizes.
              </Text>
              
              {/* Tenant Switcher */}
              {isLoggedIn && (
                <Box mb={4} mt={4}>
                  <Text fontWeight="medium" mb={2}>
                    Select or Create Organization
                  </Text>
                  <TenantSwitcher />
                </Box>
              )}
              
              <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                {isLoggedIn ? (
                  <Button 
                    size="lg" 
                    colorScheme="primary"
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button 
                      as={RouterLink} 
                      to="/auth/login" 
                      size="lg" 
                      colorScheme="primary"
                    >
                      Sign In
                    </Button>
                    <Button 
                      as={RouterLink} 
                      to="/auth/signup" 
                      size="lg" 
                      variant="outline"
                      colorScheme="primary"
                    >
                      Start Free Trial
                    </Button>
                  </>
                )}
              </Stack>
            </Stack>
            
            <Box 
              maxW={{ base: 'full', lg: '50%' }}
              overflow="hidden"
              boxShadow="2xl"
              borderRadius="xl"
            >
              <Image 
                src="https://via.placeholder.com/800x600?text=Dashboard+Preview" 
                alt="Dashboard Preview" 
                borderRadius="xl"
              />
            </Box>
          </Flex>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box py={16} px={4}>
        <Container maxW="container.xl">
          <Stack spacing={4} mb={12} textAlign="center">
            <Heading as="h2" size="xl" color={headingColor}>
              Comprehensive Business Management
            </Heading>
            <Text color={textColor} maxW="700px" mx="auto">
              StarMango provides everything you need to manage your business operations efficiently, from inventory to customer relationships.
            </Text>
          </Stack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {features.map((feature, index) => (
              <Card key={index} bg={cardBg} shadow="md" borderRadius="lg">
                <CardBody>
                  <Flex mb={4} color="primary.500">
                    <Icon as={feature.icon} boxSize={10} />
                  </Flex>
                  <Heading as="h3" size="md" mb={2} color={headingColor}>
                    {feature.title}
                  </Heading>
                  <Text color={textColor}>
                    {feature.description}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Auth Section */}
      <Container maxW="md" py={20}>
        <Box
          bg={bgGradient}
          p={8}
          rounded="lg"
          shadow="base"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Stack spacing={6}>
            <Stack spacing={3} textAlign="center">
              <Heading size="lg">
                {isLogin ? 'Sign In to Your Account' : 'Create New Account'}
              </Heading>
              <Text color="gray.600">
                {isLogin
                  ? 'Enter your credentials to access your account'
                  : 'Set up your business account'}
              </Text>
            </Stack>

            {isLogin ? (
              <form onSubmit={handleLoginSubmit(onLogin)}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!loginErrors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      {...registerLogin('email')}
                    />
                    <FormHelperText color="red.500">
                      {loginErrors.email?.message}
                    </FormHelperText>
                  </FormControl>

                  <FormControl isInvalid={!!loginErrors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      {...registerLogin('password')}
                    />
                    <FormHelperText color="red.500">
                      {loginErrors.password?.message}
                    </FormHelperText>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="primary"
                    width="full"
                    size="lg"
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit(onSignup)}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!signupErrors.tenantName}>
                    <FormLabel>Company Name</FormLabel>
                    <Input
                      {...registerSignup('tenantName')}
                    />
                    <FormHelperText color="red.500">
                      {signupErrors.tenantName?.message}
                    </FormHelperText>
                  </FormControl>

                  <FormControl isInvalid={!!signupErrors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      {...registerSignup('email')}
                    />
                    <FormHelperText color="red.500">
                      {signupErrors.email?.message}
                    </FormHelperText>
                  </FormControl>

                  <FormControl isInvalid={!!signupErrors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      {...registerSignup('password')}
                    />
                    <FormHelperText color="red.500">
                      {signupErrors.password?.message}
                    </FormHelperText>
                  </FormControl>

                  <FormControl isInvalid={!!signupErrors.confirmPassword}>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      {...registerSignup('confirmPassword')}
                    />
                    <FormHelperText color="red.500">
                      {signupErrors.confirmPassword?.message}
                    </FormHelperText>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="primary"
                    width="full"
                    size="lg"
                  >
                    Create Account
                  </Button>
                </VStack>
              </form>
            )}

            <HStack spacing={4} justify="center">
              <Divider />
              <Text color="gray.500" fontSize="sm">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </Text>
              <Divider />
            </HStack>

            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              size="sm"
            >
              {isLogin ? 'Create New Account' : 'Sign In'}
            </Button>
          </Stack>
        </Box>
      </Container>
      
      {/* Admin Quick Links for logged-in users */}
      {isLoggedIn && (
        <Box py={8} px={4} bg={useColorModeValue('gray.50', 'gray.800')}>
          <Container maxW="container.xl">
            <Heading as="h2" size="lg" mb={6} color={headingColor}>
              Admin Quick Links
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              <Card bg={cardBg} shadow="md">
                <CardHeader pb={2}>
                  <Heading size="md">Account Management</Heading>
                </CardHeader>
                <CardBody>
                  <Text mb={4}>Manage your account settings and user profiles.</Text>
                </CardBody>
                <CardFooter pt={0}>
                  <Button 
                    as={RouterLink} 
                    to="/dashboard/accounts" 
                    colorScheme="primary" 
                    variant="outline"
                  >
                    Manage Accounts
                  </Button>
                </CardFooter>
              </Card>
              
              <Card bg={cardBg} shadow="md">
                <CardHeader pb={2}>
                  <Heading size="md">Inventory Control</Heading>
                </CardHeader>
                <CardBody>
                  <Text mb={4}>Track, update, and manage your inventory items.</Text>
                </CardBody>
                <CardFooter pt={0}>
                  <Button 
                    as={RouterLink} 
                    to="/dashboard/inventory" 
                    colorScheme="primary" 
                    variant="outline"
                  >
                    Manage Inventory
                  </Button>
                </CardFooter>
              </Card>
              
              <Card bg={cardBg} shadow="md">
                <CardHeader pb={2}>
                  <Heading size="md">Organization Settings</Heading>
                </CardHeader>
                <CardBody>
                  <Text mb={4}>Configure your organization settings and invite users.</Text>
                </CardBody>
                <CardFooter pt={0}>
                  <Button 
                    as={RouterLink} 
                    to="/dashboard/tenants" 
                    colorScheme="primary" 
                    variant="outline"
                  >
                    Manage Organization
                  </Button>
                </CardFooter>
              </Card>
            </SimpleGrid>
          </Container>
        </Box>
      )}
      
      {/* Call to Action Section */}
      <Box py={16} px={4} bg="primary.500">
        <Container maxW="container.xl">
          <Stack spacing={4} textAlign="center" color="white">
            <Heading as="h2" size="xl">
              Ready to streamline your business operations?
            </Heading>
            <Text fontSize="lg" maxW="700px" mx="auto" opacity={0.9}>
              Get started with StarMango today and take control of your inventory and business processes.
            </Text>
            <Stack 
              direction={{ base: 'column', md: 'row' }} 
              spacing={4} 
              justify="center" 
              mt={6}
            >
              {!isLoggedIn ? (
                <>
                  <Button 
                    as={RouterLink} 
                    to="/auth/signup" 
                    size="lg" 
                    bg="white" 
                    color="primary.500"
                    _hover={{ bg: 'gray.100' }}
                  >
                    Start Free Trial
                  </Button>
                  <Button 
                    as={RouterLink} 
                    to="/auth/login" 
                    size="lg" 
                    variant="outline" 
                    color="white"
                    _hover={{ bg: 'primary.600' }}
                  >
                    Sign In
                  </Button>
                </>
              ) : (
                <Button 
                  as={RouterLink} 
                  to="/dashboard" 
                  size="lg" 
                  bg="white" 
                  color="primary.500"
                  _hover={{ bg: 'gray.100' }}
                >
                  Go to Dashboard
                </Button>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box py={10} px={4} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            justify="space-between" 
            align="center"
          >
            <Text color={textColor}>
              © {new Date().getFullYear()} StarMango. All rights reserved.
            </Text>
            <Stack direction="row" spacing={6} mt={{ base: 4, md: 0 }}>
              <Link color={textColor} href="#">
                Privacy Policy
              </Link>
              <Link color={textColor} href="#">
                Terms of Service
              </Link>
              <Link color={textColor} href="#">
                Contact Us
              </Link>
            </Stack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};
