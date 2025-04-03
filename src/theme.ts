// src/theme.tsx
import { createTheme } from '@mui/material/styles';

// Define a custom theme with blue, white, and black as main colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#0052cc', // Strong blue as primary color
      light: '#4d8fe0', 
      dark: '#003b9a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#212121', // Deep black as secondary color
      light: '#484848',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    error: {
      main: '#8b0000', // Deep red instead of default red
    },
    background: {
      default: '#ffffff', // White background
      paper: '#f8f9fa',
    },
    text: {
      primary: '#212121',
      secondary: '#616161',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // More modern look with normal case text
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          },
        },
        containedSecondary: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 8,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardError: {
          backgroundColor: '#fff2f2',
          color: '#8b0000',
        },
      },
    },
  },
});

export default theme;