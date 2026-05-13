import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import { 
  useGetProviderMenuQuery, 
  useUpsertProviderMenuMutation, 
  useGetAiMenuSuggestionMutation 
} from '../../store/slices/providerApiSlice';
import styles from './MenuPlanner.module.css';

const SkeletonLine = ({ w = '100%', h = 16, mb = 8 }) => (
  <div className={styles.skeleton} style={{ width: w, height: h, marginBottom: mb }} />
);

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const MenuPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  // RTK Query Hooks
  const { data: menuData, isLoading: isMenuLoading, isFetching: isMenuFetching } = useGetProviderMenuQuery(selectedDate);
  const [upsertMenu, { isLoading: isSaving }] = useUpsertProviderMenuMutation();
  const [getAiSuggestion, { isLoading: isGenerating }] = useGetAiMenuSuggestionMutation();

  // Sync state with fetched menu
  useEffect(() => {
    if (menuData) {
      setItems(menuData.items || []);
      setIsAiGenerated(menuData.ai_generated || false);
    } else {
      setItems([]);
      setIsAiGenerated(false);
    }
  }, [menuData, selectedDate]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
      setIsAiGenerated(false); // Manual edits mean it's no longer purely AI
    }
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
    setIsAiGenerated(false);
  };

  const handleGenerateAi = async () => {
    try {
      const result = await getAiSuggestion().unwrap();
      if (result.suggestedItems && result.suggestedItems.length > 0) {
        setItems(result.suggestedItems);
        setIsAiGenerated(true);
      }
    } catch (err) {
      alert(err?.data?.message || 'Failed to generate AI menu. Please try again.');
    }
  };

  const handleSaveMenu = async () => {
    try {
      await upsertMenu({
        date: selectedDate,
        items,
        ai_generated: isAiGenerated
      }).unwrap();
      alert('Menu saved successfully!');
    } catch (err) {
      alert('Failed to save menu.');
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className={styles.header}>
          <div className={styles.greeting}>
            <h1>AI Menu Planner 🍽️</h1>
            <p>Plan your upcoming tiffin menus effortlessly.</p>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <motion.div className={styles.contentGrid}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
        
        {/* Left Column - Editor */}
        <div className={styles.menuCard}>
          <div className={styles.dateSelector}>
            <label style={{ color: '#FAFAF9', fontWeight: 500 }}>Select Date:</label>
            <input 
              type="date" 
              className={styles.dateInput} 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {isMenuFetching && !isGenerating ? (
            <div style={{ marginTop: 24 }}>
              {[1,2,3,4].map(i => <SkeletonLine key={i} h={50} mb={12} />)}
            </div>
          ) : (
            <>
              {isAiGenerated && (
                <div className={styles.aiBadge}>✨ AI Optimized Menu</div>
              )}
              
              <div className={styles.menuList}>
                <AnimatePresence>
                  {items.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.emptyState}>
                      No items planned for this date. Add manually or use AI to generate.
                    </motion.div>
                  ) : (
                    items.map((item, idx) => (
                      <motion.div 
                        key={`${item}-${idx}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={styles.menuItem}
                      >
                        {item}
                        <button className={styles.removeItemBtn} onClick={() => handleRemoveItem(idx)}>
                          <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              <form className={styles.addInputGroup} onSubmit={handleAddItem}>
                <input 
                  type="text" 
                  className={styles.addInput} 
                  placeholder="e.g. Paneer Butter Masala" 
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                />
                <button type="submit" className={styles.btnAdd} disabled={!newItem.trim()}>Add</button>
              </form>
            </>
          )}
        </div>

        {/* Right Column - Actions */}
        <div className={styles.rightCol}>
          <div className={styles.subCard}>
            <p className={styles.sectionHeading} style={{ marginBottom: 16 }}>Smart Actions</p>
            
            <button 
              className={styles.btnAi} 
              onClick={handleGenerateAi}
              disabled={isGenerating || isMenuFetching}
              style={{ marginBottom: 16 }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 18 }} />
              {isGenerating ? 'Generating...' : 'Auto-Generate with AI'}
            </button>

            <p style={{ fontSize: '0.8rem', color: '#A8A29E', marginBottom: 24, lineHeight: 1.4 }}>
              Our AI analyzes past orders to suggest a balanced, highly-rated 4-item menu tailored to your customers.
            </p>

            <button 
              className={styles.btnSave} 
              onClick={handleSaveMenu}
              disabled={isSaving || isMenuFetching || isGenerating}
            >
              {isSaving ? 'Saving...' : 'Save Menu'}
            </button>
          </div>
        </div>

      </motion.div>
    </DashboardLayout>
  );
};

export default MenuPlanner;
