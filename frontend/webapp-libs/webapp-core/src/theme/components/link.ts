// Define the Link component theme customization
export const Link = {
  // Base styles applied to all links
  baseStyle: {
    color: 'primary.500',
    _hover: {
      textDecoration: 'underline',
      color: 'primary.600',
    },
    _focus: {
      boxShadow: 'outline',
      textDecoration: 'underline',
    },
    _active: {
      color: 'primary.700',
    },
    _dark: {
      color: 'primary.300',
      _hover: {
        color: 'primary.200',
      },
      _active: {
        color: 'primary.400',
      },
    },
  },
  
  // Variants
  variants: {
    // Subtle link with no decoration until hover
    subtle: {
      textDecoration: 'none',
      _hover: {
        textDecoration: 'underline',
      },
    },
    
    // Emphasized link with underline
    emphasized: {
      fontWeight: 'semibold',
      textDecoration: 'underline',
    },
    
    // Nav link style
    nav: {
      color: 'gray.600',
      textDecoration: 'none',
      fontWeight: 'medium',
      _hover: {
        color: 'primary.500',
        textDecoration: 'none',
      },
      _active: {
        color: 'primary.700',
      },
      _dark: {
        color: 'gray.300',
        _hover: {
          color: 'primary.300',
        },
        _active: {
          color: 'primary.400',
        },
      },
    },
    
    // Button-like link
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2',
      borderRadius: 'md',
      color: 'primary.500',
      bg: 'transparent',
      _hover: {
        bg: 'primary.50',
        textDecoration: 'none',
        _dark: {
          bg: 'gray.700',
        },
      },
      _active: {
        bg: 'primary.100',
        color: 'primary.700',
        _dark: {
          bg: 'gray.600',
        },
      },
    },
  },
  
  // Default variant
  defaultProps: {
    variant: 'subtle',
  },
};
