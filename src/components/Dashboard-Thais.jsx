import React, { useState } from 'react';
// Imports atualizados
import { Button, Container, Typography, Box, Grid, AppBar, Toolbar, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Logout } from '@mui/icons-material';
import Clock from './Clock';
import TimeRecordList from './TimeRecordList';

const Dashboard = ({ onLogout }) => {
  const [clockInStatus, setClockInStatus] = useState(false);
  const [refreshRecords, setRefreshRecords] = useState(false);
  
  // Novos estados para controlar o loading e a notificação
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Função para simular uma chamada de API e mostrar o feedback
  const handleAction = async (type) => {
    setLoading(true);
    
    // Simula uma chamada de API de 1 segundo
    await new Promise(resolve => setTimeout(resolve, 1000));

    setLoading(false);
    if (type === 'in') {
      setClockInStatus(true);
      setSnackbar({ open: true, message: 'Entrada registrada com sucesso!', severity: 'success' });
    } else {
      setClockInStatus(false);
      setSnackbar({ open: true, message: 'Saída registrada com sucesso!', severity: 'success' });
    }
    setRefreshRecords(prev => !prev);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Ponto Eletrônico
          </Typography>
          <IconButton color="inherit" onClick={onLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12} md={6}>
              <Clock />
            </Grid>
            <Grid item xs={12} md={6} container spacing={2} justifyContent="center">
              <Grid item>
                {/* Botão de Entrada atualizado */}
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleAction('in')} 
                  disabled={clockInStatus || loading}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                  {loading ? 'Registrando...' : 'Registrar Entrada'}
                </Button>
              </Grid>
              <Grid item>
                {/* Botão de Saída atualizado */}
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => handleAction('out')} 
                  disabled={!clockInStatus || loading}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                  {loading ? 'Registrando...' : 'Registrar Saída'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <TimeRecordList refreshKey={refreshRecords} />
      </Container>
      
      {/* Componente Snackbar para notificações */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard;