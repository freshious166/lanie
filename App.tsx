
import React, { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import GarageView from './views/GarageView';
import ExploreView from './views/ExploreView';
import EmergencyView from './views/EmergencyView';
import HistoryView from './views/HistoryView';
import WorkshopDetailsView from './views/WorkshopDetailsView';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { name: 'Garage', icon: 'directions_car', path: '/' },
    { name: 'Explore', icon: 'explore', path: '/explore' },
    { name: 'SOS', icon: 'sos', path: '/emergency' },
    { name: 'History', icon: 'history', path: '/history' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 flex justify-around items-center pt-3 pb-8 px-2 z-50">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
        return (
          <button
            key={tab.name}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-primary' : 'text-slate-400 dark:text-[#92a9c9]'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
              {tab.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-tight">
              {tab.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="relative flex min-h-screen w-full max-w-md mx-auto flex-col bg-background-light dark:bg-background-dark overflow-x-hidden shadow-2xl">
        <Routes>
          <Route path="/" element={<GarageView />} />
          <Route path="/explore" element={<ExploreView />} />
          <Route path="/workshop/:id" element={<WorkshopDetailsView />} />
          <Route path="/emergency" element={<EmergencyView />} />
          <Route path="/history" element={<HistoryView />} />
        </Routes>
        <Navigation />
      </div>
    </HashRouter>
  );
};

export default App;
