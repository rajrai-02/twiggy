import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import styles from './LandingPage.module.css';

// --- Mock data for providers section ---
const TOP_PROVIDERS = [
  { id: 1, name: "Anita's Home Kitchen", cuisine: 'North Indian', rating: 4.9, reviews: 842, delivery: '30–40 min', tag: 'Pure Veg', subscribers: '1.2k', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80' },
  { id: 2, name: "Meera's Tiffin Centre", cuisine: 'South Indian', rating: 4.8, reviews: 623, delivery: '25–35 min', tag: 'Healthy', subscribers: '980', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
  { id: 3, name: "Sharma Dabbawala", cuisine: 'Rajasthani', rating: 4.7, reviews: 511, delivery: '35–45 min', tag: 'Popular', subscribers: '750', img: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80' },
  { id: 4, name: "Priya's Rasoi", cuisine: 'Punjabi Homestyle', rating: 4.9, reviews: 1100, delivery: '20–30 min', tag: '🔥 Trending', subscribers: '2.1k', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80' },
];

const STEPS = [
  { icon: <PeopleIcon sx={{ fontSize: 28 }} />, title: 'Choose Your Chef', desc: 'Browse verified home chefs near you, filtered by cuisine and diet preferences.' },
  { icon: <AutoAwesomeIcon sx={{ fontSize: 28 }} />, title: 'AI Curates Your Menu', desc: 'Our AI learns your taste and auto-suggests a balanced daily tiffin menu.' },
  { icon: <LocalShippingIcon sx={{ fontSize: 28 }} />, title: 'Fresh Delivery Daily', desc: 'Hot, freshly made tiffin delivered at your door — skip or pause anytime.' },
];

const FadeIn = ({ children, delay = 0, direction = 'up' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const variants = {
    hidden: { opacity: 0, y: direction === 'up' ? 40 : 0, x: direction === 'left' ? -40 : direction === 'right' ? 40 : 0 },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ─── HERO ─── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroBgGreen} />

        <div className={styles.heroContent}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className={styles.heroBadge}>
              <AutoAwesomeIcon sx={{ fontSize: 14, color: '#F97316' }} />
              AI-Powered Tiffin Subscriptions
            </div>
            <h1 className={styles.heroTitle}>
              Homestyle Food,<br />
              <span className={styles.heroAccent}>Zero Compromise.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Twiggy connects you with top local home chefs. Get a fresh, healthy tiffin every day — curated by AI, made with love.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className={styles.heroCtas}>
            <button className={styles.btnPrimary} onClick={() => navigate('/login')}>
              Subscribe Now
            </button>
            <button className={styles.btnSecondary} onClick={() => navigate('/login')}>
              Explore Chefs
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
            className={styles.heroStats}>
            <div className={styles.stat}><span className={styles.statNum}>12k+</span><span className={styles.statLabel}>Happy Subscribers</span></div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><span className={styles.statNum}>350+</span><span className={styles.statLabel}>Home Chefs</span></div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><span className={styles.statNum}>4.9★</span><span className={styles.statLabel}>Avg Rating</span></div>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div className={styles.heroImageWrap}
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}>
          <div className={styles.heroImageGlow} />
          <motion.img
            src="/hero_tiffin.png"
            alt="Fresh Indian Tiffin"
            className={styles.heroImage}
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
          />
          <div className={styles.floatingBadge} style={{ top: '12%', left: '-8%' }}>
            <div className={styles.badgeIcon}><StarIcon sx={{ fontSize: 16, color: '#FBBF24' }} /></div>
            <div><div className={styles.badgeTitle}>Top Rated</div><div className={styles.badgeSub}>4.9 / 5 stars</div></div>
          </div>
          <div className={styles.floatingBadge} style={{ bottom: '18%', right: '-10%' }}>
            <div className={styles.badgeIcon} style={{ background: 'rgba(22,163,74,0.2)' }}><LocalShippingIcon sx={{ fontSize: 16, color: '#22C55E' }} /></div>
            <div><div className={styles.badgeTitle}>Live Tracking</div><div className={styles.badgeSub}>Real-time GPS</div></div>
          </div>
        </motion.div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className={styles.section}>
        <FadeIn>
          <div className={styles.sectionTag}>Simple as 1-2-3</div>
          <h2 className={styles.sectionTitle}>How Twiggy Works</h2>
        </FadeIn>
        <div className={styles.stepsGrid}>
          {STEPS.map((step, i) => (
            <FadeIn key={i} delay={i * 0.15} direction="up">
              <div className={styles.stepCard}>
                <div className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── TOP PROVIDERS ─── */}
      <section className={styles.section}>
        <FadeIn>
          <div className={styles.sectionTag}>Curated for You</div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Top-Rated Chefs Near You</h2>
            <button className={styles.seeAll} onClick={() => navigate('/login')}>See all chefs →</button>
          </div>
        </FadeIn>
        <div className={styles.providerGrid}>
          {TOP_PROVIDERS.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.1} direction="up">
              <div className={styles.providerCard} onClick={() => navigate('/login')}>
                <div className={styles.providerImgWrap}>
                  <img src={p.img} alt={p.name} className={styles.providerImg} />
                  <div className={styles.providerTag}>{p.tag}</div>
                </div>
                <div className={styles.providerBody}>
                  <div className={styles.providerTop}>
                    <div>
                      <div className={styles.providerName}>{p.name}</div>
                      <div className={styles.providerCuisine}>{p.cuisine}</div>
                    </div>
                    <div className={styles.ratingBadge}>
                      <StarIcon sx={{ fontSize: 12, color: '#FBBF24' }} />
                      {p.rating}
                    </div>
                  </div>
                  <div className={styles.providerMeta}>
                    <span><AccessTimeIcon sx={{ fontSize: 12 }} /> {p.delivery}</span>
                    <span><PeopleIcon sx={{ fontSize: 12 }} /> {p.subscribers} subscribers</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className={styles.ctaBanner}>
        <FadeIn>
          <h2 className={styles.ctaTitle}>Ready to eat better, every day?</h2>
          <p className={styles.ctaSubtitle}>Join thousands of happy subscribers. Cancel or pause anytime.</p>
          <button className={styles.btnPrimary} onClick={() => navigate('/login')}>Start Your Subscription</button>
        </FadeIn>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
