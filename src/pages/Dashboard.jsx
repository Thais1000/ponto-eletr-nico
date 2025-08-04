import React, { useState, useEffect } from 'react';
import { 
  Button, Container, Typography, Box, Grid, AppBar, Toolbar, IconButton, 
  CircularProgress, Snackbar, Alert, Card, CardContent, Dialog, 
  DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar, Chip
} from '@mui/material';
import { Logout, AccessTime, Work, WorkOff, Assessment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Clock from '../components/Clock';
import TimeRecordList from '../components/TimeRecordList';
import { useAuth } from '../contexts/AuthContext';
import { apiGetRecords, apiCreateRecord } from '../services/api';
import logoPodevim from '../assets/logo.png';

const calculateWorkedHours = (records) => {
  let totalMilliseconds = 0;
  const todayRecords = records.filter(r => new Date(r.timestamp).toDateString() === new Date().toDateString());
  const entries = todayRecords.filter(r => r.type === 'Entrada').sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const exits = todayRecords.filter(r => r.type === 'Saída').sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  for (let i = 0; i < exits.length; i++) {
    if (entries[i]) {
      totalMilliseconds += new Date(exits[i].timestamp) - new Date(entries[i].timestamp);
    }
  }

  const isWorking = entries.length > exits.length;
  if (isWorking) {
    const lastEntry = entries[entries.length - 1];
    totalMilliseconds += new Date() - new Date(lastEntry.timestamp);
  }

  const hours = Math.floor(totalMilliseconds / 3600000);
  const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
  const totalMinutes = (hours * 60) + minutes;

  return { hours, minutes, totalMinutes, isWorking };
};

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const username = "testuser";

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const lastRecordType = records.length > 0 ? records[records.length - 1].type : 'Saída';
  const clockInStatus = lastRecordType === 'Entrada';

  useEffect(() => {
    const fetchRecords = async () => {
      setRecordsLoading(true);
      try {
        const data = await apiGetRecords();
        setRecords(data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
      } catch (error) { console.error("Erro ao buscar registros", error); } 
      finally { setRecordsLoading(false); }
    };
    fetchRecords();
  }, []);

  const handleClockAction = async (type) => {
    setLoading(true);
    try {
      await apiCreateRecord(type);
      const data = await apiGetRecords();
      setRecords(data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
      setSnackbar({ open: true, message: `${type} registrada com sucesso!`, severity: 'success' });
    } catch(error) {
      setSnackbar({ open: true, message: `Erro ao registrar ${type}.`, severity: 'error' });
    } finally {
      setLoading(false);
      if(type === 'Saída') handleCloseDialog();
    }
  };

  const { hours, minutes, totalMinutes, isWorking } = calculateWorkedHours(records);
  const workdayMinutes = 8 * 60;
  const progress = Math.min((totalMinutes / workdayMinutes) * 100, 100);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* O bgcolor foi removido daqui e do AppBar, pois o tema já define os valores padrão */}
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box component="img" src={logoPodevim} alt="Logo Podevim" sx={{ height: 40, mr: 2 }} />
            <Typography variant="h6" component="div">Podevim</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip avatar={<Avatar>{username.charAt(0).toUpperCase()}</Avatar>} label={`Bem-vindo(a), ${username}`} variant="outlined" sx={{ mr: 2 }}/>
            <IconButton color="primary" onClick={logout} title="Sair"><Logout /></IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Este Box agora herda a cor de fundo do tema */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <Container maxWidth="lg" sx={{height: '100%'}}>
          <Grid container spacing={4} sx={{height: '100%'}}>
            <Grid item xs={12} md={4}>
              <Card sx={{ mb: 4, textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>Registro de Ponto</Typography>
                  <Clock />
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => handleClockAction('Entrada')} disabled={clockInStatus || loading}>Registrar Entrada</Button>
                    <Button variant="contained" color="secondary" onClick={handleOpenDialog} disabled={!clockInStatus || loading}>Registrar Saída</Button>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" component="h2" gutterBottom>Resumo do Dia</Typography>
                  <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
                    <CircularProgress variant="determinate" value={progress} size={120} thickness={4} />
                    <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                      <Typography variant="h5" component="div" color="primary" sx={{ fontWeight: 'bold' }}>{`${hours}h ${minutes}m`}</Typography>
                      <Typography variant="caption" color="text.secondary">de 8h</Typography>
                    </Box>
                  </Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                    {isWorking ? <Work sx={{ mr: 1, color: 'success.main' }} /> : <WorkOff sx={{ mr: 1, color: 'error.main' }} />}
                    <Typography sx={{ color: isWorking ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                      {isWorking ? 'A trabalhar' : 'Fora do expediente'}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<Assessment />}
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={() => navigate('/reports')}
                  >
                    Ver Histórico Completo
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Card sx={{height: '100%'}}>
                <CardContent>
                  <TimeRecordList records={records} isLoading={recordsLoading} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Saída</DialogTitle>
        <DialogContent><DialogContentText>Tem a certeza que deseja registar a sua saída?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={() => handleClockAction('Saída')} color="secondary" autoFocus>Confirmar Saída</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;