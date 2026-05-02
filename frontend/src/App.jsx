import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages (We will create these soon)
import LandingPage from './pages/LandingPage';
// import Login from './pages/Login';
// import ConsumerDashboard from './pages/ConsumerDashboard';
// import ProviderDashboard from './pages/ProviderDashboard';
// import DeliveryDashboard from './pages/DeliveryDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* 
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard/consumer" element={<ConsumerDashboard />} />
      <Route path="/dashboard/provider" element={<ProviderDashboard />} />
      <Route path="/dashboard/delivery" element={<DeliveryDashboard />} />
      */}
    </Routes>
  );
}

export default App;
