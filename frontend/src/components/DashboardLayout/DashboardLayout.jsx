import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import axiosClient from '../../api/axiosClient';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children, navItems }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const initials = (user.profile?.name || user.email || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (_) {}
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <RestaurantMenuIcon sx={{ color: '#F97316', fontSize: 22 }} />
          <span className={styles.logoText}>
            Twiggy<span className={styles.logoAccent}>.</span>
          </span>
        </div>

        <nav>
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.navItemActive : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userChip}>
            <div className={styles.userAvatar}>{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div className={styles.userName}>{user.profile?.name || 'User'}</div>
              <div className={styles.userRole}>{user.role || 'consumer'}</div>
            </div>
          </div>
          <button
            className={styles.navItem}
            style={{ marginTop: 8, color: '#EF4444' }}
            onClick={handleLogout}
          >
            <LogoutIcon sx={{ fontSize: 18 }} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
