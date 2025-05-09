import { defineStyleConfig } from '@chakra-ui/react';

// Define the Menu component theme customization
const MenuButton = {
  baseStyle: {
    _focus: {
      boxShadow: 'outline',
    },
  },
};

export const Menu = {
  parts: ['button', 'list', 'item', 'groupTitle', 'command', 'divider'],
  baseStyle: {
    button: {
      ...MenuButton.baseStyle,
    },
    list: {
      py: 2,
      borderRadius: 'md',
      border: '1px solid',
      borderColor: 'gray.200',
      bg: 'white',
      boxShadow: 'md',
      minW: '180px',
      _dark: {
        bg: 'gray.700',
        borderColor: 'gray.600',
      },
    },
    item: {
      py: 1.5,
      px: 4,
      _focus: {
        bg: 'primary.50',
        color: 'primary.600',
        _dark: {
          bg: 'primary.800',
          color: 'primary.200',
        },
      },
      _hover: {
        bg: 'gray.50',
        _dark: {
          bg: 'gray.600',
        },
      },
      _active: {
        bg: 'primary.50',
        color: 'primary.600',
        _dark: {
          bg: 'primary.800',
          color: 'primary.200',
        },
      },
      _disabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
    },
    groupTitle: {
      px: 3,
      py: 2,
      fontWeight: 'medium',
      fontSize: 'sm',
      color: 'gray.500',
      _dark: {
        color: 'gray.400',
      },
    },
    command: {
      color: 'gray.500',
      fontSize: 'sm',
      _dark: {
        color: 'gray.400',
      },
    },
    divider: {
      my: 2,
      borderColor: 'gray.200',
      _dark: {
        borderColor: 'gray.600',
      },
    },
  },
  
  // Sizes for the menu
  sizes: {
    sm: {
      item: {
        fontSize: 'sm',
        py: 1.5,
        px: 2.5,
      },
      groupTitle: {
        fontSize: 'xs',
        py: 1.5,
        px: 2.5,
      },
    },
    md: {
      item: {
        fontSize: 'md',
        py: 2,
        px: 3,
      },
      groupTitle: {
        fontSize: 'sm',
        py: 2,
        px: 3,
      },
    },
    lg: {
      item: {
        fontSize: 'lg',
        py: 2.5,
        px: 3.5,
      },
      groupTitle: {
        fontSize: 'md',
        py: 2.5,
        px: 3.5,
      },
    },
  },
  
  // Default size
  defaultProps: {
    size: 'md',
  },
};
