import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Community', path: '/community' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(71, 85, 105, 0.4)',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          onClick={() => navigate('/')}
          sx={{
            flexGrow: 1,
            fontWeight: 800,
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #f59e0b, #eab308, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.4rem',
            cursor: 'pointer',
          }}
        >
          CapitalVue
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{ color: '#eab308' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: '#1e293b',
                  border: '1px solid rgba(71, 85, 105, 0.4)',
                  borderRadius: 2,
                  mt: 1.5,
                  '& .MuiMenuItem-root': {
                    px: 3,
                    py: 1.5,
                    color: '#94a3b8',
                    '&:hover': { color: '#f1f5f9', bgcolor: 'rgba(59, 130, 246, 0.1)' },
                  },
                },
              }}
            >
              {menuItems.map((item) => (
                <MenuItem key={item.label} onClick={() => { handleMenuClose(); navigate(item.path); }}>
                  {item.label}
                </MenuItem>
              ))}
              <MenuItem onClick={() => { handleMenuClose(); navigate('/login'); }}>Login</MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); navigate('/register'); }} sx={{ color: '#eab308 !important', fontWeight: 700 }}>Register</MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                component={Link}
                to={item.path}
                sx={{ color: '#94a3b8', '&:hover': { color: '#f1f5f9' }, ml: 1 }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              variant="outlined"
              component={Link}
              to="/login"
              sx={{ mx: 1, borderColor: '#475569', color: '#f1f5f9', '&:hover': { borderColor: '#eab308', color: '#eab308' } }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              component={Link}
              to="/register"
              sx={{
                background: 'linear-gradient(135deg, #f59e0b, #eab308)',
                color: '#0f172a',
                fontWeight: 700,
                '&:hover': { background: 'linear-gradient(135deg, #d97706, #ca8a04)' },
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
