import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, Grid, Card, CardContent, Avatar, 
    Chip, Divider, CircularProgress, Accordion, AccordionSummary, 
    AccordionDetails, Button, useTheme, useMediaQuery, Fade, Slide,
    Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SecurityIcon from '@mui/icons-material/Security';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import heroBg from '../assets/hero-bg.png';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const faqs = [
        { q: "What is CapitalVue?", a: "CapitalVue is a premium finance dashboard designed to help you track your stocks and crypto assets in one place with real-time insights-simulated data and community features." },
        { q: "Is my data secure?", a: "Absolutely. We use industry-standard JWT encryption and secure MongoDB Atlas hosting to ensure your financial data remains private and protected." },
        { q: "Can I see other people's portfolios?", a: "Yes! Our Community feature allows you to browse public portfolios of other investors, learn from their strategies, and see the top holdings in the network." },
        { q: "Is it free to use?", a: "Currently, CapitalVue is open for all finance enthusiasts. Join our growing community and start building your financial future today." }
    ];

    return (
        <Box sx={{ color: '#f1f5f9', overflow: 'hidden' }}>
            {/* HERO SECTION */}
            <Box sx={{ 
                position: 'relative', 
                minHeight: '95vh', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                mt: -12, 
                pt: 12,
                overflow: 'hidden'
            }}>
                {/* Background Video */}
                <Box 
                    component="video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={heroBg}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0,
                        filter: 'brightness(0.4) contrast(1.2)'
                    }}
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-stock-market-data-on-a-digital-screen-22441-large.mp4" type="video/mp4" />
                </Box>

                {/* Gradient Overlay */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    zIndex: 1
                }} />

                <Container maxWidth="lg" sx={{ zIndex: 2, position: 'relative' }}>
                    <Fade in timeout={1500}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography 
                                variant="overline" 
                                sx={{ 
                                    color: '#eab308', 
                                    fontWeight: 700, 
                                    letterSpacing: 4,
                                    fontSize: '1rem',
                                    display: 'block',
                                    mb: 2,
                                    animation: 'fadeInUp 1s ease-out'
                                }}
                            >
                                THE FUTURE OF PORTFOLIO MANAGEMENT
                            </Typography>
                            <Typography 
                                variant="h1" 
                                sx={{ 
                                    fontWeight: 900, 
                                    fontSize: { xs: '3rem', md: '5rem' }, 
                                    lineHeight: 1.1,
                                    mb: 3,
                                    background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                }}
                            >
                                Track your Wealth <br/> with Precision.
                            </Typography>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: '#94a3b8', 
                                    maxWidth: 700, 
                                    mx: 'auto', 
                                    mb: 5,
                                    fontWeight: 300,
                                    fontSize: { xs: '1rem', md: '1.25rem' }
                                }}
                            >
                                Experience the most intuitive and powerful finance dashboard. 
                                Real-time tracking, community insights, and professional-grade analytics at your fingertips.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Button 
                                    variant="contained" 
                                    onClick={() => navigate('/register')}
                                    sx={{ 
                                        px: 4, py: 1.5, fontSize: '1.1rem',
                                        background: 'linear-gradient(135deg, #f59e0b, #eab308)',
                                        color: '#0f172a',
                                        fontWeight: 800,
                                        '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
                                    }}
                                >
                                    Get Started Free
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => navigate('/community')}
                                    sx={{ 
                                        px: 4, py: 1.5, fontSize: '1.1rem',
                                        borderColor: '#475569',
                                        color: '#f1f5f9',
                                        fontWeight: 600,
                                        '&:hover': { borderColor: '#eab308', color: '#eab308' }
                                    }}
                                >
                                    Explore Community
                                </Button>
                            </Box>
                        </Box>
                    </Fade>
                </Container>
            </Box>

            {/* FEATURES SECTION */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                        Why Choose <Box component="span" sx={{ color: '#eab308' }}>CapitalVue?</Box>
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 300 }}>
                        Powerful features designed for the modern investor.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {[
                        { 
                            icon: <ShowChartIcon sx={{ fontSize: 40 }} />, 
                            title: 'Real-time Analytics', 
                            desc: 'Monitor your assets with dynamic charts and live performance tracking metrics.',
                            color: '#eab308'
                        },
                        { 
                            icon: <GroupsIcon sx={{ fontSize: 40 }} />, 
                            title: 'Community Portfolios', 
                            desc: 'Connect with other investors, browse public holdings, and share knowledge.',
                            color: '#3b82f6'
                        },
                        { 
                            icon: <SecurityIcon sx={{ fontSize: 40 }} />, 
                            title: 'Secure Banking-Grade Encryption', 
                            desc: 'Your data is protected with state-of-the-art JWT authentication and encryption.',
                            color: '#22c55e'
                        },
                        { 
                            icon: <RocketLaunchIcon sx={{ fontSize: 40 }} />, 
                            title: 'Portfolio Health', 
                            desc: 'Get a unique health score for your investments based on diversification and performance.',
                            color: '#f43f5e'
                        }
                    ].map((feature, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Card sx={{ 
                                height: '100%', 
                                bgcolor: 'rgba(30, 41, 59, 0.4)', 
                                border: '1px solid rgba(71, 85, 105, 0.3)',
                                borderRadius: 4,
                                transition: '0.3s',
                                '&:hover': { 
                                    transform: 'translateY(-10px)', 
                                    borderColor: feature.color,
                                    bgcolor: 'rgba(30, 41, 59, 0.6)'
                                }
                            }}>
                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                    <Avatar sx={{ 
                                        width: 70, height: 70, 
                                        mx: 'auto', mb: 3, 
                                        bgcolor: `rgba(${i === 0 ? '234, 179, 8' : i === 1 ? '59, 130, 246' : i === 2 ? '34, 197, 94' : '244, 63, 94'}, 0.1)`,
                                        color: feature.color 
                                    }}>
                                        {feature.icon}
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{feature.title}</Typography>
                                    <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.7 }}>{feature.desc}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* FAQ SECTION */}
            <Box sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)', py: 12 }}>
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Frequently Asked <Box component="span" sx={{ color: '#eab308' }}>Questions</Box></Typography>
                        <Typography variant="body1" sx={{ color: '#94a3b8' }}>Everything you need to know about getting started with CapitalVue.</Typography>
                    </Box>

                    {faqs.map((faq, i) => (
                        <Accordion 
                            key={i} 
                            sx={{ 
                                bgcolor: 'transparent', 
                                border: '1px solid rgba(71, 85, 105, 0.3)', 
                                mb: 2, 
                                borderRadius: '12px !important',
                                '&:before': { display: 'none' } 
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#eab308' }} />}>
                                <Typography sx={{ fontWeight: 600 }}>{faq.q}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography sx={{ color: '#94a3b8' }}>{faq.a}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Container>
            </Box>

            {/* CALL TO ACTION */}
            <Box sx={{ py: 12, textAlign: 'center' }}>
                <Container maxWidth="md">
                    <Paper sx={{ 
                        p: 8, 
                        borderRadius: 6, 
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        border: '1px solid #eab308',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Typography variant="h2" sx={{ fontWeight: 900, mb: 3 }}>Ready to Take <br/> Control?</Typography>
                            <Typography variant="h6" sx={{ color: '#94a3b8', mb: 5, fontWeight: 300 }}>Join thousands of investors already managing their portfolios on CapitalVue.</Typography>
                            <Button 
                                variant="contained" 
                                size="large"
                                onClick={() => navigate('/register')}
                                sx={{ 
                                    px: 8, py: 2, 
                                    borderRadius: 3, 
                                    fontSize: '1.2rem',
                                    background: 'linear-gradient(135deg, #f59e0b, #eab308)',
                                    color: '#0f172a',
                                    fontWeight: 800,
                                    '&:hover': { transform: 'scale(1.05)', transition: '0.3s' }
                                }}
                            >
                                Start Your Journey Now
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>

            {/* CSS Animations */}
            <style>
                {`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </Box>
    );
};

export default Home;
