
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const EmergencyPortal: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <div className="flex items-center p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
        <div onClick={() => navigate(-1)} className="text-gray-900 dark:text-white flex size-12 shrink-0 items-center cursor-pointer">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">LaineFleet SOS</h2>
          <p className="text-xs text-primary font-bold tracking-widest uppercase">ID: LF-E991</p>
        </div>
        <div className="flex w-12 items-center justify-end">
          <button className="flex size-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30">
            <span className="material-symbols-outlined fill-1">call</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-between items-end">
          <div className="flex flex-col">
            <p className="text-gray-900 dark:text-white text-xl font-black">Mechanic Dispatch</p>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Estimated Arrival: 6 mins</p>
          </div>
          <p className="text-primary text-sm font-black leading-normal uppercase bg-primary/10 px-3 py-1 rounded-full animate-pulse">En Route</p>
        </div>
        <div className="rounded-full bg-gray-200 dark:bg-[#324867] h-3 overflow-hidden mt-2">
          <div className="h-full rounded-full bg-primary shadow-[0_0_10px_rgba(43,124,238,0.8)]" style={{width: '75%'}}></div>
        </div>
      </div>

      <div className="flex px-4 py-2 flex-1 min-h-[350px]">
        <div className="w-full h-full bg-center bg-no-repeat bg-cover rounded-[2rem] relative border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200")'}}>
          <div className="absolute inset-0 bg-blue-500/10 pointer-events-none"></div>
          <div className="absolute top-6 left-6 bg-background-dark/90 backdrop-blur-md p-3 px-4 rounded-2xl border border-white/10 shadow-2xl">
            <p className="text-[10px] text-primary uppercase font-black tracking-[0.2em] mb-1">Status</p>
            <p className="text-white text-xl font-black">NEARBY</p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="relative">
                <div className="absolute -inset-8 bg-primary/20 rounded-full animate-ping"></div>
                <span className="material-symbols-outlined text-primary text-6xl drop-shadow-[0_0_20px_rgba(43,124,238,1)] fill-1">location_on</span>
             </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col gap-4 rounded-3xl bg-white dark:bg-[#192433] p-5 shadow-2xl border border-gray-100 dark:border-white/5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-primary text-[10px] font-black uppercase tracking-widest">Master Tech • LaineFleet Certified</p>
              <p className="text-gray-900 dark:text-white text-xl font-bold leading-tight">Alex Reed</p>
              <p className="text-gray-500 dark:text-[#92a9c9] text-sm font-medium">White Ford F-150 • Plate: 7BKR211</p>
            </div>
            <div className="h-16 w-16 bg-center bg-no-repeat bg-cover rounded-2xl border-4 border-primary/20 shadow-md" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200")'}}></div>
          </div>
          <div className="flex gap-3 mt-2">
            <button className="flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 px-4 flex gap-2 bg-primary text-white text-base font-black leading-normal shadow-lg shadow-primary/20 active:scale-95 transition-all">
              <span className="material-symbols-outlined">chat</span>
              <span>Secure Chat</span>
            </button>
            <button className="w-14 cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 flex bg-slate-100 dark:bg-slate-800 text-gray-900 dark:text-white border border-slate-200 dark:border-white/10 active:scale-95 transition-all">
              <span className="material-symbols-outlined">call</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 mt-auto border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md">
        <button className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-16 px-5 bg-red-600 text-white text-lg font-black leading-normal tracking-wider shadow-[0_8px_30px_rgba(220,38,38,0.4)] active:bg-red-700 transition-colors">
          <span className="truncate">CANCEL REQUEST</span>
        </button>
      </div>
    </div>
  );
};
