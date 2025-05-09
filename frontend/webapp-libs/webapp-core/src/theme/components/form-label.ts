// Define the FormLabel component theme customization
export const FormLabel = {
  // Base styles applied to all form labels
  baseStyle: {
    fontSize: 'sm',
    fontWeight: 'medium',
    marginBottom: '2',
    color: 'gray.700',
    _dark: {
      color: 'gray.300',
    },
    // Remove the asterisk for required fields
    requiredIndicator: {
      ml: 1,
      color: 'danger.500',
    },
  },
  
  // Sizes (you can keep the default sizes or customize them)
  sizes: {
    sm: {
      fontSize: 'xs',
      marginBottom: '1',
    },
    md: {
      fontSize: 'sm',
      marginBottom: '2',
    },
    lg: {
      fontSize: 'md',
      marginBottom: '2',
    },
  },
  
  // Default size
  defaultProps: {
    size: 'md',
  },
};
