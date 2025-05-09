import { extendTheme } from '@chakra-ui/react';

/**
 * Chakra UI theme configuration
 */
export const theme = extendTheme({
  colors: {
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },
    secondary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
      950: '#042f2e',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.900',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'primary.600',
          color: 'white',
          _hover: {
            bg: 'primary.700',
          },
        },
        outline: {
          borderColor: 'primary.600',
          color: 'primary.600',
          _hover: {
            bg: 'primary.50',
          },
        },
        secondary: {
          bg: 'secondary.500',
          color: 'white',
          _hover: {
            bg: 'secondary.600',
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        color: 'gray.900',
      },
    },
  },
});
