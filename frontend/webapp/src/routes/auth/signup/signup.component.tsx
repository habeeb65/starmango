import React, { useState } from 'react';
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
  Select,
  FormHelperText,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@sb/webapp-api-client';
import { useTenantList, useTenant } from '@sb/webapp-tenants';

// Signup form values type
interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  tenant_id: string;
  createTenant: boolean;
  newTenantName: string;
}

/**
 * Signup component
 * Handles user registration with tenant selection or creation
 */
export const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { register: registerUser, isLoading: isAuthLoading } = useAuth();
  const { data: tenants = [], isLoading: isTenantsLoading } = useTenantList();
  const { createTenant, isLoading: isTenantCreating } = useTenant();
  
  // Form validation and handling
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm<SignupFormValues>({
    defaultValues: {
      createTenant: false,
      tenant_id: '',
    }
  });
  
  // Watch form values for conditionals
  const createTenantValue = watch('createTenant');
  
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  // Handle form submission
  const onSubmit = async (values: SignupFormValues) => {
    // Validate passwords match
    if (values.password !== values.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    
    try {
      let tenantId = values.tenant_id;
      
      // Handle tenant creation if selected
      if (values.createTenant && values.newTenantName) {
        const newTenant = await createTenant({
          name: values.newTenantName,
          tenant_id: `tenant-${Date.now().toString(36)}`, // Generate a unique tenant identifier
        });
        tenantId = newTenant.id;
      }
      
      // Register the user
      await registerUser({
        username: values.username,
        email: values.email,
        password: values.password,
        tenant_id: tenantId,
      });
      
      toast({
        title: 'Account created successfully',
        description: 'You can now log in with your credentials',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Navigate to login page
      navigate('/auth/login');
    } catch (error: any) {
      // Handle registration errors
      if (error.message?.includes('username')) {
        setError('username', { message: 'Username already exists' });
      } else if (error.message?.includes('email')) {
        setError('email', { message: 'Email already exists' });
      } else if (error.message?.includes('tenant')) {
        setError('tenant_id', { message: 'Invalid tenant' });
      } else {
        toast({
          title: 'Registration failed',
          description: error.message || 'Please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
  
  // Loading state combines all possible loading states
  const isLoading = isAuthLoading || isTenantsLoading || isTenantCreating;

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold" mb={2} textAlign="center">
          Create a new account
        </Text>
        
        {/* Username field */}
        <FormControl isInvalid={!!errors.username}>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            id="username"
            type="text"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters long',
              },
            })}
          />
          <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
        </FormControl>
        
        {/* Email field */}
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        
        {/* Password field with show/hide toggle */}
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <InputGroup>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
              })}
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
                onClick={togglePasswordVisibility}
                variant="ghost"
                size="sm"
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>
        
        {/* Confirm password field */}
        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
          <Input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === watch('password') || 'Passwords do not match',
            })}
          />
          <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
        </FormControl>
        
        {/* Join or Create Organization section */}
        <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.50">
          <Text fontWeight="medium" mb={3}>Organization</Text>
          
          {/* Option to join existing organization */}
          <FormControl isInvalid={!!errors.tenant_id} mb={4} isDisabled={createTenantValue}>
            <FormLabel htmlFor="tenant_id">Join Existing Organization</FormLabel>
            <Select
              id="tenant_id"
              placeholder="Select an organization"
              isDisabled={createTenantValue}
              {...register('tenant_id', {
                required: !createTenantValue ? 'Please select an organization' : false,
              })}
            >
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.tenant_id?.message}</FormErrorMessage>
          </FormControl>
          
          {/* Option to create a new organization */}
          <FormControl mb={2}>
            <Box display="flex" alignItems="center">
              <input
                type="checkbox"
                id="createTenant"
                {...register('createTenant')}
                onChange={(e) => {
                  setValue('createTenant', e.target.checked);
                  if (e.target.checked) {
                    setValue('tenant_id', '');
                  } else {
                    setValue('newTenantName', '');
                  }
                }}
                style={{ marginRight: '8px' }}
              />
              <FormLabel htmlFor="createTenant" mb={0}>
                Create New Organization
              </FormLabel>
            </Box>
          </FormControl>
          
          {/* New tenant name field */}
          <FormControl isInvalid={!!errors.newTenantName} isDisabled={!createTenantValue}>
            <FormLabel htmlFor="newTenantName">Organization Name</FormLabel>
            <Input
              id="newTenantName"
              placeholder="Organization name"
              isDisabled={!createTenantValue}
              {...register('newTenantName', {
                required: createTenantValue ? 'Organization name is required' : false,
              })}
            />
            <FormErrorMessage>{errors.newTenantName?.message}</FormErrorMessage>
            <FormHelperText>
              Creating a new organization will make you its owner
            </FormHelperText>
          </FormControl>
        </Box>
        
        {/* Submit button */}
        <Button
          type="submit"
          colorScheme="primary"
          size="lg"
          fontSize="md"
          isLoading={isLoading}
        >
          Sign up
        </Button>
        
        <Divider my={2} />
        
        {/* Login link */}
        <Text textAlign="center">
          Already have an account?{' '}
          <Link
            as={RouterLink}
            to="/auth/login"
            color="primary.600"
            fontWeight="medium"
          >
            Log in
          </Link>
        </Text>
      </Stack>
    </Box>
  );
};
