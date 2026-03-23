import React, { useState, useEffect } from 'react';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Container, Typography, Box, Avatar, Chip, Divider, CircularProgress, 
    Alert, Button, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, TextField, InputAdornment 
} from '@mui/material';

const Community = () => {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchCommunityData();
    }, []);

    const fetchCommunityData = async () => {
        try {
            const response = await API.get('/api/portfolio/all');
            setPortfolios(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load community data');
            setLoading(false);
        }
    };

    const filteredPortfolios = portfolios.filter(p => 
        p.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <Container sx={{ mt: 8, textAlign: 'center' }}>
            <CircularProgress color="secondary" />
            <Typography sx={{ mt: 2, color: '#94a3b8' }}>Discovering top investors...</Typography>
        </Container>
    );

    if (error) return (
        <Container sx={{ mt: 4 }}>
            <Alert severity="error">{error}</Alert>
        </Container>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                        <GroupsIcon sx={{ color: '#eab308', fontSize: 32 }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                            Investor Community
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            {portfolios.length} active investors sharing insights.
                        </Typography>
                    </Box>
                </Box>

                {/* SEARCH BAR */}
                <TextField
                    placeholder="Search by name..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#64748b' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        width: { xs: '100%', md: 300 },
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(30, 41, 59, 0.5)',
                            borderRadius: 3,
                            '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                            '&:hover fieldset': { borderColor: '#eab308' },
                            '&.Mui-focused fieldset': { borderColor: '#eab308' },
                        }
                    }}
                />
            </Box>

            {/* LEADERBOARD TABLE */}
            <TableContainer 
                component={Paper} 
                elevation={0}
                sx={{ 
                    bgcolor: 'rgba(30, 41, 59, 0.7)', 
                    border: '1px solid rgba(71, 85, 105, 0.4)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
                            <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 2.5 }}>Rank</TableCell>
                            <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Investor</TableCell>
                            <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Portfolio Value</TableCell>
                            <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Assets</TableCell>
                            <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Top Holding</TableCell>
                            <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPortfolios.length > 0 ? (
                            filteredPortfolios.map((p, index) => {
                                const originalIndex = portfolios.findIndex(original => original.userId === p.userId);
                                return (
                                    <TableRow 
                                        key={p.userId}
                                        sx={{ 
                                            transition: 'all 0.2s ease',
                                            '&:hover': { bgcolor: 'rgba(234, 179, 8, 0.05)' }
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 800, color: '#e2e8f0' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                #{originalIndex + 1}
                                                {originalIndex < 3 && (
                                                    <EmojiEventsIcon 
                                                        sx={{ 
                                                            fontSize: 20, 
                                                            color: originalIndex === 0 ? '#fbbf24' : originalIndex === 1 ? '#94a3b8' : '#b45309' 
                                                        }} 
                                                    />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar 
                                                    sx={{ 
                                                        width: 36, height: 36, fontSize: '0.9rem', fontWeight: 700,
                                                        bgcolor: originalIndex === 0 ? '#eab308' : '#334155',
                                                        color: originalIndex === 0 ? '#0f172a' : '#f1f5f9'
                                                    }}
                                                >
                                                    {p.userName.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography 
                                                    component={Link}
                                                    to={`/member/${p.userId}`}
                                                    sx={{ 
                                                        fontWeight: 700, 
                                                        color: '#f1f5f9',
                                                        textDecoration: 'none',
                                                        '&:hover': { color: '#eab308' }
                                                    }}
                                                >
                                                    {p.userName}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 800, color: '#eab308' }}>
                                                ${p.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                <Chip label={`${p.assetCount} Total`} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }} />
                                                <Chip label={`${p.stockCount} S`} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem', color: '#94a3b8' }} />
                                                <Chip label={`${p.cryptoCount} C`} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem', color: '#94a3b8' }} />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={p.topAsset} 
                                                size="small" 
                                                sx={{ 
                                                    bgcolor: 'rgba(34, 197, 94, 0.1)', 
                                                    color: '#22c55e', 
                                                    fontWeight: 700, 
                                                    borderRadius: 1,
                                                    fontSize: '0.75rem'
                                                }} 
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                component={Link}
                                                to={`/member/${p.userId}`}
                                                startIcon={<VisibilityIcon />}
                                                sx={{
                                                    background: 'rgba(234, 179, 8, 0.1)',
                                                    border: '1px solid rgba(234, 179, 8, 0.3)',
                                                    color: '#eab308',
                                                    fontWeight: 700,
                                                    fontSize: '0.75rem',
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        bgcolor: '#eab308',
                                                        color: '#0f172a',
                                                    }
                                                }}
                                            >
                                                Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 8 }}>
                                    <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                                        No investors found
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                        Try searching for another name.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <WorkspacePremiumIcon sx={{ fontSize: 16 }} />
                    Ranks are calculated based on total portfolio net worth.
                </Typography>
            </Box>
        </Container>
    );
};

export default Community;
