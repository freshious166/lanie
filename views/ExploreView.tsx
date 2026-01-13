
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_WORKSHOPS } from '../constants';

const ExploreView: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Verified');

  return (
    <div className="relative flex flex-col h-screen overflow-hidden bg-background-dark">
      {/* Map Background Placeholder */}
      <div className="absolute inset-0 z-0">
        <div 
          className="h-full w-full bg-cover bg-center opacity-60" 
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCtAena5DYU4nKhe36psgmew2SfRIG65jIWL44aiwYYh-h_QOm4QRlRS7iY4YKGoDXUDhLMPxsfE_YsvFq9ZtPe0ysQ5guNpMLGrx9GuWdjhgRbD5Nnof0EsnUks9jetXodxlG5jDnpbjhSJHYy-L5A3qCQxICN0wLJcsE1hjykPCuSb3yjYdDOR7NJDQxBN2F8xiVhuooOxhBlOuBYl9_QDkJN0OBMnE52GIL0fU_shGCqvrh6E_VKOWZlKSN0IoaTbAUZQ9BiYjA")' }}
        >
          {/* Pins */}
          <div className="absolute top-1/2 left-1/3 flex flex-col items-center">
             <div className="bg-primary text-white p-2 rounded-full shadow-lg"><span className="material-symbols-outlined text-sm">handyman</span></div>
             <div className="w-1 h-2 bg-primary"></div>
          </div>
          <div className="absolute top-1/3 right-1/4 flex flex-col items-center">
             <div className="bg-primary text-white p-2 rounded-full shadow-lg"><span className="material-symbols-outlined text-sm">local_shipping</span></div>
             <div className="w-1 h-2 bg-primary"></div>
          </div>
          {/* User Location */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
             <div className="relative flex items-center justify-center">
                <div className="absolute animate-ping h-8 w-8 rounded-full bg-primary opacity-40"></div>
                <div className="h-4 w-4 rounded-full bg-primary border-2 border-white"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Search Header */}
      <div className="relative z-10 flex flex-col p-4 pt-12 gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <label className="flex items-center h-12 bg-background-dark/80 backdrop-blur-md rounded-xl border border-white/10 px-4 gap-2">
              <span className="material-symbols-outlined text-[#92a9c9]">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-white placeholder-[#92a9c9] w-full text-base font-normal" placeholder="Search mechanics..."/>
            </label>
          </div>
          <div className="bg-background-dark/80 backdrop-blur-md size-12 flex items-center justify-center rounded-xl border border-white/10">
            <span className="material-symbols-outlined text-white">notifications</span>
          </div>
        </div>

        {/* Quick Filter chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {['Verified', 'Open Now', 'Towing', 'Body Shop'].map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-5 transition-all ${
                activeFilter === filter ? 'bg-primary text-white shadow-lg' : 'bg-background-dark/80 backdrop-blur-md border border-white/10 text-[#92a9c9]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {filter === 'Verified' ? 'verified' : filter === 'Open Now' ? 'schedule' : 'local_shipping'}
              </span>
              <p className="text-sm font-medium">{filter}</p>
            </button>
          ))}
        </div>
      </div>

      {/* FABs */}
      <div className="absolute right-4 bottom-[400px] z-10 flex flex-col gap-2">
         <button className="flex size-12 items-center justify-center rounded-xl bg-background-dark/90 backdrop-blur-md border border-white/10 text-white shadow-xl"><span className="material-symbols-outlined">layers</span></button>
         <button className="flex size-12 items-center justify-center rounded-xl bg-background-dark/90 backdrop-blur-md border border-white/10 text-white shadow-xl"><span className="material-symbols-outlined">my_location</span></button>
      </div>

      {/* Bottom Sheet */}
      <div className="relative z-20 mt-auto flex flex-col bg-background-dark rounded-t-[32px] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex w-full items-center justify-center py-4">
          <div className="h-1.5 w-12 rounded-full bg-[#324867]"></div>
        </div>
        <div className="px-5 pb-2 flex items-center justify-between">
          <h2 className="text-white text-lg font-bold">Nearest Workshops</h2>
          <span className="text-primary text-sm font-semibold">View all</span>
        </div>
        
        <div className="flex flex-col gap-4 p-5 max-h-[350px] overflow-y-auto no-scrollbar">
          {MOCK_WORKSHOPS.map(workshop => (
            <div 
              key={workshop.id} 
              onClick={() => navigate(`/workshop/${workshop.id}`)}
              className="flex items-center gap-4 rounded-2xl bg-[#192433] p-4 border border-white/5 active:bg-[#233348] transition-colors"
            >
              <img src={workshop.imageUrl} className="size-20 bg-cover rounded-xl shrink-0" alt={workshop.name} />
              <div className="flex flex-col flex-1 min-w-0 gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold truncate">{workshop.name}</h3>
                  <div className="flex items-center gap-1 bg-primary/20 text-primary px-2 py-0.5 rounded-lg">
                    <span className="material-symbols-outlined text-[14px] fill-1">star</span>
                    <span className="text-xs font-bold">{workshop.rating}</span>
                  </div>
                </div>
                <p className="text-[#92a9c9] text-xs">{workshop.hours}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                  </div>
                  <span className="text-[#92a9c9] text-xs">•</span>
                  <span className="text-[#92a9c9] text-xs">{workshop.distance} away</span>
                </div>
              </div>
            </div>
          ))}
          <div className="h-20 shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default ExploreView;
