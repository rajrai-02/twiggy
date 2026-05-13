import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SecurityIcon from '@mui/icons-material/Security';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useGetMeQuery, useUpdateProfileMutation } from '../../store/slices/authApiSlice';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { data: userProfile, isLoading: isFetching, refetch } = useGetMeQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressText, setAddressText] = useState('');
  const [coords, setCoords] = useState(null);
  
  // Role specific state
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [vehicleType, setVehicleType] = useState('Bike');
  const [licensePlate, setLicensePlate] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('Any');

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Autocomplete
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.profile?.name || '');
      setPhone(userProfile.profile?.phone || '');
      if (userProfile.address_book && userProfile.address_book.length > 0) {
        setAddressText(userProfile.address_book[0].address_text || '');
        setCoords(userProfile.address_book[0].coords);
      }
      
      setBusinessName(userProfile.profile?.businessName || '');
      setDescription(userProfile.profile?.description || '');
      setVehicleType(userProfile.profile?.vehicleType || 'Bike');
      setLicensePlate(userProfile.profile?.licensePlate || '');
      setDietaryPreferences(userProfile.profile?.dietaryPreferences || 'Any');

      setIsEditing(false);
      setShowPasswordChange(false);
      setCurrentPassword('');
      setNewPassword('');
      setSuccessMsg('');
      setFormError('');
    }
  }, [userProfile]);

  const handleAddressTyping = (text) => {
    setAddressText(text);
    setCoords(null);
    setFormError('');
    setSuccessMsg('');
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    if (text.trim().length > 3) {
      typingTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5`);
          const data = await res.json();
          setSuggestions(data || []);
          setShowSuggestions(true);
        } catch (e) {
          console.error("Autocomplete failed:", e);
        }
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setAddressText(suggestion.display_name);
    setCoords({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
    setShowSuggestions(false);
  };

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
        await reverseGeocode(lat, lng);
        setIsLocating(false);
      },
      (error) => {
        setLocationError('Unable to retrieve your location.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!name.trim()) {
      setFormError('Name is required.');
      return;
    }

    if (showPasswordChange) {
      if (!currentPassword || !newPassword) {
        setFormError('Please fill both password fields to change your password.');
        return;
      }
      if (newPassword.length < 6) {
        setFormError('New password must be at least 6 characters long.');
        return;
      }
    }

    let finalCoords = coords;
    if (addressText && !finalCoords) {
      finalCoords = await geocodeAddress(addressText);
      if (!finalCoords) {
        setFormError('Could not find exact coordinates for the address. Please use suggestions.');
        return;
      }
      setCoords(finalCoords);
    }

    try {
      const payload = {
        name, phone,
        address_text: addressText,
        lat: finalCoords?.lat,
        lng: finalCoords?.lng,
      };

      if (userProfile?.role === 'provider') {
        payload.businessName = businessName;
        payload.description = description;
      } else if (userProfile?.role === 'delivery') {
        payload.vehicleType = vehicleType;
        payload.licensePlate = licensePlate;
      } else if (userProfile?.role === 'consumer') {
        payload.dietaryPreferences = dietaryPreferences;
      }

      if (showPasswordChange && currentPassword && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      await updateProfile(payload).unwrap();

      setSuccessMsg('Profile updated successfully!');
      refetch();
      
      setTimeout(() => {
        setIsEditing(false);
        setSuccessMsg('');
        setShowPasswordChange(false);
        setCurrentPassword('');
        setNewPassword('');
      }, 1000);

    } catch (err) {
      setFormError(err?.data?.message || 'Failed to update profile.');
    }
  };

  const role = userProfile?.role || 'user';
  const hasPassword = !!userProfile?.auth?.password;
  const initials = (userProfile?.profile?.name || userProfile?.auth?.email || 'U')
    .split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <motion.div 
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.header}>
            <h2>{isEditing ? 'Edit Profile' : 'Account Details'}</h2>
          </div>

          <div className={styles.body}>
            {isFetching ? (
              <div className={styles.loadingState}>Loading profile...</div>
            ) : !isEditing ? (
              // ==============================
              // VIEW MODE
              // ==============================
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className={styles.profileHero}>
                  <div className={styles.avatarLarge}>{initials}</div>
                  <h3>{userProfile?.profile?.name}</h3>
                  <span className={styles.roleBadge}>{role}</span>
                </div>

                <div className={styles.infoSection}>
                  <div className={styles.infoRow}>
                    <span>Email</span>
                    <p>{userProfile?.auth?.email}</p>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Phone</span>
                    <p>{userProfile?.profile?.phone || 'Not provided'}</p>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Address</span>
                    <p>{userProfile?.address_book?.[0]?.address_text || 'Not provided'}</p>
                  </div>

                  {/* Role Specific Info */}
                  {role === 'provider' && (
                    <>
                      <div className={styles.divider} />
                      <div className={styles.infoRow}>
                        <span><BusinessCenterIcon sx={{ fontSize: 16 }} /> Business Name</span>
                        <p>{userProfile?.profile?.businessName || 'Not set'}</p>
                      </div>
                      <div className={styles.infoRow}>
                        <span>About</span>
                        <p>{userProfile?.profile?.description || 'No description provided'}</p>
                      </div>
                    </>
                  )}

                  {role === 'delivery' && (
                    <>
                      <div className={styles.divider} />
                      <div className={styles.infoRow}>
                        <span><TwoWheelerIcon sx={{ fontSize: 16 }} /> Vehicle</span>
                        <p>{userProfile?.profile?.vehicleType || 'Not set'} ({userProfile?.profile?.licensePlate || 'No plate'})</p>
                      </div>
                    </>
                  )}

                  {role === 'consumer' && (
                    <>
                      <div className={styles.divider} />
                      <div className={styles.infoRow}>
                        <span><RestaurantIcon sx={{ fontSize: 16 }} /> Dietary Pref.</span>
                        <p>{userProfile?.profile?.dietaryPreferences || 'Any'}</p>
                      </div>
                    </>
                  )}
                </div>

                <button className={styles.btnPrimary} onClick={() => setIsEditing(true)}>
                  <EditIcon sx={{ fontSize: 18 }} /> Edit Profile
                </button>
              </motion.div>
            ) : (
              // ==============================
              // EDIT MODE
              // ==============================
              <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <p className={styles.helperText}>Update your personal and role-specific details.</p>
                
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input type="text" className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input type="tel" className={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.locationAction}>
                    <label>Primary Address</label>
                    <button type="button" className={styles.btnLocation} onClick={handleGetLocation} disabled={isLocating}>
                      <LocationOnIcon sx={{ fontSize: 16 }} /> {isLocating ? 'Locating...' : 'Get Current Location'}
                    </button>
                  </div>
                  
                  <div className={styles.inputWrapper}>
                    <input 
                      type="text" className={styles.input} value={addressText}
                      onChange={(e) => handleAddressTyping(e.target.value)}
                      onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                    />
                    <AnimatePresence>
                      {showSuggestions && suggestions.length > 0 && (
                        <motion.div className={styles.suggestionsDropdown} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                          {suggestions.map((s, idx) => (
                            <div key={s.place_id || idx} className={styles.suggestionItem} onClick={() => handleSelectSuggestion(s)}>
                              {s.display_name}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {locationError && <p className={styles.errorText}>{locationError}</p>}
                </div>

                {/* ROLE SPECIFIC INPUTS */}
                {role === 'provider' && (
                  <div className={styles.roleSection}>
                    <p className={styles.roleTitle}><BusinessCenterIcon sx={{ fontSize: 16 }} /> Provider Details</p>
                    <div className={styles.formGroup}>
                      <label>Business / Tiffin Name</label>
                      <input type="text" className={styles.input} value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Mama's Kitchen" />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Description</label>
                      <textarea className={styles.input} rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us about your food..." />
                    </div>
                  </div>
                )}

                {role === 'delivery' && (
                  <div className={styles.roleSection}>
                    <p className={styles.roleTitle}><TwoWheelerIcon sx={{ fontSize: 16 }} /> Vehicle Details</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className={styles.formGroup}>
                        <label>Vehicle Type</label>
                        <select className={styles.select} value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                          <option value="Bike">Bike</option>
                          <option value="Scooter">Scooter</option>
                          <option value="Bicycle">Bicycle</option>
                          <option value="Car">Car</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>License Plate</label>
                        <input type="text" className={styles.input} value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {role === 'consumer' && (
                  <div className={styles.roleSection}>
                    <p className={styles.roleTitle}><RestaurantIcon sx={{ fontSize: 16 }} /> Preferences</p>
                    <div className={styles.formGroup}>
                      <label>Dietary Preference</label>
                      <select className={styles.select} value={dietaryPreferences} onChange={(e) => setDietaryPreferences(e.target.value)}>
                        <option value="Any">Any</option>
                        <option value="Veg">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Non-Veg">Non-Vegetarian</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* SECURITY SECTION */}
                {hasPassword && (
                  <div className={styles.roleSection}>
                    <div className={styles.securityToggle} onClick={() => setShowPasswordChange(!showPasswordChange)}>
                      <p className={styles.roleTitle} style={{ margin: 0 }}><SecurityIcon sx={{ fontSize: 16 }} /> Change Password</p>
                      <span style={{ color: '#F97316', fontSize: '0.85rem' }}>{showPasswordChange ? 'Cancel' : 'Update'}</span>
                    </div>
                    
                    <AnimatePresence>
                      {showPasswordChange && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                          <div style={{ marginTop: 16 }}>
                            <div className={styles.formGroup}>
                              <label>Current Password</label>
                              <input type="password" className={styles.input} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                            </div>
                            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                              <label>New Password</label>
                              <input type="password" className={styles.input} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {formError && <p className={styles.errorText} style={{ textAlign: 'center' }}>{formError}</p>}
                {successMsg && <p className={styles.successText} style={{ justifyContent: 'center' }}><CheckCircleOutlinedIcon sx={{ fontSize: 18 }} /> {successMsg}</p>}

                <div className={styles.actionRow}>
                  <button type="button" className={styles.btnSecondary} onClick={() => setIsEditing(false)} disabled={isUpdating}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnPrimary} disabled={isUpdating || isLocating}>
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
