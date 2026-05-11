import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useUpdateProfileMutation } from '../../store/slices/authApiSlice';
import styles from './CompleteProfile.module.css';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  
  const [phone, setPhone] = useState('');
  const [addressText, setAddressText] = useState('');
  const [coords, setCoords] = useState(null); // { lat, lng }
  
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [formError, setFormError] = useState('');

  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const typingTimeoutRef = useRef(null);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleAddressTyping = (text) => {
    setAddressText(text);
    setCoords(null);
    setFormError('');
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    if (text.trim().length > 3) {
      typingTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5`);
          const data = await res.json();
          setSuggestions(data || []);
          setShowSuggestions(true);
        } catch (e) {
          console.error("Autocomplete fetch failed:", e);
        }
      }, 500); // 500ms debounce
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setAddressText(suggestion.display_name);
    setCoords({ lat: parseFloat(suggestion.lat), lon: parseFloat(suggestion.lon) });
    setShowSuggestions(false);
  };

  // Reverse geocoding to turn lat/lng back into an address string
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        setAddressText(data.display_name);
      }
    } catch (e) {
      console.error("Reverse geocoding failed:", e);
    }
  };

  // Handle native Geolocation
  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError('');
    setFormError('');
    setShowSuggestions(false);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });
        
        // Auto-fill the address text field so the user can verify
        await reverseGeocode(lat, lng);
        
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation Error:", error);
        setLocationError('Unable to retrieve your location. Please ensure location permissions are granted.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Fallback Geocoding if they bypass the suggestion list
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (err) {
      console.error("Geocoding failed:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!phone.trim() || !addressText.trim()) {
      setFormError('Phone and Address are required.');
      return;
    }

    let finalCoords = coords;

    // If no coordinates yet (user typed without selecting suggestion or using button)
    if (!finalCoords) {
      finalCoords = await geocodeAddress(addressText);
      if (!finalCoords) {
        setFormError('Could not find exact coordinates. Please select an address from the dropdown suggestions or use the location button.');
        return;
      }
      setCoords(finalCoords);
    }

    try {
      const res = await updateProfile({
        phone,
        address_text: addressText,
        lat: finalCoords.lat || finalCoords.lon, // Handle both our internal format and OSM format
        lng: finalCoords.lng || finalCoords.lon
      }).unwrap();

      // Update session storage
      const updatedUser = { ...user, isProfileComplete: res.isProfileComplete };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));

      // Redirect to their dashboard
      navigate(`/dashboard/${user.role}`, { replace: true });

    } catch (err) {
      setFormError(err?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <motion.div 
          className={styles.card}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.header}>
            <h1>Complete Your Profile</h1>
            <p>We need a few more details to set up your account.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input 
                type="tel" 
                className={styles.input} 
                placeholder="e.g. +1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.locationAction}>
                <label>Full Address</label>
                <button 
                  type="button" 
                  className={styles.btnLocation} 
                  onClick={handleGetLocation}
                  disabled={isLocating}
                >
                  <LocationOnIcon sx={{ fontSize: 16 }} />
                  {isLocating ? 'Locating...' : 'Get Current Location'}
                </button>
              </div>
              
              <div className={styles.inputWrapper}>
                <input 
                  type="text" 
                  className={styles.input} 
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="e.g. 123 Main St, Apt 4B, City"
                  value={addressText}
                  onChange={(e) => handleAddressTyping(e.target.value)}
                  onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                  required
                />
                
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div 
                      className={styles.suggestionsDropdown}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {suggestions.map((s, idx) => (
                        <div 
                          key={s.place_id || idx} 
                          className={styles.suggestionItem}
                          onClick={() => handleSelectSuggestion(s)}
                        >
                          {s.display_name}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {locationError && <p className={styles.errorText}>{locationError}</p>}
              {coords && !locationError && (
                <p className={styles.successText}>
                  <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
                  Location coordinates captured!
                </p>
              )}
            </div>

            {formError && <p className={styles.errorText} style={{ marginBottom: 16, textAlign: 'center' }}>{formError}</p>}

            <button type="submit" className={styles.btnSubmit} disabled={isLoading || isLocating}>
              {isLoading ? 'Saving...' : 'Save & Continue'}
            </button>
          </form>
        </motion.div>
      </div>
      
      <div className={styles.imageSection}>
        <div className={styles.imageOverlay} />
      </div>
    </div>
  );
};

export default CompleteProfile;
