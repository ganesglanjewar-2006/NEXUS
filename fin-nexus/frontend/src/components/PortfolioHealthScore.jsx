import React from 'react';
import { Paper, Typography, Box, LinearProgress, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

const PortfolioHealthScore = ({ portfolio }) => {
  const calculateScore = () => {
    if (!portfolio || portfolio.length === 0) return 0;

    let score = 0;
    const totalValue = portfolio.reduce((acc, asset) => acc + (asset.quantity * asset.averagePrice), 0);

    // 1. Diversification Score (Max 25 points)
    // 5+ stocks = 25, 3-4 = 15, 1-2 = 5
    const stockCount = portfolio.length;
    if (stockCount >= 5) score += 25;
    else if (stockCount >= 3) score += 15;
    else score += 5;

    // 2. Concentration Risk (Max 25 points)
    // No single stock > 40% of portfolio
    const maxConcentration = Math.max(...portfolio.map(asset => (asset.quantity * asset.averagePrice) / totalValue));
    if (maxConcentration <= 0.4) score += 25;
    else if (maxConcentration <= 0.6) score += 15;
    else score += 5;

    // 3. Asset Mix (Max 25 points)
    // Mix of stocks and crypto
    const hasStocks = portfolio.some(asset => asset.assetType === 'stock');
    const hasCrypto = portfolio.some(asset => asset.assetType === 'crypto');
    if (hasStocks && hasCrypto) score += 25;
    else if (hasStocks || hasCrypto) score += 15;

    // 4. Trading Discipline - Qualitative (Max 25 points)
    // Analyzing emotions (using analytical/confident trades)
    const allHistory = portfolio.flatMap(asset => asset.history || []);
    const disciplinedTrades = allHistory.filter(h => h.emotion === 'analytical' || h.emotion === 'confident');
    const disciplineRatio = allHistory.length > 0 ? disciplinedTrades.length / allHistory.length : 0.5;
    score += Math.round(disciplineRatio * 25);

    return score;
  };

  const score = calculateScore();
  
  const getScoreColor = (s) => {
    if (s >= 80) return '#22c55e'; // Green
    if (s >= 60) return '#eab308'; // Gold/Yellow
    if (s >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreLabel = (s) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    if (s >= 40) return 'Fair';
    return 'Critical';
  };

  const scoreColor = getScoreColor(score);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: 'rgba(30, 41, 59, 0.7)',
        border: `1px solid ${scoreColor}44`,
        mb: 4
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <HealthAndSafetyIcon sx={{ color: scoreColor }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Portfolio Health Score
        </Typography>
      </Box>

      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <Typography variant="h2" sx={{ fontWeight: 800, color: scoreColor }}>
              {score}
            </Typography>
            <Typography variant="caption" sx={{ position: 'absolute', bottom: 10, right: -25, color: '#94a3b8' }}>
              / 100
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: scoreColor, mt: 1, fontWeight: 700 }}>
            {getScoreLabel(score)}
          </Typography>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">Portfolio Strength</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{score}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={score} 
              sx={{ 
                height: 8, 
                borderRadius: 4, 
                bgcolor: 'rgba(71, 85, 105, 0.2)',
                '& .MuiLinearProgress-bar': { bgcolor: scoreColor }
              }} 
            />
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Actionable Insights:</Typography>
          <List dense disablePadding>
            {portfolio.length < 5 && (
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}><WarningIcon sx={{ fontSize: 16, color: '#f97316' }} /></ListItemIcon>
                <ListItemText primary="Increase diversification by adding more unique assets." primaryTypographyProps={{ variant: 'body2', color: '#94a3b8' }} />
              </ListItem>
            )}
            {score < 80 && (
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}><CheckCircleIcon sx={{ fontSize: 16, color: '#3b82f6' }} /></ListItemIcon>
                <ListItemText primary="Try to maintain more 'Analytical' trades to improve discipline score." primaryTypographyProps={{ variant: 'body2', color: '#94a3b8' }} />
              </ListItem>
            )}
            {score >= 80 && (
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 28 }}><CheckCircleIcon sx={{ fontSize: 16, color: '#22c55e' }} /></ListItemIcon>
                <ListItemText primary="Excellent portfolio management! Keep it up." primaryTypographyProps={{ variant: 'body2', color: '#94a3b8' }} />
              </ListItem>
            )}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PortfolioHealthScore;
