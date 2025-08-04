import React, { useState } from 'react';
import { 
  Button, TextField, Container, Typography, Box, Paper, 
  InputAdornment, IconButton, FormControlLabel, Checkbox, Grid, Link, CircularProgress 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import logoPodevim from '../assets/logo.png';
import { motion } from 'framer-motion';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. A função login agora devolve os dados do utilizador
      const loggedInUser = await login(username, password); 
      
      // 2. ESTE BLOCO IF/ELSE USA OS DADOS PARA DECIDIR
      if (loggedInUser && loggedInUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError("Utilizador ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%' }}>
        <Paper elevation={6} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Box component="img" sx={{ width: 150, mb: 2 }} alt="Logo da Podevim" src={logoPodevim} />
          <Typography component="h1" variant="h5">Controle de Ponto</Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField margin="normal" required fullWidth id="username" label="Utilizador" name="username" autoComplete="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} />
            <TextField margin="normal" required fullWidth name="password" label="Senha" type={showPassword ? 'text' : 'password'} id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" disabled={loading}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}/>
            <FormControlLabel control={<Checkbox value="remember" color="primary" disabled={loading} />} label="Lembre-se de mim" />
            {error && (<Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>{error}</Typography>)}
            <Box sx={{ position: 'relative' }}>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: error ? 1 : 3, mb: 2 }} disabled={loading}>{loading ? 'A entrar...' : 'Entrar'}</Button>
              {loading && (<CircularProgress size={24} sx={{ color: 'primary.main', position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }}/>)}
            </Box>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2" sx={{ pointerEvents: loading ? 'none' : 'auto' }}>Esqueceu a senha?</Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Login;