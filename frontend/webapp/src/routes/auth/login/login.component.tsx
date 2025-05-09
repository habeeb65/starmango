import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  FormErrorMessage,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

// Simple login form values type
interface LoginFormValues {
  username: string;
  password: string;
}

/**
 * Login component with Direct Dashboard Access
 */
export const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Basic form setup
  const {
    register,
    formState: { errors },
  } = useForm<LoginFormValues>();
  
  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // Direct access to dashboard function
  const accessDashboard = () => {
    try {
      // Create fake auth data
      const fakeUser = {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        tenant: {
          id: '1',
          name: 'Default Organization',
          slug: 'default-organization'
        }
      };
      
      // Store in localStorage
      localStorage.setItem('starmango_access_token', 'direct-access-token');
      localStorage.setItem('starmango_refresh_token', 'direct-refresh-token');
      localStorage.setItem('starmango_current_user', JSON.stringify(fakeUser));
      localStorage.setItem('starmango_current_tenant', '1');
      
      // Show success toast
      toast({
        title: 'Access granted!',
        description: 'Redirecting to dashboard...',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      console.error('Dashboard access error:', error);
      toast({
        title: 'Access failed',
        description: 'Unable to access dashboard',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  return (
    <Box maxWidth="400px" margin="0 auto">
      <Stack spacing={5} py={5}>
        <Box textAlign="center" mb={4}>
          <Text fontSize="2xl" fontWeight="bold" color="primary.600">StarMango Login</Text>
          <Text color="gray.600">Access your tenant dashboard</Text>
        </Box>
        
        {/* Direct Dashboard Access Button */}
        <Button
          onClick={accessDashboard}
          colorScheme="green"
          size="lg"
          fontSize="md"
          fontWeight="bold"
          height="70px"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.15)"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
          }}
          _active={{
            transform: 'translateY(0)',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
          }}
          mb={6}
        >
          ✅ ACCESS DASHBOARD NOW
        </Button>
        
        <Divider />
        
        {/* Username field */}
        <FormControl isInvalid={!!errors.username}>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            id="username"
            placeholder="Enter username"
            {...register('username', { required: 'Username is required' })}
          />
          <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
        </FormControl>
        
        {/* Password field */}
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <InputGroup>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              {...register('password', { required: 'Password is required' })}
            />
            <InputRightElement>
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                icon={
                  showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18px">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18px">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )
                }
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
                size="sm"
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>
        
        {/* Submit button */}
        <Button
          type="submit"
          colorScheme="primary"
          size="lg"
          fontSize="md"
          onClick={accessDashboard} // Use same function for both buttons
        >
          Sign in
        </Button>
        
        <Divider my={2} />
        
        {/* Sign up link */}
        <Text textAlign="center">
          Don't have an account?{' '}
          <Link
            as={RouterLink}
            to="/auth/signup"
            color="primary.600"
            fontWeight="medium"
          >
            Sign up
          </Link>
        </Text>
      </Stack>
    </Box>
  );
};
