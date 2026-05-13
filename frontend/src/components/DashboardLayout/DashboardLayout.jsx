import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import axiosClient from '../../api/axiosClient';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MapIcon from '@mui/icons-material/Map';
import HistoryIcon from '@mui/icons-material/History';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children }) => {
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

  const getNavItems = () => {
    const baseItems = [];
    if (user.role === 'provider') {
      baseItems.push(
        { label: 'Overview', path: '/dashboard/provider', icon: <HomeIcon sx={{ fontSize: 18 }} /> },
        { label: 'Subscribers', path: '/dashboard/provider/subscribers', icon: <PeopleIcon sx={{ fontSize: 18 }} /> },
        { label: 'Menu Planner', path: '/dashboard/provider/menu', icon: <RestaurantMenuIcon sx={{ fontSize: 18 }} /> },
        { label: 'Earnings', path: '/dashboard/provider/earnings', icon: <AttachMoneyIcon sx={{ fontSize: 18 }} /> }
      );
    } else if (user.role === 'delivery') {
      baseItems.push(
        { label: 'Overview', path: '/dashboard/delivery', icon: <DirectionsBikeIcon sx={{ fontSize: 18 }} /> },
        { label: 'Active Run', path: '/dashboard/delivery/run', icon: <MapIcon sx={{ fontSize: 18 }} /> },
        { label: 'History', path: '/dashboard/delivery/history', icon: <HistoryIcon sx={{ fontSize: 18 }} /> }
      );
    } else {
      baseItems.push(
        { label: 'Overview', path: '/dashboard/consumer', icon: <HomeIcon sx={{ fontSize: 18 }} /> },
        { label: 'My Orders', path: '/dashboard/consumer/orders', icon: <ReceiptLongIcon sx={{ fontSize: 18 }} /> },
        { label: 'Subscriptions', path: '/dashboard/consumer/subscription', icon: <SubscriptionsIcon sx={{ fontSize: 18 }} /> },
        { label: 'Track Delivery', path: '/dashboard/consumer/track', icon: <LocalShippingIcon sx={{ fontSize: 18 }} /> }
      );
    }
    
    // Add common Account item
    baseItems.push({ label: 'Account', path: '/dashboard/profile', icon: <PersonIcon sx={{ fontSize: 18 }} /> });
    
    return baseItems;
  };

  const navItems = getNavItems();

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
