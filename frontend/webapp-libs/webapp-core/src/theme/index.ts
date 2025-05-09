import { extendTheme, ThemeConfig, theme as baseTheme } from '@chakra-ui/react';
import { components } from './components';
import { foundations } from './foundations';

// Chakra UI theme configuration
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Extended theme that combines base theme with our customizations
export const theme = extendTheme({
  config,
  ...foundations,
  components,
  styles: {
    global: {
      body: {
        minHeight: '100vh',
        bg: 'gray.50',
        color: 'gray.800',
      },
      '.chakra-ui-dark': {
        body: {
          bg: 'gray.900',
          color: 'whiteAlpha.900',
        },
      },
    },
  },
});

export * from './components';
export * from './foundations';
