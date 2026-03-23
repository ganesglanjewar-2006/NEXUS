import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Button, TextField, Grid, Card, CardContent, Alert, Chip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import StockChart from './StockChart';
import PortfolioHealthScore from './PortfolioHealthScore';
import ActivityFeed from './ActivityFeed';

function Dashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [newAsset, setNewAsset] = useState({
    symbol: '', 
    name: '', 
    quantity: '', 
    averagePrice: '', 
    assetType: 'stock'
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchPortfolio();
  }, [navigate]);

  const fetchPortfolio = async () => {
    try {
      // FRONTEND → BACKEND: Fetch portfolio
      const response = await API.get('/api/portfolio');
      setPortfolio(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch portfolio');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewAsset({ ...newAsset, [e.target.name]: e.target.value });
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/portfolio', newAsset);
      setNewAsset({ 
        symbol: '', 
        name: '', 
        quantity: '', 
        averagePrice: '', 
        assetType: 'stock'
      });
      fetchPortfolio();
    } catch (err) {
      setError('Failed to add asset');
    }
  };

  const handleDeleteAsset = async (id) => {
    try {
      await API.delete(`/api/portfolio/${id}`);
      fetchPortfolio();
    } catch (err) {
      setError('Failed to delete asset');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Calculate total portfolio value
  const totalValue = portfolio.reduce((sum, a) => sum + (a.quantity * a.averagePrice), 0);

  if (loading) return (
    <Container maxWidth="lg" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h5" color="text.secondary">Loading dashboard...</Typography>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            <AccountBalanceWalletIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#eab308' }} />
            My Portfolio
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your investments
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ borderColor: '#ef4444', color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' } }}
        >
          Logout
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Portfolio Summary Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3, mb: 4, borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(59, 130, 246, 0.1))',
          border: '1px solid rgba(234, 179, 8, 0.3)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">Total Portfolio Value</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#eab308' }}>
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip icon={<TrendingUpIcon />} label={`${portfolio.length} Assets`} variant="outlined" sx={{ color: '#94a3b8', borderColor: '#475569' }} />
          </Box>
        </Box>
      </Paper>

      {/* Health Score Panel */}
      {portfolio.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <PortfolioHealthScore portfolio={portfolio} />
        </Box>
      )}

      <Grid container spacing={4}>
        {/* Current Holdings */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom sx={{ color: '#94a3b8', fontWeight: 500 }}>
            Current Holdings
          </Typography>
          {portfolio.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(30, 41, 59, 0.5)', border: '1px dashed #475569', borderRadius: 3 }}>
              <Typography color="text.secondary">No assets yet. Add your first investment! →</Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {portfolio.map((asset) => (
                <Grid item xs={12} sm={6} key={asset._id}>
                  <Card
                    elevation={0}
                    className="cv-card"
                    onClick={() => navigate(`/asset/${asset._id}`)}
                    sx={{
                      bgcolor: 'rgba(30, 41, 59, 0.7)',
                      border: '1px solid rgba(71, 85, 105, 0.4)',
                      borderRadius: 3,
                      cursor: 'pointer',
                      '&:hover': { borderColor: 'rgba(234, 179, 8, 0.5)' },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#eab308' }}>
                          {asset.symbol}
                        </Typography>
                        <Chip label={asset.assetType.toUpperCase()} size="small" variant="outlined" sx={{ color: '#94a3b8', borderColor: '#475569', fontSize: '0.7rem' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {asset.name}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#f1f5f9' }}>
                        <strong>{asset.quantity}</strong> shares @ <strong>${asset.averagePrice}</strong>
                      </Typography>
                      {/* Show when the asset was added */}
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1 }}>
                        Added: {new Date(asset.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 600 }}>
                          ${(asset.quantity * asset.averagePrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#94a3b8', mr: 1 }}>Click for details</Typography>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteAsset(asset._id); }} sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {/* Right: Social Sidebar & Add Form */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Live Activity Feed */}
            <ActivityFeed />

            {/* Add Asset Form */}
            <Paper
              elevation={0}
              sx={{
                p: 3, borderRadius: 3,
                bgcolor: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(71, 85, 105, 0.4)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Add New Asset
              </Typography>
              <Box component="form" onSubmit={handleAddAsset}>
                <TextField
                  margin="dense" required fullWidth size="small"
                  label="Ticker Symbol" name="symbol" placeholder="e.g. AAPL"
                  value={newAsset.symbol} onChange={handleInputChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  margin="dense" fullWidth size="small"
                  label="Company Name" name="name" placeholder="e.g. Apple Inc."
                  value={newAsset.name} onChange={handleInputChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  margin="dense" required fullWidth size="small"
                  label="Quantity" name="quantity" type="number"
                  value={newAsset.quantity} onChange={handleInputChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  margin="dense" required fullWidth size="small"
                  label="Avg. Price ($)" name="averagePrice" type="number"
                  value={newAsset.averagePrice} onChange={handleInputChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <Button
                  type="submit" fullWidth variant="contained"
                  sx={{
                    mt: 2, height: 44,
                    background: 'linear-gradient(135deg, #f59e0b, #eab308)',
                    color: '#0f172a',
                    fontWeight: 700,
                    '&:hover': { background: 'linear-gradient(135deg, #d97706, #ca8a04)' },
                  }}
                >
                  Add to Portfolio
                </Button>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Market Overview — Charts for each portfolio asset */}
      {portfolio.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            📊 Market Overview
          </Typography>
          <Grid container spacing={3}>
            {portfolio.slice(0, 4).map((asset) => (
              <Grid item xs={12} md={6} key={asset._id + '-chart'}>
                <Paper
                  elevation={0}
                  className="cv-card"
                  onClick={() => navigate(`/asset/${asset._id}`)}
                  sx={{
                    p: 3, borderRadius: 3, cursor: 'pointer',
                    bgcolor: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(71, 85, 105, 0.4)',
                    '&:hover': { borderColor: 'rgba(234, 179, 8, 0.5)' },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#eab308', mb: 1 }}>
                    {asset.symbol} — {asset.name || 'Stock'}
                  </Typography>
                  <StockChart symbol={asset.symbol} height={200} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default Dashboard;
