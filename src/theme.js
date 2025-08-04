import { createTheme } from '@mui/material/styles';

// Vamos definir as cores principais da nossa aplicação aqui
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // O azul padrão do Material-UI que temos usado
    },
    secondary: {
      main: '#d32f2f', // O vermelho padrão que temos usado para saídas/erros
    },
    background: {
      default: '#f0f2f5', // O nosso cinza claro de fundo
      paper: '#ffffff',   // O branco dos nossos cartões
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h5: {
      fontWeight: 700, // Títulos um pouco mais fortes
    },
    h6: {
      fontWeight: 700,
    }
  },
  shape: {
    borderRadius: 8, // Bordas ligeiramente mais arredondadas para um look moderno
  },
});

export default theme;