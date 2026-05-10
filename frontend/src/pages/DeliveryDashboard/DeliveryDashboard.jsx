import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import MapIcon from '@mui/icons-material/Map';
import HistoryIcon from '@mui/icons-material/History';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StorefrontIcon from '@mui/icons-material/Storefront';

import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import { useGetDeliveryDashboardStatsQuery, useGetTodayRunsQuery } from '../../store/slices/deliveryApiSlice';
import styles from './DeliveryDashboard.module.css';

const NAV_ITEMS = [
  { label: 'Overview',  path: '/dashboard/delivery',          icon: <DirectionsBikeIcon sx={{ fontSize: 18 }} /> },
  { label: 'Active Run',path: '/dashboard/delivery/run',      icon: <MapIcon sx={{ fontSize: 18 }} /> },
  { label: 'History',   path: '/dashboard/delivery/history',  icon: <HistoryIcon sx={{ fontSize: 18 }} /> },
];

const SkeletonLine = ({ w = '100%', h = 16 }) => (
  <div className={styles.skeleton} style={{ width: w, height: h, marginBottom: 8 }} />
);

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const firstName = (user.profile?.name || 'Partner').split(' ')[0];

  const { data: stats, isLoading: isStatsLoading } = useGetDeliveryDashboardStatsQuery();
  const { data: runs, isLoading: isRunsLoading } = useGetTodayRunsQuery();

  return (
    <DashboardLayout navItems={NAV_ITEMS}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className={styles.header}>
          <div className={styles.greeting}>
            <h1>On the Move, {firstName} 🚲</h1>
            <p>Your delivery run overview for today.</p>
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
          { label: 'Total Stops', value: stats?.deliveriesToday || 0, icon: <MapIcon sx={{ fontSize: 24, color: '#F97316' }} />, bg: 'rgba(249,115,22,0.12)', loading: isStatsLoading },
          { label: 'Completed', value: stats?.completed || 0, icon: <TaskAltIcon sx={{ fontSize: 24, color: '#22C55E' }} />, bg: 'rgba(34,197,94,0.12)', loading: isStatsLoading },
          { label: 'Pending', value: stats?.pending || 0, icon: <DirectionsBikeIcon sx={{ fontSize: 24, color: '#3B82F6' }} />, bg: 'rgba(59,130,246,0.12)', loading: isStatsLoading },
          { label: 'Est. Distance', value: `${stats?.distanceKm || 0} km`, icon: <LocationOnIcon sx={{ fontSize: 24, color: '#8B5CF6' }} />, bg: 'rgba(139,92,246,0.12)', loading: isStatsLoading },
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
          <p className={styles.sectionHeading}>Current Delivery Route</p>
          {isRunsLoading ? (
            <div className={styles.routeCard}>
               <SkeletonLine h={40} />
               <SkeletonLine h={40} />
            </div>
          ) : runs?.length === 0 ? (
            <div className={styles.emptyState}>No active runs assigned for today.</div>
          ) : (
            <div className={styles.routeCard}>
              <div className={styles.timeline}>
                {runs?.map((order, idx) => (
                  <React.Fragment key={order._id}>
                    {/* Pickup Step */}
                    <div className={styles.routeStep}>
                      <div className={`${styles.stepIcon} ${styles.pickup}`}><StorefrontIcon sx={{ fontSize: 14 }} /></div>
                      <div className={styles.stepContent}>
                        <h4>Pickup from {order.provider_id?.profile?.businessName || 'Provider'}</h4>
                        <p>{order.provider_id?.profile?.address}</p>
                      </div>
                    </div>
                    {/* Dropoff Step */}
                    <div className={styles.routeStep}>
                      <div className={styles.stepIcon}><LocationOnIcon sx={{ fontSize: 14 }} /></div>
                      <div className={styles.stepContent}>
                        <h4>Drop-off to {order.user_id?.profile?.name || 'Customer'}</h4>
                        <p>{order.user_id?.profile?.address}</p>
                        <p style={{ marginTop: 4, color: '#F97316' }}>{order.user_id?.profile?.phone}</p>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          <div className={styles.subCard}>
            <p className={styles.sectionHeading} style={{ marginBottom: 14 }}>Live Tracking</p>
            <div className={styles.liveMapPlaceholder}>
              <MapIcon sx={{ fontSize: 24, mr: 1 }} /> Live Map Integration
            </div>
            <button className={styles.btnPrimary} onClick={() => navigate('/dashboard/delivery/run')}>
              <DirectionsBikeIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'middle' }} />
              Start Current Run
            </button>
          </div>
        </div>

      </motion.div>
    </DashboardLayout>
  );
};

export default DeliveryDashboard;
