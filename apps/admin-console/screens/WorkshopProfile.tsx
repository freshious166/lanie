
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const WorkshopProfile: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(true);
  
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen pb-40">
      <nav className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-xl mx-auto">
          <div className="flex items-center gap-3">
            <span onClick={() => navigate(-1)} className="material-symbols-outlined cursor-pointer text-slate-600 dark:text-slate-300">arrow_back</span>
            <h2 className="text-lg font-black uppercase tracking-widest">Workshop</h2>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800"><span className="material-symbols-outlined">share</span></button>
            <button className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-red-500"><span className="material-symbols-outlined fill-1">favorite</span></button>
          </div>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-4">
        <div className="w-full bg-center bg-cover flex flex-col justify-end overflow-hidden rounded-[2.5rem] min-h-[350px] shadow-2xl relative" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800")'}}>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent"></div>
          <div className="relative p-8">
            <span className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] mb-3 inline-block shadow-lg shadow-primary/30">Lainefleet Verified</span>
            <h1 className="text-white text-3xl font-black tracking-tight leading-tight">Laine Master Garage</h1>
            <div className="flex items-center gap-4 mt-3 text-slate-300">
               <div className="flex items-center gap-1 text-amber-500">
                 <span className="material-symbols-outlined text-sm fill-1">star</span>
                 <span className="text-sm font-black">4.9 (1,240 Reviews)</span>
               </div>
               <span className="text-sm font-bold">• Open until 8 PM</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-xl mx-auto px-6 space-y-8">
        <div className="grid grid-cols-3 gap-3 bg-white dark:bg-card-dark p-3 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex flex-col items-center gap-2 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-3xl transition-colors active:scale-95">
            <div className="rounded-full bg-primary/10 p-3 text-primary"><span className="material-symbols-outlined font-black">call</span></div>
            <p className="text-[10px] font-black uppercase tracking-widest">Call</p>
          </div>
          <div className="flex flex-col items-center gap-2 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-3xl transition-colors active:scale-95">
            <div className="rounded-full bg-primary/10 p-3 text-primary"><span className="material-symbols-outlined font-black">assistant_direction</span></div>
            <p className="text-[10px] font-black uppercase tracking-widest">Route</p>
          </div>
          <div className="flex flex-col items-center gap-2 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-3xl transition-colors active:scale-95">
            <div className="rounded-full bg-primary/10 p-3 text-primary"><span className="material-symbols-outlined font-black">chat</span></div>
            <p className="text-[10px] font-black uppercase tracking-widest">Chat</p>
          </div>
        </div>

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-widest">Select Service</h3>
            <span className="text-xs font-bold text-slate-500 uppercase">Prices may vary</span>
          </div>
          <div className="space-y-4">
            <div 
                className={`bg-white dark:bg-card-dark p-6 rounded-[2rem] border-2 transition-all cursor-pointer shadow-xl flex items-start justify-between ${selected ? 'border-primary' : 'border-slate-200 dark:border-slate-800'}`}
                onClick={() => setSelected(!selected)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-2xl">oil_barrel</span>
                  <h4 className="font-black text-lg">Full Synthetic Oil Change</h4>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed pr-8">Premium 5W-30 synthetic oil, genuine OEM filter replacement, and a comprehensive 48-point safety audit.</p>
                <div className="flex items-center gap-5 mt-4">
                  <span className="text-xl font-black text-primary">$89.99</span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span className="text-xs font-bold uppercase tracking-tighter">45 mins</span>
                  </div>
                </div>
              </div>
              <div className={`size-7 rounded-full border-4 mt-1 flex items-center justify-center transition-all ${selected ? 'bg-primary border-primary shadow-lg shadow-primary/30' : 'border-slate-200 dark:border-slate-800'}`}>
                {selected && <span className="material-symbols-outlined text-white text-base font-black">check</span>}
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 dark:bg-background-dark/95 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{selected ? '1 Action' : '0 Actions'}</p>
            <p className="text-2xl font-black text-primary">{selected ? '$89.99' : '$0.00'}</p>
          </div>
          <button 
            disabled={!selected}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-black py-5 px-8 rounded-[1.5rem] shadow-2xl shadow-primary/40 disabled:opacity-50 active:scale-95 transition-all text-lg tracking-widest uppercase"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};
