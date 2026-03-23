import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider, TextField, Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import SendIcon from '@mui/icons-material/Send';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    return (
        <Box 
            component="footer" 
            sx={{ 
                bgcolor: 'rgba(15, 23, 42, 0.95)', 
                color: '#f1f5f9',
                pt: 8,
                pb: 4,
                borderTop: '1px solid rgba(71, 85, 105, 0.4)',
                mt: 'auto',
                backdropFilter: 'blur(12px)'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={6}>
                    {/* Brand & Description */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" sx={{ 
                            fontWeight: 800, 
                            mb: 2,
                            background: 'linear-gradient(135deg, #f59e0b, #eab308)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            CapitalVue
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8, mb: 3 }}>
                            Empowering investors with real-time portfolio insights and community-driven knowledge. 
                            Track your assets, analyze performance, and connect with the world of finance.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {[FacebookIcon, TwitterIcon, LinkedInIcon, InstagramIcon].map((Icon, i) => (
                                <IconButton key={i} sx={{ color: '#94a3b8', '&:hover': { color: '#eab308', bgcolor: 'rgba(234, 179, 8, 0.1)' } }}>
                                    <Icon />
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                            Quick Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {['Home', 'Dashboard', 'Community', 'Login', 'Register'].map((text) => (
                                <Link 
                                    key={text}
                                    component={RouterLink} 
                                    to={text === 'Home' ? '/' : `/${text.toLowerCase()}`}
                                    sx={{ 
                                        color: '#94a3b8', 
                                        textDecoration: 'none', 
                                        fontSize: '0.9rem',
                                        '&:hover': { color: '#eab308' } 
                                    }}
                                >
                                    {text}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* Support & Resources */}
                    <Grid item xs={6} md={3}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                            Support
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {['Help Center', 'FAQs', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((text) => (
                                <Link 
                                    key={text}
                                    href="#"
                                    sx={{ 
                                        color: '#94a3b8', 
                                        textDecoration: 'none', 
                                        fontSize: '0.9rem',
                                        '&:hover': { color: '#eab308' } 
                                    }}
                                >
                                    {text}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* Newsletter */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                            Newsletter
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                            Subscribe to get the latest market updates and feature releases.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField 
                                placeholder="Your email" 
                                size="small"
                                sx={{ 
                                    bgcolor: 'rgba(15, 23, 42, 0.5)',
                                    '& .MuiOutlinedInput-root': { color: '#f1f5f9', borderRadius: 2 }
                                }}
                            />
                            <Button 
                                variant="contained" 
                                sx={{ 
                                    minWidth: 48, 
                                    p: 0,
                                    bgcolor: '#eab308',
                                    color: '#0f172a',
                                    '&:hover': { bgcolor: '#ca8a04' }
                                }}
                            >
                                <SendIcon fontSize="small" />
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 6, borderColor: 'rgba(71, 85, 105, 0.3)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        © 2026 CapitalVue. All rights reserved. Built with ❤️ for financial freedom.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Designed by Antigravity AI
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
