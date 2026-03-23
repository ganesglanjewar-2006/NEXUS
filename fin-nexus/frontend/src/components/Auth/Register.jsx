import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Alert } from '@mui/material';
import API from '../../api';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Creating your account...' });

    try {
      // FRONTEND → BACKEND: Send registration data to Express /api/users
      const response = await API.post('/api/users', formData);

      // Save token + user info on successful registration
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data._id);
      localStorage.setItem('userName', response.data.name);
      setStatus({ type: 'success', message: 'Account created! Redirecting to dashboard...' });
      setFormData({ name: '', email: '', password: '' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Registration failed. Please try again.',
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
          Get Started
        </Typography>
        <Typography variant="body1" align="center" sx={{ color: '#94a3b8', mb: 4 }}>
          Create your CapitalVue account
        </Typography>

        {status.message && <Alert severity={status.type} sx={{ mb: 3 }}>{status.message}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal" required fullWidth
            id="name" label="Full Name" name="name"
            autoComplete="name" autoFocus
            value={formData.name} onChange={handleChange}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            margin="normal" required fullWidth
            id="email" label="Email Address" name="email"
            autoComplete="email"
            value={formData.email} onChange={handleChange}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            margin="normal" required fullWidth
            name="password" label="Password" type="password"
            id="password" autoComplete="new-password"
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
            Create Account
          </Button>
          <Typography variant="body2" align="center" sx={{ color: '#64748b' }}>
            Already have an account?{' '}
            <Box component={Link} to="/login" sx={{ color: '#eab308', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Sign in
            </Box>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
