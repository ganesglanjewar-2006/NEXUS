import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Alert, IconButton, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LockIcon from '@mui/icons-material/Lock';
import API from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import StockChart from './StockChart';

function AssetDetail() {
  const { id } = useParams();  // Gets the asset ID from the URL like /asset/abc123
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateForm, setUpdateForm] = useState({ 
    quantity: '', 
    averagePrice: '', 
    action: 'BUY', 
    notes: '' 
  });
  const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });

  const currentUserId = localStorage.getItem('userId');
  const isOwner = asset && asset.user === currentUserId;

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchAssetDetails();
  }, [id]);

  const fetchAssetDetails = async () => {
    try {
      // FRONTEND → BACKEND: Fetch single asset
      const response = await API.get(`/api/portfolio/${id}`);
      setAsset(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load asset details');
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateStatus({ type: 'info', message: 'Updating...' });
    try {
      // FRONTEND → BACKEND: Update asset and add to history
      await API.put(`/api/portfolio/${id}`, updateForm);
      setUpdateStatus({ type: 'success', message: 'Asset updated!' });
      setUpdateForm({ quantity: '', averagePrice: '', action: 'BUY', notes: '' });
      setShowUpdate(false);
      fetchAssetDetails(); // Refresh data to show new history entry
    } catch (err) {
      setUpdateStatus({ type: 'error', message: 'Failed to update' });
    }
  };

  // Format date nicely: "Mar 19, 2026 at 5:30 PM"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h5" color="text.secondary">Loading asset details...</Typography>
    </Container>
  );

  if (error || !asset) return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
      <Alert severity="error">{error || 'Asset not found'}</Alert>
      <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>Back to Dashboard</Button>
    </Container>
  );

  const totalValue = asset.quantity * asset.averagePrice;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, color: '#94a3b8', '&:hover': { color: '#f1f5f9' } }}
      >
        Back
      </Button>

      {/* Asset Header Card */}
      <Paper
        elevation={0}
        sx={{
          p: 4, mb: 4, borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(59, 130, 246, 0.1))',
          border: '1px solid rgba(234, 179, 8, 0.3)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#eab308' }}>
                {asset.symbol}
              </Typography>
              <Chip label={asset.assetType.toUpperCase()} variant="outlined" sx={{ color: '#94a3b8', borderColor: '#475569' }} />
            </Box>
            <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 400 }}>
              {asset.name || 'N/A'}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">Total Value</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#22c55e' }}>
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(71, 85, 105, 0.4)' }} />

        {/* Quick Stats */}
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">Shares Owned</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{asset.quantity}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Avg. Price per Share</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>${asset.averagePrice}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              <CalendarMonthIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
              Added On
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {formatDate(asset.createdAt)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Last Updated</Typography>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {formatDate(asset.updatedAt)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* 30-Day Stock Price Chart */}
      <Paper
        elevation={0}
        sx={{
          p: 3, mb: 4, borderRadius: 3,
          bgcolor: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(71, 85, 105, 0.4)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          📈 {asset.symbol} — 30-Day Price Chart
        </Typography>
        <StockChart symbol={asset.symbol} height={350} />
      </Paper>

      {/* Update Asset Button + Form — Only visible to Owner */}
      {isOwner && (
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setShowUpdate(!showUpdate)}
            sx={{ borderColor: '#eab308', color: '#eab308', '&:hover': { bgcolor: 'rgba(234, 179, 8, 0.1)', borderColor: '#eab308' } }}
          >
            {showUpdate ? 'Cancel' : 'Buy More / Update'}
          </Button>

          {showUpdate && (
            <Paper elevation={0} sx={{ p: 3, mt: 2, borderRadius: 3, bgcolor: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(71, 85, 105, 0.4)' }}>
              {updateStatus.message && <Alert severity={updateStatus.type} sx={{ mb: 2 }}>{updateStatus.message}</Alert>}
              <Box component="form" onSubmit={handleUpdate} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <TextField
                  select size="small" label="Action" name="action"
                  value={updateForm.action}
                  onChange={(e) => setUpdateForm({ ...updateForm, action: e.target.value })}
                  SelectProps={{ native: true }}
                  sx={{ minWidth: 120, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </TextField>
                <TextField
                  size="small" label="Quantity" name="quantity" type="number"
                  value={updateForm.quantity} required
                  onChange={(e) => setUpdateForm({ ...updateForm, quantity: e.target.value })}
                  sx={{ flex: 1, minWidth: 100, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  size="small" label="Price ($)" name="averagePrice" type="number"
                  value={updateForm.averagePrice} required
                  onChange={(e) => setUpdateForm({ ...updateForm, averagePrice: e.target.value })}
                  sx={{ flex: 1, minWidth: 100, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  size="small" label="Notes (optional)" name="notes"
                  value={updateForm.notes}
                  onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                  sx={{ flex: 2, minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <Button
                  type="submit" variant="contained"
                  sx={{
                    height: 40,
                    background: 'linear-gradient(135deg, #f59e0b, #eab308)',
                    color: '#0f172a', fontWeight: 700,
                    '&:hover': { background: 'linear-gradient(135deg, #d97706, #ca8a04)' },
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Paper>
          )}
        </Box>
      )}

      {!isOwner && (
        <Box sx={{ mb: 4 }}>
          <Chip 
            icon={<LockIcon sx={{ fontSize: '1rem !important' }} />} 
            label="View Only Mode" 
            variant="outlined" 
            sx={{ color: '#94a3b8', borderColor: 'rgba(148, 163, 184, 0.3)' }} 
          />
        </Box>
      )}

      {/* Transaction History Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, bgcolor: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(71, 85, 105, 0.4)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon sx={{ color: '#eab308' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Transaction History
          </Typography>
          <Chip label={`${asset.history?.length || 0} transactions`} size="small" variant="outlined" sx={{ ml: 1, color: '#94a3b8', borderColor: '#475569' }} />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)' }}>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Date & Time</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Action</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="right">Quantity</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="right">Price</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="right">Total</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {asset.history && asset.history.length > 0 ? (
                asset.history.slice().reverse().map((tx, index) => (
                  <TableRow key={index} sx={{ '&:hover': { bgcolor: 'rgba(234, 179, 8, 0.05)' } }}>
                    <TableCell sx={{ color: '#e2e8f0' }}>
                      {formatDate(tx.date)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={tx.action === 'BUY' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        label={tx.action}
                        size="small"
                        sx={{
                          bgcolor: tx.action === 'BUY' ? 'rgba(34, 197, 94, 0.15)' : tx.action === 'SELL' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                          color: tx.action === 'BUY' ? '#22c55e' : tx.action === 'SELL' ? '#ef4444' : '#3b82f6',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ color: '#e2e8f0', fontWeight: 500 }}>
                      {tx.quantity}
                    </TableCell>
                    <TableCell align="right" sx={{ color: '#e2e8f0', fontWeight: 500 }}>
                      ${tx.price?.toFixed(2)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: '#eab308', fontWeight: 600 }}>
                      ${(tx.quantity * tx.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>
                      <Typography variant="body2" sx={{ color: '#e2e8f0' }}>{tx.notes}</Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', color: '#64748b', py: 4 }}>
                    No transaction history yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default AssetDetail;
