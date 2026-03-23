import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './components/Home';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard';
import AssetDetail from './components/AssetDetail';
import Community from './components/Community';
import MemberPortfolio from './components/MemberPortfolio';
import Footer from './components/Footer';
import './App.css';

// Custom Material UI Theme — dark navy + gold
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#eab308' },      // Gold
    secondary: { main: '#3b82f6' },    // Blue
    background: {
      default: '#0f172a',              // Deep navy
      paper: '#1e293b',                // Slate
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          {/* NAVBAR — Glassmorphism style */}
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
                sx={{
                  flexGrow: 1,
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  background: 'linear-gradient(135deg, #f59e0b, #eab308, #fbbf24)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.4rem',
                }}
              >
                CapitalVue
              </Typography>
              <Button color="inherit" component={Link} to="/" sx={{ color: '#94a3b8', '&:hover': { color: '#f1f5f9' } }}>
                Home
              </Button>
              <Button color="inherit" component={Link} to="/dashboard" sx={{ color: '#94a3b8', '&:hover': { color: '#f1f5f9' }, ml: 1 }}>
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/community" sx={{ color: '#94a3b8', '&:hover': { color: '#f1f5f9' }, ml: 1 }}>
                Community
              </Button>
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
            </Toolbar>
          </AppBar>

          {/* PAGE CONTENT */}
          <Container disableGutters maxWidth={false} sx={{ minHeight: 'calc(100vh - 64px)', py: 4 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/asset/:id" element={<AssetDetail />} />
              <Route path="/community" element={<Community />} />
              <Route path="/member/:userId" element={<MemberPortfolio />} />
            </Routes>
          </Container>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
