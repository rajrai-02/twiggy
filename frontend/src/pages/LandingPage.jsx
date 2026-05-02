import React from 'react';
import { Box, Typography, Button, Container, Card, AppBar, Toolbar } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StarIcon from '@mui/icons-material/Star';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const FloatingBadge = ({ icon, text, subtext, delay, top, left, right, bottom }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
    transition={{ 
      opacity: { delay, duration: 0.5 },
      scale: { delay, duration: 0.5 },
      y: { repeat: Infinity, duration: 3, ease: 'easeInOut', delay: delay }
    }}
    sx={{
      position: 'absolute',
      top, left, right, bottom,
      zIndex: 10,
    }}
  >
    <Card sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      p: 1.5, 
      gap: 1.5,
      borderRadius: '16px',
      background: 'rgba(30, 41, 59, 0.6)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)',
    }}>
      <Box sx={{ 
        bgcolor: 'primary.main', 
        borderRadius: '50%', 
        p: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: '0 0 15px rgba(255, 107, 107, 0.5)'
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#fff', lineHeight: 1.2 }}>
          {text}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {subtext}
        </Typography>
      </Box>
    </Card>
  </Box>
);

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', bgcolor: 'background.default' }}>
      
      {/* Navbar / Logo */}
      <AppBar position="absolute" elevation={0} sx={{ background: 'transparent', zIndex: 10 }}>
        <Toolbar sx={{ justifyContent: 'space-between', pt: 2, px: { xs: 2, md: 8 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RestaurantMenuIcon sx={{ color: '#FF6B6B', fontSize: 32 }} />
            <Typography variant="h4" fontWeight="800" sx={{ color: '#fff', letterSpacing: '-1px' }}>
              Twiggy<span style={{ color: '#FF6B6B' }}>.</span>
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button sx={{ color: 'text.secondary', mr: 3, fontWeight: 600, '&:hover': { color: '#fff' } }}>For Providers</Button>
            <Button sx={{ color: 'text.secondary', mr: 3, fontWeight: 600, '&:hover': { color: '#fff' } }}>For Riders</Button>
            <Button variant="outlined" color="primary" onClick={() => navigate('/login')} sx={{ borderRadius: '20px', borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
              Sign In
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Subtle Background Glow */}
      <Box sx={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255,107,107,0.15) 0%, rgba(15,23,42,0) 70%)',
        borderRadius: '50%',
        zIndex: 0,
        filter: 'blur(40px)',
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '-10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(78,205,196,0.1) 0%, rgba(15,23,42,0) 70%)',
        borderRadius: '50%',
        zIndex: 0,
        filter: 'blur(40px)',
      }} />

      <Container maxWidth="lg" sx={{ height: '100vh', pt: 16, pb: 4, position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
          
          {/* Left Text Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h1" sx={{ color: 'text.primary', mb: 2, fontSize: { xs: '2.5rem', sm: '3rem', md: '4.5rem' }, lineHeight: 1.1 }}>
                Homestyle Tiffins,<br />
                <span style={{ background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  AI-Curated
                </span> Taste.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, maxWidth: '500px', lineHeight: 1.5, fontSize: { xs: '1rem', md: '1.25rem' }, fontWeight: 400 }}>
                Twiggy curates authentic, daily tiffin subscriptions from top local home-chefs. Hot, fresh, and intelligently personalized to your diet. No thinking, just eating.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ fontSize: '1.1rem', px: 4, py: 1.5, borderRadius: '30px' }}
                >
                  Subscribe Now
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  size="large"
                  startIcon={<RestaurantMenuIcon />}
                  sx={{ fontSize: '1.1rem', px: 4, py: 1.5, borderWidth: 2, borderRadius: '30px', '&:hover': { borderWidth: 2 } }}
                >
                  View AI Menu
                </Button>
              </Box>
            </motion.div>
          </Box>

          {/* Right Image Content */}
          <Box sx={{ flex: 1, position: 'relative', height: { xs: '300px', sm: '400px', md: '600px' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ position: 'relative', width: '100%', maxWidth: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Floating Main Hero Food Image */}
              <Box
                component={motion.img}
                src="/hero_food.png"
                alt="Gourmet Burger"
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: 0,
                  y: [0, -20, 0] // Floating effect
                }}
                transition={{ 
                  opacity: { duration: 1 },
                  scale: { duration: 1 },
                  rotate: { duration: 1 },
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" } 
                }}
                sx={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  zIndex: 2,
                  mixBlendMode: 'lighten', // Blends the dark image background perfectly with the page
                  filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.5))'
                }}
              />

              {/* Floating Badges */}
              <FloatingBadge 
                icon={<StarIcon sx={{ color: '#fff' }} />} 
                text="4.9/5 Rating" 
                subtext="Top Rated Chefs"
                top="10%" 
                left="-10%" 
                delay={0.6}
              />
              
              <FloatingBadge 
                icon={<LocalShippingIcon sx={{ color: '#fff' }} />} 
                text="Live Tracking" 
                subtext="Powered by Redis"
                bottom="10%" 
                right="-10%" 
                delay={0.8}
              />
            </Box>
          </Box>

        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
