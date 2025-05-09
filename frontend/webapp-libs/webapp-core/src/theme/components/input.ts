// Define the Input component theme customization
export const Input = {
  // Base styles applied to all input variants
  baseStyle: {
    field: {
      borderRadius: 'md',
      _focus: {
        borderColor: 'primary.500',
        boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
      },
      _placeholder: {
        color: 'gray.400',
      },
    },
  },
  
  // Variants
  variants: {
    outline: {
      field: {
        border: '1px solid',
        borderColor: 'gray.300',
        bg: 'white',
        _hover: {
          borderColor: 'gray.400',
        },
        _dark: {
          borderColor: 'gray.600',
          bg: 'gray.800',
          _hover: {
            borderColor: 'gray.500',
          },
        },
      },
    },
    filled: {
      field: {
        border: '2px solid',
        borderColor: 'transparent',
        bg: 'gray.100',
        _hover: {
          bg: 'gray.200',
        },
        _focus: {
          bg: 'white',
          borderColor: 'primary.500',
        },
        _dark: {
          bg: 'gray.700',
          _hover: {
            bg: 'gray.600',
          },
          _focus: {
            bg: 'gray.800',
          },
        },
      },
    },
    flushed: {
      field: {
        borderBottom: '1px solid',
        borderColor: 'gray.300',
        borderRadius: '0',
        paddingX: '0',
        _focus: {
          borderColor: 'primary.500',
          boxShadow: '0 1px 0 0 var(--chakra-colors-primary-500)',
        },
        _dark: {
          borderColor: 'gray.600',
        },
      },
    },
  },
  
  // Sizes
  sizes: {
    xs: {
      field: {
        fontSize: 'xs',
        px: 2,
        h: 8,
        borderRadius: 'sm',
      },
    },
    sm: {
      field: {
        fontSize: 'sm',
        px: 3,
        h: 9,
        borderRadius: 'sm',
      },
    },
    md: {
      field: {
        fontSize: 'md',
        px: 4,
        h: 10,
      },
    },
    lg: {
      field: {
        fontSize: 'lg',
        px: 5,
        h: 12,
      },
    },
  },
  
  // Default variant and size
  defaultProps: {
    variant: 'outline',
    size: 'md',
  },
};
