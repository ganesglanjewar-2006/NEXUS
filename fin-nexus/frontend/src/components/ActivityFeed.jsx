import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Chip } from '@mui/material';
import API from '../api';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const ActivityFeed = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchActivity();
        const interval = setInterval(fetchActivity, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchActivity = async () => {
        try {
            const response = await API.get('/api/portfolio/activity');
            setActivities(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching activity:', err);
            setLoading(false);
        }
    };

    const getActionIcon = (action) => {
        if (action === 'BUY') return <TrendingUpIcon sx={{ color: '#22c55e', fontSize: '1rem' }} />;
        if (action === 'SELL') return <TrendingDownIcon sx={{ color: '#ef4444', fontSize: '1rem' }} />;
        return <SwapHorizIcon sx={{ color: '#94a3b8', fontSize: '1rem' }} />;
    };

    return (
        <Paper 
            elevation={0}
            sx={{ 
                p: 2, 
                bgcolor: 'rgba(30, 41, 59, 0.5)', 
                border: '1px solid rgba(71, 85, 105, 0.4)',
                borderRadius: 3,
                height: '100%',
                maxHeight: '600px',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon sx={{ color: '#eab308' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    Live Activity
                </Typography>
                <Chip 
                    label="Community" 
                    size="small" 
                    sx={{ height: 20, fontSize: '0.6rem', bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', ml: 'auto' }} 
                />
            </Box>

            <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(71, 85, 105, 0.4)', borderRadius: '10px' } }}>
                {activities.length === 0 && !loading ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                        No recent activity found.
                    </Typography>
                ) : (
                    activities.map((item, index) => (
                        <React.Fragment key={item._id || index}>
                            <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                                <ListItemAvatar sx={{ minWidth: 48 }}>
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#334155', fontSize: '0.9rem', fontWeight: 700 }}>
                                        {item.userName.charAt(0).toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                            <Typography variant="body2" component="span" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
                                                {item.userName}
                                            </Typography>
                                            <Typography variant="caption" component="span" sx={{ color: '#94a3b8' }}>
                                                {item.action === 'BUY' ? 'bought' : item.action === 'SELL' ? 'sold' : 'updated'}
                                            </Typography>
                                            <Typography variant="body2" component="span" sx={{ fontWeight: 800, color: '#eab308' }}>
                                                {item.symbol}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={
                                        <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                {getActionIcon(item.action)}
                                                {item.quantity} units @ ${item.price}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.65rem' }}>
                                                {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                            {index < activities.length - 1 && <Divider component="li" sx={{ borderColor: 'rgba(71, 85, 105, 0.1)' }} />}
                        </React.Fragment>
                    ))
                )}
            </List>
        </Paper>
    );
};

export default ActivityFeed;
