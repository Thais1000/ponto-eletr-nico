import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Container, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, CircularProgress, 
  Alert, Chip, AppBar, Toolbar, IconButton 
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { apiGetAllUsers } from '../services/api';
import logoPodevim from '../assets/logo.png';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await apiGetAllUsers();
        setUsers(data);
      } catch (err) {
        setError('Não foi possível carregar a lista de utilizadores.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#f0f2f5' }}>
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box component="img" src={logoPodevim} alt="Logo Podevim" sx={{ height: 40, mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Podevim <Chip label="Admin" color="secondary" size="small" sx={{ ml: 1 }} />
            </Typography>
          </Box>
          <IconButton color="primary" onClick={logout} title="Sair">
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Painel de Administração</Typography>
            <Typography sx={{ mb: 3 }}>Gestão de Utilizadores do Sistema</Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Nome Completo</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Função (Role)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>{u.id}</TableCell>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={u.role.toUpperCase()}
                            color={u.role === 'admin' ? 'secondary' : 'primary'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;