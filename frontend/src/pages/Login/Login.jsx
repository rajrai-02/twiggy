import React, { useState } from 'react';
import { Typography, TextField } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import styles from './Login.module.css';
import shared from '../../styles/shared.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', role: 'consumer' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Backend sets HTTP-only access/refresh token cookies automatically.
      // We only store the non-sensitive user profile for client-side routing.
      const { data } = await axiosClient.post('/auth/login', loginForm);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      const role = data.user.role;
      if (role === 'provider') navigate('/dashboard/provider');
      else if (role === 'delivery') navigate('/dashboard/delivery');
      else navigate('/dashboard/consumer');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosClient.post('/auth/register', registerForm);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      const role = data.user.role;
      if (role === 'provider') navigate('/dashboard/provider');
      else navigate('/dashboard/consumer');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/v1/auth/google';
  };

  return (
    <div className={styles.page}>

      {/* Background Glow Orbs */}
      <div className={`${shared.glowOrbCoral}`} style={{ top: '10%', right: '15%' }} />
      <div className={`${shared.glowOrbTeal}`} style={{ bottom: '-10%', left: '-5%' }} />

      <motion.div
        className={`${shared.glassCard} ${styles.card}`}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className={styles.logo}>
          <RestaurantMenuIcon sx={{ color: '#FF6B6B', fontSize: 30 }} />
          <Typography variant="h5" fontWeight="800" sx={{ color: '#fff', letterSpacing: '-0.5px' }}>
            Twiggy<span style={{ color: '#FF6B6B' }}>.</span>
          </Typography>
        </div>

        {/* Tab Bar */}
        <div className={styles.tabBar}>
          <button
            className={`${styles.tab} ${activeTab === 'login' ? styles.tabActive : ''}`}
            onClick={() => { setActiveTab('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'register' ? styles.tabActive : ''}`}
            onClick={() => { setActiveTab('register'); setError(''); }}
          >
            Register
          </button>
        </div>

        {/* Error Message */}
        {error && <div className={`${styles.errorBox} ${shared.glassCardFlat}`}>{error}</div>}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form className={styles.form} onSubmit={handleLogin}>
            <TextField
              label="Email" type="email" fullWidth required variant="outlined" size="small"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            />
            <TextField
              label="Password" type="password" fullWidth required variant="outlined" size="small"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            <a className={styles.forgotLink} onClick={() => navigate('/forgot-password')}>Forgot password?</a>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div className={shared.dividerWithText}>or</div>
            <button type="button" className={styles.googleBtn} onClick={handleGoogleLogin}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={20} />
              Continue with Google
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form className={styles.form} onSubmit={handleRegister}>
            <TextField
              label="Full Name" fullWidth required variant="outlined" size="small"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
            />
            <TextField
              label="Email" type="email" fullWidth required variant="outlined" size="small"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            />
            <TextField
              label="Password" type="password" fullWidth required variant="outlined" size="small"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            />
            <TextField
              select fullWidth label="I am a..." variant="outlined" size="small"
              value={registerForm.role}
              onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="consumer">Consumer (Order Tiffins)</option>
              <option value="provider">Provider (Offer Tiffins)</option>
              <option value="delivery">Delivery Partner</option>
            </TextField>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <div className={shared.dividerWithText}>or</div>
            <button type="button" className={styles.googleBtn} onClick={handleGoogleLogin}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={20} />
              Continue with Google
            </button>
          </form>
        )}

      </motion.div>
    </div>
  );
};

export default Login;
