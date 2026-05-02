import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6B6B', // Vibrant coral/red
      light: '#FF8E8E',
      dark: '#E55A5A',
    },
    secondary: {
      main: '#4ECDC4', // Vibrant teal
      light: '#7EDCD6',
      dark: '#3BADA5',
    },
    background: {
      default: '#0F172A', // Slate 900
      paper: '#1E293B',   // Slate 800
    },
    text: {
      primary: '#F8FAFC', // Slate 50
      secondary: '#CBD5E1', // Slate 300
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          transition: 'all 0.3s ease-in-out',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E8E 90%)',
          boxShadow: '0 3px 15px 2px rgba(255, 107, 107, .3)',
          '&:hover': {
            boxShadow: '0 6px 20px 4px rgba(255, 107, 107, .4)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#4ECDC4 #0F172A',
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#0F172A",
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#1E293B",
            minHeight: 24,
            border: "2px solid #0F172A",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#4ECDC4",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#4ECDC4",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#4ECDC4",
          },
        },
      },
    },
  },
});

export default theme;
