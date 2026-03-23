import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import API from '../api';

// Custom tooltip style for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: '#1e293b', border: '1px solid #475569', borderRadius: 2, p: 1.5 }}>
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>{label}</Typography>
        <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 600 }}>
          Close: ${payload[0]?.value?.toFixed(2)}
        </Typography>
        {payload[1] && (
          <Typography variant="caption" sx={{ color: '#eab308' }}>
            Volume: {(payload[1]?.value / 1000000).toFixed(1)}M
          </Typography>
        )}
      </Box>
    );
  }
  return null;
};

function StockChart({ symbol, height = 300 }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('');

  useEffect(() => {
    if (!symbol) return;
    fetchStockData();
  }, [symbol]);

  const fetchStockData = async () => {
    setLoading(true);
    try {
      // FRONTEND → BACKEND: Fetch stock price history through our proxy
      // Our backend calls Alpha Vantage API and returns clean data to React
      const response = await API.get(`/api/stocks/${symbol}`);
      setChartData(response.data.history);
      setSource(response.data.source);
      setLoading(false);
    } catch (err) {
      setError('Failed to load stock chart data');
      setLoading(false);
    }
  };

  if (loading) return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CircularProgress size={30} sx={{ color: '#eab308' }} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Loading chart for {symbol}...
      </Typography>
    </Box>
  );

  if (error) return <Alert severity="error">{error}</Alert>;

  // Calculate price change for color coding
  const firstPrice = chartData[0]?.close || 0;
  const lastPrice = chartData[chartData.length - 1]?.close || 0;
  const priceChange = lastPrice - firstPrice;
  const isPositive = priceChange >= 0;
  const chartColor = isPositive ? '#22c55e' : '#ef4444';

  return (
    <Box>
      {/* Price Change Header */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: chartColor }}>
          ${lastPrice?.toFixed(2)}
        </Typography>
        <Typography variant="body2" sx={{ color: chartColor }}>
          {isPositive ? '▲' : '▼'} ${Math.abs(priceChange).toFixed(2)} 
          ({((priceChange / firstPrice) * 100).toFixed(2)}%)
        </Typography>
        <Typography variant="caption" color="text.secondary">
          30-day • {source === 'demo' ? 'Demo Data' : 'Live Data'}
        </Typography>
      </Box>

      {/* Stock Price Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <defs>
            <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(71, 85, 105, 0.3)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickFormatter={(date) => {
              const d = new Date(date);
              return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            domain={['auto', 'auto']}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="close"
            stroke={chartColor}
            strokeWidth={2}
            fill={`url(#gradient-${symbol})`}
            dot={false}
            activeDot={{ r: 4, fill: chartColor }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default StockChart;
