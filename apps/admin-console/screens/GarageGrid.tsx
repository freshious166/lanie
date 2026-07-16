
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { Vehicle } from '../types';
import { BottomNav } from '../components/BottomNav';

export const GarageGrid: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const user = db.getActiveUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setVehicles(db.getVehicles(user.id));
  }, [user, navigate]);

  const filteredVehicles = vehicles.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.vin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between z-10 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="text-primary flex size-8 shrink-0 items-center justify-center bg-primary/10 rounded-lg">
            <span className="material-symbols-outlined">directions_car</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Garage</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-slate-500 dark:text-slate-400 p-1 relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 hidden sm:block">{user?.name}</span>
            <button className="flex items-center justify-center rounded-full overflow-hidden w-8 h-8 bg-slate-200 dark:bg-slate-700">
              <span className="material-symbols-outlined text-slate-500">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto hide-scrollbar pb-64">
        <div className="px-4 py-3 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-12 shadow-sm">
            <div className="text-slate-400 flex border-none bg-white dark:bg-[#192433] items-center justify-center pl-4 rounded-l-xl">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              className="form-input flex w-full border-none bg-white dark:bg-[#192433] rounded-r-xl px-4 text-base font-normal focus:ring-0" 
              placeholder="Search your vehicles..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">My Fleet</h3>
          <span className="text-slate-500 text-sm font-medium">{filteredVehicles.length} Registered</span>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVehicles.map((car) => (
            <div 
              key={car.id} 
              className="flex flex-col rounded-2xl shadow-xl bg-white dark:bg-[#192433] overflow-hidden border border-slate-100 dark:border-slate-800 transform active:scale-[0.98] transition-all cursor-pointer"
              onClick={() => navigate(`/history?vehicleId=${car.id}`)}
            >
              <div className="relative aspect-[16/9] bg-center bg-cover" style={{backgroundImage: `url("${car.image}")`}}>
                <div className="absolute top-3 right-3">
                  <span className={`flex items-center gap-1 bg-${car.color}-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full backdrop-blur-sm shadow-lg`}>
                    <span className="size-1.5 rounded-full bg-white animate-pulse"></span>
                    {car.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-col p-5 gap-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-slate-900 dark:text-white text-xl font-bold">{car.name}</h4>
                  <span className="material-symbols-outlined text-slate-400">more_vert</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 opacity-70">
                  <p className="text-slate-500 dark:text-[#92a9c9] text-xs font-mono">VIN: {car.vin}</p>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">speed</span>
                    <p className="text-slate-500 dark:text-[#92a9c9] text-xs font-medium">{car.odometer.toLocaleString()} mi</p>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Health Status</span>
                    <span className={`text-${car.color}-500 text-sm font-semibold`}>{car.status === "Healthy" ? "Optimal" : car.status}</span>
                  </div>
                  <button className="flex items-center justify-center rounded-xl h-10 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-primary/90">
                    Diagnostics
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 h-48 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
            <span className="material-symbols-outlined text-slate-400 text-4xl mb-2">add_circle</span>
            <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Add New Vehicle</span>
          </div>
        </div>
      </main>

      <div className="absolute bottom-24 left-0 right-0 bg-white/80 dark:bg-background-dark/90 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 px-4 py-6 flex flex-col gap-4 shadow-[0_-15px_35px_rgba(0,0,0,0.15)] z-40">
        <div className="flex items-center justify-between">
          <h4 className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-[0.15em]">LaineFleet Operations</h4>
          <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined">expand_less</span></button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => navigate('/emergency')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 active:scale-95 transition-transform">
            <span className="material-symbols-outlined font-black">emergency_home</span>
            <span className="text-[10px] font-bold text-center leading-tight uppercase">Emergency<br/>Portal</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 active:scale-95 transition-transform">
            <span className="material-symbols-outlined">file_download</span>
            <span className="text-[10px] font-bold text-center leading-tight uppercase">Reports<br/>PDF</span>
          </button>
          <button onClick={() => navigate('/discovery')} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 active:scale-95 transition-transform">
            <span className="material-symbols-outlined">calendar_month</span>
            <span className="text-[10px] font-bold text-center leading-tight uppercase">Schedule<br/>Service</span>
          </button>
        </div>
      </div>
      
      <BottomNav active="garage" />
    </div>
  );
};
