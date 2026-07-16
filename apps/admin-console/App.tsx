
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './screens/Login';
import { Signup } from './screens/Signup';
import { GarageGrid } from './screens/GarageGrid';
import { EmergencyPortal } from './screens/EmergencyPortal';
import { ServiceDiscovery } from './screens/ServiceDiscovery';
import { HistoryReport } from './screens/HistoryReport';
import { WorkshopProfile } from './screens/WorkshopProfile';
import { db } from './services/db';
import AdminTuningPanel from './views/AdminTuningPanel';
import TenantConfigPanel from './views/TenantConfigPanel';
import MarketplaceModeration from './views/MarketplaceModeration';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const user = db.getActiveUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/garage" element={
          <ProtectedRoute>
            <GarageGrid />
          </ProtectedRoute>
        } />
        
        <Route path="/emergency" element={
          <ProtectedRoute>
            <EmergencyPortal />
          </ProtectedRoute>
        } />
        
        <Route path="/discovery" element={
          <ProtectedRoute>
            <ServiceDiscovery />
          </ProtectedRoute>
        } />
        
        <Route path="/history" element={
          <ProtectedRoute>
            <HistoryReport />
          </ProtectedRoute>
        } />
        
        <Route path="/workshop" element={
          <ProtectedRoute>
            <WorkshopProfile />
          </ProtectedRoute>
        } />

        <Route path="/tuning" element={
          <ProtectedRoute>
            <AdminTuningPanel />
          </ProtectedRoute>
        } />

        <Route path="/tenant-config" element={
          <ProtectedRoute>
            <TenantConfigPanel />
          </ProtectedRoute>
        } />

        <Route path="/marketplace-moderation" element={
          <ProtectedRoute>
            <MarketplaceModeration />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/garage" replace />} />
        <Route path="*" element={<Navigate to="/garage" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
