import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LoginView from './views/LoginView';
import MapView from './views/MapView';
import FleetRosterView from './views/FleetRosterView';
import PartnerVerificationView from './views/PartnerVerificationView';
import BillingPayoutsView from './views/BillingPayoutsView';
import JobDisputesView from './views/JobDisputesView';
import BiDashboardView from './views/BiDashboardView';
import HseComplianceView from './views/HseComplianceView';
import ShipmentTrackingView from './views/ShipmentTrackingView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
      <Routes>
        <Route path="/" element={<LoginView />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<MapView />} />
          <Route path="/roster" element={<FleetRosterView />} />
          <Route path="/verification" element={<PartnerVerificationView />} />
          <Route path="/billing" element={<BillingPayoutsView />} />
          <Route path="/disputes" element={<JobDisputesView />} />
          <Route path="/supply-chain" element={<ShipmentTrackingView />} />
          <Route path="/bi-dashboard" element={<BiDashboardView />} />
          <Route path="/hse" element={<HseComplianceView />} />
          
          <Route path="/maintenance" element={<div className="p-4">Maintenance Module (Phase 2 marketplace flow for customers)</div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
    </QueryClientProvider>
  );
};

export default App;
