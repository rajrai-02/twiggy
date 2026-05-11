import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  // Handle native Geolocation
  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError('');
    setFormError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
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

  // Fallback Geocoding with OSM Nominatim
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
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

    // If user didn't click "Get Location", we MUST geocode the typed address
    if (!finalCoords) {
      finalCoords = await geocodeAddress(addressText);
      if (!finalCoords) {
        setFormError('Could not find coordinates for this address. Please try being more specific or use the Location button.');
        return;
      }
      setCoords(finalCoords);
    }

    try {
      const res = await updateProfile({
        phone,
        address_text: addressText,
        lat: finalCoords.lat,
        lng: finalCoords.lng
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
              <input 
                type="text" 
                className={styles.input} 
                placeholder="e.g. 123 Main St, Apt 4B, City"
                value={addressText}
                onChange={(e) => {
                  setAddressText(e.target.value);
                  setCoords(null); // Reset coords if they type a new address
                }}
                required
              />
              {locationError && <p className={styles.errorText}>{locationError}</p>}
              {coords && !locationError && (
                <p className={styles.successText}>
                  <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
                  Location coordinates captured!
                </p>
              )}
              {!coords && !locationError && (
                <p style={{ color: '#A8A29E', fontSize: '0.8rem', marginTop: 4 }}>
                  If you do not click the location button, we will attempt to find your coordinates automatically.
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
