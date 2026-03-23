import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent, Avatar, Chip,
  Divider, CircularProgress, Alert, Button, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import API from '../api';
import { useParams, useNavigate, Link } from 'react-router-dom';

const MemberPortfolio = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');

  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwner = currentUserId === userId;

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchMemberPortfolio();
  }, [userId]);

  const fetchMemberPortfolio = async () => {
    try {
      const response = await API.get(`/api/portfolio/user/${userId}`);
      setMemberData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load member portfolio');
      setLoading(false);
    }
  };

  if (loading) return (
    <Container maxWidth="lg" sx={{ mt: 8, textAlign: 'center' }}>
      <CircularProgress color="secondary" />
      <Typography sx={{ mt: 2, color: '#94a3b8' }}>Loading portfolio...</Typography>
    </Container>
  );

  if (error || !memberData) return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Alert severity="error">{error || 'Member not found'}</Alert>
      <Button onClick={() => navigate('/community')} sx={{ mt: 2 }}>Back to Community</Button>
    </Container>
  );

  const { user: member, assets } = memberData;
  const totalValue = assets.reduce((sum, a) => sum + (a.quantity * a.averagePrice), 0);
  const stockAssets = assets.filter(a => a.assetType === 'stock');
  const cryptoAssets = assets.filter(a => a.assetType === 'crypto');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/community')}
        sx={{ mb: 3, color: '#94a3b8', '&:hover': { color: '#f1f5f9' } }}
      >
        Back to Community
      </Button>

      {/* Member Profile Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4, mb: 4, borderRadius: 3,
          background: isOwner
            ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(59, 130, 246, 0.15))'
            : 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.7))',
          border: isOwner
            ? '1px solid rgba(234, 179, 8, 0.5)'
            : '1px solid rgba(71, 85, 105, 0.4)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar
              sx={{
                width: 64, height: 64, fontWeight: 800, fontSize: '1.8rem',
                bgcolor: isOwner ? '#eab308' : '#334155',
                border: isOwner ? '3px solid rgba(234, 179, 8, 0.6)' : '3px solid rgba(71, 85, 105, 0.4)',
              }}
            >
              {member.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {member.name}
                </Typography>
                {isOwner && (
                  <Chip
                    label="Your Profile"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(234, 179, 8, 0.15)',
                      color: '#eab308',
                      fontWeight: 700,
                      borderRadius: 1,
                    }}
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {isOwner ? 'You can manage your portfolio here' : 'Read-only view — only the owner can make changes'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">Total Portfolio Value</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#22c55e' }}>
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(71, 85, 105, 0.3)' }} />

        {/* Quick Stats */}
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(15, 23, 42, 0.4)', textAlign: 'center' }}>
              <AccountBalanceWalletIcon sx={{ color: '#eab308', mb: 0.5 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{assets.length}</Typography>
              <Typography variant="caption" color="text.secondary">Total Assets</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(15, 23, 42, 0.4)', textAlign: 'center' }}>
              <TrendingUpIcon sx={{ color: '#3b82f6', mb: 0.5 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{stockAssets.length}</Typography>
              <Typography variant="caption" color="text.secondary">Stocks</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(15, 23, 42, 0.4)', textAlign: 'center' }}>
              <Typography sx={{ color: '#f59e0b', fontSize: 24, mb: 0.5 }}>₿</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{cryptoAssets.length}</Typography>
              <Typography variant="caption" color="text.secondary">Crypto</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(15, 23, 42, 0.4)', textAlign: 'center' }}>
              {isOwner
                ? <PersonIcon sx={{ color: '#22c55e', mb: 0.5 }} />
                : <LockIcon sx={{ color: '#94a3b8', mb: 0.5 }} />
              }
              <Typography variant="h6" sx={{ fontWeight: 700, color: isOwner ? '#22c55e' : '#94a3b8' }}>
                {isOwner ? 'Owner' : 'Viewer'}
              </Typography>
              <Typography variant="caption" color="text.secondary">Access Level</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Owner-only: Add Asset Button */}
      {isOwner && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            component={Link}
            to="/dashboard"
            sx={{
              background: 'linear-gradient(135deg, #f59e0b, #eab308)',
              color: '#0f172a',
              fontWeight: 700,
              '&:hover': { background: 'linear-gradient(135deg, #d97706, #ca8a04)' },
            }}
          >
            Manage Portfolio
          </Button>
        </Box>
      )}

      {/* Portfolio Holdings Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          bgcolor: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(71, 85, 105, 0.4)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalanceWalletIcon sx={{ color: '#eab308' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Portfolio Holdings
          </Typography>
          <Chip
            label={`${assets.length} assets`}
            size="small"
            variant="outlined"
            sx={{ ml: 1, color: '#94a3b8', borderColor: '#475569' }}
          />
          {!isOwner && (
            <Chip
              icon={<VisibilityIcon />}
              label="Read Only"
              size="small"
              sx={{ ml: 'auto', bgcolor: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8' }}
            />
          )}
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)' }}>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Symbol</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="right">Quantity</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="right">Avg. Price</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="right">Value</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.length > 0 ? (
                assets.map((asset) => {
                  const value = asset.quantity * asset.averagePrice;
                  return (
                    <TableRow
                      key={asset._id}
                      sx={{
                        '&:hover': { bgcolor: 'rgba(234, 179, 8, 0.05)' },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            component={Link}
                            to={`/asset/${asset._id}`}
                            sx={{ 
                                fontWeight: 800, 
                                color: '#eab308', 
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' } 
                            }}
                          >
                            {asset.symbol}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          component={Link}
                          to={`/asset/${asset._id}`}
                          sx={{ 
                              color: '#f1f5f9', 
                              fontWeight: 500,
                              textDecoration: 'none',
                              '&:hover': { color: '#eab308' } 
                          }}
                        >
                          {asset.name || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={asset.assetType.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: asset.assetType === 'stock'
                              ? 'rgba(59, 130, 246, 0.15)'
                              : 'rgba(245, 158, 11, 0.15)',
                            color: asset.assetType === 'stock' ? '#3b82f6' : '#f59e0b',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#e2e8f0', fontWeight: 500 }}>
                        {asset.quantity}
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#e2e8f0', fontWeight: 500 }}>
                        ${asset.averagePrice.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#22c55e', fontWeight: 800 }}>
                        ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          component={Link}
                          to={`/asset/${asset._id}`}
                          startIcon={<VisibilityIcon sx={{ fontSize: '1rem !important' }} />}
                          sx={{
                            borderColor: isOwner ? 'rgba(234, 179, 8, 0.5)' : 'rgba(148, 163, 184, 0.3)',
                            color: isOwner ? '#eab308' : '#e2e8f0',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textTransform: 'none',
                            px: 1.5,
                            '&:hover': { 
                                bgcolor: isOwner ? 'rgba(234, 179, 8, 0.1)' : 'rgba(148, 163, 184, 0.05)', 
                                borderColor: isOwner ? '#eab308' : '#f1f5f9',
                                color: isOwner ? '#eab308' : '#f1f5f9'
                            },
                          }}
                        >
                          {isOwner ? 'Manage' : 'View Details'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={isOwner ? 7 : 6} sx={{ textAlign: 'center', color: '#64748b', py: 6 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>No assets yet</Typography>
                    <Typography variant="body2">This portfolio is currently empty.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Read-only Notice for visitors */}
      {!isOwner && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Paper
            elevation={0}
            sx={{
              p: 2, borderRadius: 2,
              bgcolor: 'rgba(148, 163, 184, 0.05)',
              border: '1px solid rgba(148, 163, 184, 0.15)',
            }}
          >
            <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <LockIcon sx={{ fontSize: 16 }} />
              This portfolio is read-only. Only {member.name} can make changes to their holdings.
            </Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default MemberPortfolio;
