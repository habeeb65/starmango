import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  useToast,
  Alert,
  AlertIcon,
  Select,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@sb/webapp-api-client';
import { useTenantList } from '@sb/webapp-tenants';

// Password reset form values type
interface PasswordResetFormValues {
  email: string;
  tenant_id: string;
}

/**
 * Password Reset component
 * Handles password reset requests with tenant context
 */
export const PasswordReset = () => {
  const toast = useToast();
  const { requestPasswordReset, isLoading: isAuthLoading } = useAuth();
  const { data: tenants = [], isLoading: isTenantsLoading } = useTenantList();
  
  // Form validation and handling
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<PasswordResetFormValues>();
  
  // Track success state
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Handle form submission
  const onSubmit = async (values: PasswordResetFormValues) => {
    try {
      await requestPasswordReset({
        email: values.email,
        tenant_id: values.tenant_id,
      });
      
      setIsSuccess(true);
      
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for instructions to reset your password',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      // Handle password reset request errors
      if (error.message?.includes('email')) {
        setError('email', { message: 'Email not found' });
      } else if (error.message?.includes('tenant')) {
        setError('tenant_id', { message: 'Invalid organization' });
      } else {
        toast({
          title: 'Password reset failed',
          description: error.message || 'Please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
  
  // Loading state combines auth and tenants loading
  const isLoading = isAuthLoading || isTenantsLoading;

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold" mb={2} textAlign="center">
          Reset your password
        </Text>
        
        <Text color="gray.600" textAlign="center" mb={2}>
          Enter your email address and organization, and we'll send you instructions to reset your password.
        </Text>
        
        {isSuccess && (
          <Alert status="success" mb={4} borderRadius="md">
            <AlertIcon />
            Password reset email sent. Please check your inbox.
          </Alert>
        )}
        
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
        
        {/* Tenant Selection - incorporating tenant isolation approach */}
        <FormControl isInvalid={!!errors.tenant_id}>
          <FormLabel htmlFor="tenant_id">Organization</FormLabel>
          <Select
            id="tenant_id"
            placeholder="Select your organization"
            {...register('tenant_id', {
              required: 'Please select your organization',
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
        
        {/* Submit button */}
        <Button
          type="submit"
          colorScheme="primary"
          size="lg"
          fontSize="md"
          isLoading={isLoading}
          isDisabled={isSuccess}
        >
          Reset Password
        </Button>
        
        {/* Back to login link */}
        <Text textAlign="center">
          Remember your password?{' '}
          <Link
            as={RouterLink}
            to="/auth/login"
            color="primary.600"
            fontWeight="medium"
          >
            Back to login
          </Link>
        </Text>
      </Stack>
    </Box>
  );
};
