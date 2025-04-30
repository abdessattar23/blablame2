import { createTheme } from '@mui/material/styles';

// Creating a theme based on the previous DaisyUI theme colors
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#004751',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#DDE84A',
      contrastText: '#ffffff',
    },
    accent: {
      main: '#f0e9d2',
      dark: '#7f7258',
      contrastText: '#7f7258',
    },
    neutral: {
      main: '#004751',
      contrastText: '#ffffff',
    },
    info: {
      main: '#6399ff',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4ade80',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f9cf58',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fcf6e5',
      paper: '#FCFCFC',
    },
    text: {
      primary: '#004751',
      secondary: '#7f7258',
    },
  },
  typography: {
    fontFamily: [
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.5rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
        },
      },
    },
  },
});

export default theme;
