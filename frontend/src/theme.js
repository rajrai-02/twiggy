import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F97316',     // Warm saffron orange — the colour of good food
      light: '#FB923C',
      dark: '#EA580C',
    },
    secondary: {
      main: '#16A34A',     // Fresh herb green — garden freshness
      light: '#22C55E',
      dark: '#15803D',
    },
    error: {
      main: '#EF4444',
    },
    warning: {
      main: '#FBBF24',     // Turmeric gold
    },
    background: {
      default: '#0C0A09',  // Charcoal black — like a cast iron skillet
      paper: '#1C1917',    // Dark stone
    },
    text: {
      primary: '#FEF3C7',  // Warm cream — like fresh roti
      secondary: '#A8A29E', // Warm grey
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '10px 24px',
          transition: 'all 0.25s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)',
          boxShadow: '0 4px 20px rgba(249, 115, 22, 0.35)',
          color: '#0C0A09',
          fontWeight: 700,
          '&:hover': {
            boxShadow: '0 6px 24px rgba(249, 115, 22, 0.5)',
            transform: 'translateY(-2px)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)',
          boxShadow: '0 4px 20px rgba(22, 163, 74, 0.3)',
          color: '#fff',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(22, 163, 74, 0.45)',
            transform: 'translateY(-2px)',
          },
        },
        outlinedPrimary: {
          borderColor: '#F97316',
          color: '#F97316',
          borderWidth: '1.5px',
          '&:hover': { borderWidth: '1.5px', background: 'rgba(249,115,22,0.08)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(28, 25, 23, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(249,115,22,0.5)' },
            '&.Mui-focused fieldset': { borderColor: '#F97316' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#F97316' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '@import': "url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap')",
        body: {
          scrollbarColor: '#292524 #0C0A09',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: '#0C0A09' },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '6px',
            background: '#292524',
            '&:hover': { background: '#F97316' },
          },
        },
      },
    },
  },
});

export default theme;
