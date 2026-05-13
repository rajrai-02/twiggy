import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login/Login';
import ConsumerDashboard from './pages/ConsumerDashboard/ConsumerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProviderDashboard from './pages/ProviderDashboard/ProviderDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard/DeliveryDashboard';
import MenuPlanner from './pages/ProviderDashboard/MenuPlanner';
import CompleteProfile from './pages/CompleteProfile/CompleteProfile';
import ProfilePage from './pages/ProfilePage/ProfilePage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* Profile Completion */}
      <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />

      {/* Shared Dashboard Routes */}
      <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Consumer Dashboard */}
      <Route
        path="/dashboard/consumer"
        element={
          <ProtectedRoute requiredRole="consumer">
            <ConsumerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Provider & Delivery */}
      <Route path="/dashboard/provider" element={<ProtectedRoute requiredRole="provider"><ProviderDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/provider/menu" element={<ProtectedRoute requiredRole="provider"><MenuPlanner /></ProtectedRoute>} />
      <Route path="/dashboard/delivery" element={<ProtectedRoute requiredRole="delivery"><DeliveryDashboard /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
