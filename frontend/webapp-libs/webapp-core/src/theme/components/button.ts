// Define the Button component theme customization
export const Button = {
  // Base styles applied to all button variants
  baseStyle: {
    fontWeight: 'medium',
    borderRadius: 'md',
    _focus: {
      boxShadow: 'outline',
    },
  },
  
  // Variants
  variants: {
    // Primary solid button
    solid: {
      bg: 'primary.500',
      color: 'white',
      _hover: {
        bg: 'primary.600',
        _disabled: {
          bg: 'primary.500',
        },
      },
      _active: {
        bg: 'primary.700',
      },
    },
    
    // Outline button
    outline: {
      borderColor: 'primary.500',
      color: 'primary.500',
      _hover: {
        bg: 'primary.50',
      },
      _active: {
        bg: 'primary.100',
      },
    },
    
    // Ghost button
    ghost: {
      color: 'gray.600',
      _hover: {
        bg: 'gray.100',
      },
      _active: {
        bg: 'gray.200',
      },
    },
    
    // Link button
    link: {
      color: 'primary.500',
      _hover: {
        textDecoration: 'underline',
        color: 'primary.600',
      },
      _active: {
        color: 'primary.700',
      },
    },
    
    // Secondary solid button
    secondary: {
      bg: 'secondary.500',
      color: 'white',
      _hover: {
        bg: 'secondary.600',
        _disabled: {
          bg: 'secondary.500',
        },
      },
      _active: {
        bg: 'secondary.700',
      },
    },
    
    // Danger solid button
    danger: {
      bg: 'danger.500',
      color: 'white',
      _hover: {
        bg: 'danger.600',
        _disabled: {
          bg: 'danger.500',
        },
      },
      _active: {
        bg: 'danger.700',
      },
    },
  },
  
  // Sizes
  sizes: {
    xs: {
      h: 8,
      minW: 8,
      fontSize: 'xs',
      px: 3,
    },
    sm: {
      h: 9,
      minW: 9,
      fontSize: 'sm',
      px: 4,
    },
    md: {
      h: 10,
      minW: 10,
      fontSize: 'md',
      px: 5,
    },
    lg: {
      h: 12,
      minW: 12,
      fontSize: 'lg',
      px: 6,
    },
    xl: {
      h: 14,
      minW: 14,
      fontSize: 'xl',
      px: 8,
    },
  },
  
  // Default variant and size
  defaultProps: {
    variant: 'solid',
    size: 'md',
    colorScheme: 'primary',
  },
};
