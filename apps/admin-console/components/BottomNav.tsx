
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavProps {
  active: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ active }) => {
  const navigate = useNavigate();
  
  const items = [
    { id: 'discovery', label: 'Discover', icon: 'explore', path: '/discovery' },
    { id: 'garage', label: 'My Fleet', icon: 'directions_car', path: '/garage' },
    { id: 'history', label: 'History', icon: 'history', path: '/history' },
    { id: 'settings', label: 'Settings', icon: 'settings', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 flex items-center justify-around pb-6 px-6 h-24">
      {items.map((item) => (
        <div 
          key={item.id}
          onClick={() => navigate(item.path)} 
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors duration-200 ${active === item.id ? 'text-primary' : 'text-slate-400'}`}
        >
          <span className={`material-symbols-outlined ${active === item.id ? 'fill-1' : ''}`}>
            {item.icon}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
        </div>
      ))}
    </nav>
  );
};
