import React, { useState, useEffect } from 'react';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        <RestaurantMenuIcon sx={{ color: '#F97316', fontSize: 26 }} />
        <span className={styles.logoText}>
          Twiggy<span className={styles.logoAccent}>.</span>
        </span>
      </div>

      <div className={styles.navLinks}>
        <button className={styles.navLink}>For Providers</button>
        <button className={styles.navLink}>For Riders</button>
        <button className={styles.navLink} onClick={() => navigate('/login')}>Sign In</button>
        <button className={styles.navCta} onClick={() => navigate('/login')}>
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
