import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

const oceanBlue = {
  primary: {
    main: '#0288d1', 
    light: '#5eb8ff',
    dark: '#005b9f',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#006064', 
    light: '#428e92',
    dark: '#00363a',
    contrastText: '#ffffff',
  },
  // Accent colors
  warning: {
    main: '#ff9800', 
    light: '#ffb74d',
    dark: '#f57c00',
    contrastText: '#000000',
  },
  error: {
    main: '#ff5252', 
    light: '#ff867f',
    dark: '#c50e29',
    contrastText: '#ffffff',
  },
  success: {
    main: '#00bfa5', 
    light: '#5df2d6',
    dark: '#008e76',
    contrastText: '#000000',
  },
  info: {
    main: '#64ffda', 
    light: '#9effff',
    dark: '#14cba8',
    contrastText: '#000000',
  },
};

const getDarkModePalette = () => {
  return {
    mode: 'dark' as PaletteMode,
    primary: oceanBlue.primary,
    secondary: oceanBlue.secondary,
    warning: oceanBlue.warning,
    error: oceanBlue.error,
    success: oceanBlue.success,
    info: oceanBlue.info,
    background: {
      default: '#011627', 
      paper: '#0d2538', 
    },
    text: {
      primary: '#e6f1ff',
      secondary: '#8892b0', 
    },
    divider: 'rgba(130, 170, 255, 0.12)',
    action: {
      active: '#64ffda',
      hover: 'rgba(100, 255, 218, 0.08)',
      selected: 'rgba(100, 255, 218, 0.16)',
      disabled: 'rgba(100, 255, 218, 0.3)',
      disabledBackground: 'rgba(100, 255, 218, 0.12)',
    },
  };
};

const deepOceanTheme = createTheme({
  palette: getDarkModePalette(),
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#011627",
            width: '8px',
            height: '8px',
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#0288d1",
            minHeight: 24,
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#5eb8ff",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#5eb8ff",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#011627',
          backgroundImage: 'linear-gradient(rgba(0, 44, 77, 0.9), rgba(1, 22, 39, 0.97))',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
          },
        },
        contained: {
          backgroundImage: 'linear-gradient(135deg, #0288d1 0%, #005b9f 100%)',
        },
        containedSecondary: {
          backgroundImage: 'linear-gradient(135deg, #006064 0%, #00363a 100%)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5eb8ff',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0288d1',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(13, 37, 56, 0.3)',
          },
          '&:hover': {
            backgroundColor: 'rgba(13, 37, 56, 0.5) !important',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#011627',
          color: '#e6f1ff',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(2, 136, 209, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(2, 136, 209, 0.16)',
            '&:hover': {
              backgroundColor: 'rgba(2, 136, 209, 0.2)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '&.MuiChip-colorError': {
            backgroundImage: 'linear-gradient(135deg, #ff5252 0%, #c50e29 100%)',
          },
          '&.MuiChip-colorPrimary': {
            backgroundImage: 'linear-gradient(135deg, #0288d1 0%, #005b9f 100%)',
          },
          '&.MuiChip-colorSecondary': {
            backgroundImage: 'linear-gradient(135deg, #006064 0%, #00363a 100%)',
          },
          '&.MuiChip-colorSuccess': {
            backgroundImage: 'linear-gradient(135deg, #00bfa5 0%, #008e76 100%)',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(2, 136, 209, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(2, 136, 209, 0.16)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(130, 170, 255, 0.12)',
        },
      },
    },
  },
});

export default deepOceanTheme;