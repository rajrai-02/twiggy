import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login/Login';
import ConsumerDashboard from './pages/ConsumerDashboard/ConsumerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProviderDashboard from './pages/ProviderDashboard/ProviderDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard/DeliveryDashboard';
import MenuPlanner from './pages/ProviderDashboard/MenuPlanner';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* Consumer — protected */}
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
