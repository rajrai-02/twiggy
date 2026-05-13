import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';

import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import { useGetProviderDashboardStatsQuery, useGetTodayDeliveriesQuery } from '../../store/slices/providerApiSlice';
import styles from './ProviderDashboard.module.css';

const SkeletonLine = ({ w = '100%', h = 16 }) => (
  <div className={styles.skeleton} style={{ width: w, height: h, marginBottom: 8 }} />
);

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const businessName = user.profile?.businessName || user.profile?.name || 'Chef';

  const { data: stats, isLoading: isStatsLoading } = useGetProviderDashboardStatsQuery();
  const { data: deliveries, isLoading: isDeliveriesLoading } = useGetTodayDeliveriesQuery();

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className={styles.header}>
          <div className={styles.greeting}>
            <h1>Provider Hub, {businessName} 👨‍🍳</h1>
            <p>Manage your daily cooking batch and deliveries.</p>
          </div>
          <div className={styles.headerDate}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div className={styles.statsRow}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        {[
          { label: 'Active Subs', value: stats?.activeSubscribers || 0, icon: <PeopleIcon sx={{ fontSize: 24, color: '#3B82F6' }} />, bg: 'rgba(59,130,246,0.12)', loading: isStatsLoading },
          { label: "Today's Meals", value: stats?.mealsToPrepare || 0, icon: <SoupKitchenIcon sx={{ fontSize: 24, color: '#F97316' }} />, bg: 'rgba(249,115,22,0.12)', loading: isStatsLoading },
          { label: 'Skipped Today', value: stats?.skippedToday || 0, icon: <AssignmentLateIcon sx={{ fontSize: 24, color: '#EF4444' }} />, bg: 'rgba(239,68,68,0.12)', loading: isStatsLoading },
          { label: 'Est. Revenue', value: `₹${stats?.revenue || 0}`, icon: <AttachMoneyIcon sx={{ fontSize: 24, color: '#10B981' }} />, bg: 'rgba(16,185,129,0.12)', loading: isStatsLoading },
        ].map((s, i) => (
          <div className={styles.statCard} key={i}>
            <div className={styles.statIcon} style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <div className={styles.statValue}>{s.loading ? <SkeletonLine w="40px" h={24} /> : s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Main Grid */}
      <motion.div className={styles.contentGrid}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
        
        {/* Left Column */}
        <div>
          <p className={styles.sectionHeading}>Today's Delivery Batch</p>
          <div className={styles.batchList}>
            {isDeliveriesLoading ? (
              [1, 2, 3].map(i => <SkeletonLine key={i} h={70} />)
            ) : deliveries?.length === 0 ? (
              <div className={styles.emptyState}>No deliveries scheduled for today.</div>
            ) : (
              deliveries?.map((order) => (
                <div className={styles.batchCard} key={order._id}>
                  <div className={styles.batchInfo}>
                    <h4>{order.user_id?.profile?.name || 'Customer'}</h4>
                    <p>{order.user_id?.profile?.address || 'Address not provided'}</p>
                  </div>
                  <span className={`${styles.statusChip} ${styles.statusPending}`}>
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          <div className={styles.subCard}>
            <p className={styles.sectionHeading} style={{ marginBottom: 14 }}>Quick Actions</p>
            {[
              { label: 'Update Today\'s Menu', icon: <RestaurantMenuIcon sx={{ fontSize: 16 }} />, path: '/dashboard/provider/menu' },
              { label: 'View Subscribers', icon: <PeopleIcon sx={{ fontSize: 16 }} />, path: '/dashboard/provider/subscribers' },
              { label: 'Assign Delivery Partners', icon: <LocalShippingIcon sx={{ fontSize: 16 }} />, path: '/dashboard/provider/deliveries' },
            ].map(a => (
              <button key={a.label}
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, color: '#A8A29E', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', marginBottom: 8, transition: 'all 0.18s ease' }}
                onClick={() => navigate(a.path)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)'; e.currentTarget.style.color = '#FEF3C7'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#A8A29E'; }}
              >
                {a.icon} {a.label}
              </button>
            ))}
          </div>
        </div>

      </motion.div>
    </DashboardLayout>
  );
};

export default ProviderDashboard;
