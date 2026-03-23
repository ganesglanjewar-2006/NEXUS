import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Alert } from '@mui/material';
import API from '../../api';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Signing in...' });

    try {
      // FRONTEND → BACKEND: Send credentials to Express /api/users/login
      const response = await API.post('/api/users/login', formData);

      // Save JWT token — this is sent with every future authenticated request
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data._id);
      localStorage.setItem('userName', response.data.name);
      setStatus({ type: 'success', message: `Welcome back, ${response.data.name}!` });

      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Invalid email or password',
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={0}
        sx={{
          p: 5,
          mt: 8,
          borderRadius: 3,
          bgcolor: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(71, 85, 105, 0.4)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome Back
        </Typography>
        <Typography variant="body1" align="center" sx={{ color: '#94a3b8', mb: 4 }}>
          Sign in to your CapitalVue dashboard
        </Typography>

        {status.message && <Alert severity={status.type} sx={{ mb: 3 }}>{status.message}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal" required fullWidth
            id="email" label="Email Address" name="email"
            autoComplete="email" autoFocus
            value={formData.email} onChange={handleChange}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            margin="normal" required fullWidth
            name="password" label="Password" type="password"
            id="password" autoComplete="current-password"
            value={formData.password} onChange={handleChange}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <Button
            type="submit" fullWidth variant="contained" size="large"
            sx={{
              mt: 3, mb: 2, height: 52,
              background: 'linear-gradient(135deg, #f59e0b, #eab308)',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '1rem',
              '&:hover': { background: 'linear-gradient(135deg, #d97706, #ca8a04)' },
            }}
          >
            Sign In
          </Button>
          <Typography variant="body2" align="center" sx={{ color: '#64748b' }}>
            Don't have an account?{' '}
            <Box component={Link} to="/register" sx={{ color: '#eab308', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Create one
            </Box>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
