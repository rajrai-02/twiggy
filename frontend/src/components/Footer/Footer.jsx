import React from 'react';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.top}>
      <div className={styles.brand}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RestaurantMenuIcon sx={{ color: '#F97316', fontSize: 22 }} />
          <span className={styles.logoText}>Twiggy<span className={styles.logoAccent}>.</span></span>
        </div>
        <p>Authentic home-cooked tiffins from local chefs, delivered fresh to your door every day.</p>
      </div>

      <div className={styles.col}>
        <h4>Company</h4>
        <a>About Us</a>
        <a>Careers</a>
        <a>Blog</a>
        <a>Press</a>
      </div>

      <div className={styles.col}>
        <h4>For Partners</h4>
        <a>Become a Chef</a>
        <a>Delivery Partner</a>
        <a>Partner Portal</a>
      </div>

      <div className={styles.col}>
        <h4>Support</h4>
        <a>Help Centre</a>
        <a>Contact Us</a>
        <a>Privacy Policy</a>
        <a>Terms of Service</a>
      </div>
    </div>

    <div className={styles.bottom}>
      <p>© {new Date().getFullYear()} Twiggy Technologies Pvt. Ltd. All rights reserved.</p>
      <div className={styles.badge}>
        <RestaurantMenuIcon sx={{ fontSize: 14 }} />
        Made with ❤️ for home food lovers
      </div>
    </div>
  </footer>
);

export default Footer;
