import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axiosClient from '../../api/axiosClient';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import styles from './ConsumerDashboard.module.css';

const NAV_ITEMS = [
  { label: 'Overview',      path: '/dashboard/consumer',              icon: <HomeIcon sx={{ fontSize: 18 }} /> },
  { label: 'My Orders',     path: '/dashboard/consumer/orders',       icon: <ReceiptLongIcon sx={{ fontSize: 18 }} /> },
  { label: 'Subscriptions', path: '/dashboard/consumer/subscription', icon: <SubscriptionsIcon sx={{ fontSize: 18 }} /> },
  { label: 'Track Delivery',path: '/dashboard/consumer/track',        icon: <LocalShippingIcon sx={{ fontSize: 18 }} /> },
];

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
};

const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const firstName = (user.profile?.name || 'there').split(' ')[0];

  const [orders, setOrders] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [skipping, setSkipping] = useState(false);
  const [skipError, setSkipError] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const { data } = await axiosClient.get('/orders');
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err.response?.data?.message || err.message);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  const fetchSubscription = useCallback(async () => {
    setLoadingSubscription(true);
    try {
      const { data } = await axiosClient.get('/subscriptions/my');
      setSubscription(data.subscription || null);
    } catch (err) {
      // 404 means no active subscription — not an error worth logging loudly
      if (err.response?.status !== 404) {
        console.error('Failed to fetch subscription:', err.response?.data?.message || err.message);
      }
    } finally {
      setLoadingSubscription(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchSubscription();
  }, [fetchOrders, fetchSubscription]);

  const handleSkip = async () => {
    setSkipping(true);
    setSkipError('');
    try {
      await axiosClient.patch(`/orders/skip/${today}`);
      await fetchOrders(); // Refresh the orders list
    } catch (err) {
      setSkipError(err.response?.data?.message || 'Could not skip today\'s tiffin. Please try again.');
    } finally {
      setSkipping(false);
    }
  };

  // Derived data
  const todayOrder = orders.find(o => o.deliveryDate?.split('T')[0] === today);
  const upcomingOrders = orders.filter(o => o.deliveryDate?.split('T')[0] > today).slice(0, 5);
  const totalDelivered = orders.filter(o => o.status === 'delivered').length;
  const totalSkipped = orders.filter(o => o.status === 'skipped').length;

  const getStatusClass = (status) => {
    if (status === 'delivered') return styles.statusDelivered;
    if (status === 'skipped') return styles.statusSkipped;
    return styles.statusPending;
  };

  const SkeletonLine = ({ w = '100%', h = 16 }) => (
    <div className={styles.skeleton} style={{ width: w, height: h, marginBottom: 8 }} />
  );

  return (
    <DashboardLayout navItems={NAV_ITEMS}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className={styles.header}>
          <div className={styles.greeting}>
            <h1>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {firstName} 👋</h1>
            <p>Here's your tiffin overview for today.</p>
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
          { label: 'Total Orders', value: orders.length, icon: <ReceiptLongIcon sx={{ fontSize: 20, color: '#F97316' }} />, bg: 'rgba(249,115,22,0.12)' },
          { label: 'Delivered',    value: totalDelivered, icon: <CheckCircleIcon sx={{ fontSize: 20, color: '#22C55E' }} />, bg: 'rgba(34,197,94,0.12)' },
          { label: 'Skipped',      value: totalSkipped, icon: <PauseCircleIcon sx={{ fontSize: 20, color: '#FBBF24' }} />, bg: 'rgba(251,191,36,0.12)' },
          { label: 'Upcoming',     value: upcomingOrders.length, icon: <CalendarTodayIcon sx={{ fontSize: 20, color: '#818CF8' }} />, bg: 'rgba(129,140,248,0.12)' },
        ].map((s, i) => (
          <div className={styles.statCard} key={i}>
            <div className={styles.statIcon} style={{ background: s.bg }}>{s.icon}</div>
            <div className={styles.statText}>
              <div className={styles.statValue}>{loadingOrders ? '—' : s.value}</div>
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
          {/* Today's Tiffin */}
          <p className={styles.sectionHeading}>Today's Tiffin</p>
          <div className={styles.todayCard}>
            {loadingOrders ? (
              <>
                <SkeletonLine w="40%" h={12} />
                <SkeletonLine w="60%" h={22} />
                <SkeletonLine w="80%" h={16} />
              </>
            ) : !todayOrder ? (
              <div className={styles.emptyState}>No delivery scheduled for today.</div>
            ) : todayOrder.status === 'skipped' ? (
              <>
                <div className={styles.skippedBadge}>✗ Skipped</div>
                <p style={{ color: '#78716C', fontSize: '0.9rem', margin: 0 }}>
                  You've skipped today's tiffin. Your next delivery is tomorrow.
                </p>
              </>
            ) : (
              <>
                <div className={styles.todayLabel}>Scheduled Delivery</div>
                <div className={styles.todayTitle}>
                  {todayOrder.provider?.businessName || 'Home Chef'} — Daily Tiffin
                </div>
                {todayOrder.menuItems?.length > 0 && (
                  <div className={styles.menuItemsRow}>
                    {todayOrder.menuItems.map((item, i) => (
                      <span key={i} className={styles.menuChip}>{item}</span>
                    ))}
                  </div>
                )}
                {skipError && <p style={{ color: '#EF4444', fontSize: '0.82rem', marginBottom: 12 }}>{skipError}</p>}
                <div className={styles.todayActions}>
                  <button className={styles.btnSkip} onClick={handleSkip} disabled={skipping}>
                    {skipping ? 'Skipping...' : 'Skip Today'}
                  </button>
                  <button className={styles.btnTrack} onClick={() => navigate('/dashboard/consumer/track')}>
                    <LocalShippingIcon sx={{ fontSize: 16, mr: 0.5 }} /> Track Order
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Upcoming Orders */}
          <p className={styles.sectionHeading}>Upcoming Deliveries</p>
          {loadingOrders ? (
            [1, 2, 3].map(i => <SkeletonLine key={i} h={52} />)
          ) : upcomingOrders.length === 0 ? (
            <div className={styles.emptyState}>No upcoming deliveries. Subscribe to get started!</div>
          ) : (
            <div className={styles.orderList}>
              {upcomingOrders.map((order) => (
                <div className={styles.orderRow} key={order._id}>
                  <div className={styles.orderDate}>{formatDate(order.deliveryDate)}</div>
                  <div className={styles.orderProvider}>{order.provider?.businessName || 'Home Chef'}</div>
                  <span className={`${styles.statusChip} ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>

          {/* Active Subscription */}
          <div className={styles.subCard}>
            <div className={styles.subHeader}>
              <p className={styles.sectionHeading} style={{ margin: 0 }}>My Subscription</p>
              {subscription && <span className={styles.activeDot}>Active</span>}
            </div>

            {loadingSubscription ? (
              <><SkeletonLine w="70%" h={18} /><SkeletonLine w="50%" h={14} /><SkeletonLine h={14} /><SkeletonLine h={14} /></>
            ) : !subscription ? (
              <div className={styles.emptyState} style={{ padding: '20px 0' }}>
                No active subscription.
                <br />
                <button className={styles.btnTrack} style={{ marginTop: 14, display: 'inline-block' }}
                  onClick={() => navigate('/login')}>
                  Browse Plans
                </button>
              </div>
            ) : (
              <>
                <div className={styles.subProviderName}>{subscription.provider?.businessName || 'Tiffin Provider'}</div>
                <div className={styles.subPlan}>{subscription.plan?.name || 'Daily Plan'}</div>
                <div className={styles.subMeta}>
                  {[
                    { label: 'Meals / Day', value: subscription.plan?.mealsPerDay || 1 },
                    { label: 'Delivery Days', value: (subscription.plan?.daysPerWeek || 5) + ' days/week' },
                    { label: 'Renews On', value: subscription.nextRenewal ? formatDate(subscription.nextRenewal) : '—' },
                    { label: 'Price', value: `₹${subscription.plan?.price || '—'}/month` },
                  ].map(r => (
                    <div className={styles.subMetaRow} key={r.label}>
                      <span className={styles.subMetaLabel}>{r.label}</span>
                      <span className={styles.subMetaValue}>{r.value}</span>
                    </div>
                  ))}
                </div>
                <button className={styles.btnPause}>Pause Subscription</button>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className={styles.subCard}>
            <p className={styles.sectionHeading} style={{ marginBottom: 14 }}>Quick Actions</p>
            {[
              { label: 'View All Orders', icon: <ReceiptLongIcon sx={{ fontSize: 16 }} />, path: '/dashboard/consumer/orders' },
              { label: 'Change Subscription', icon: <SubscriptionsIcon sx={{ fontSize: 16 }} />, path: '/dashboard/consumer/subscription' },
              { label: 'Track Live Delivery', icon: <LocalShippingIcon sx={{ fontSize: 16 }} />, path: '/dashboard/consumer/track' },
            ].map(a => (
              <button key={a.label}
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, color: '#A8A29E', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', marginBottom: 8, transition: 'all 0.18s ease' }}
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

export default ConsumerDashboard;
