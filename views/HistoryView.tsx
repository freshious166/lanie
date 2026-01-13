
import React from 'react';
import { MOCK_VEHICLES, MOCK_HISTORY } from '../constants';

const HistoryView: React.FC = () => {
  const activeVehicle = MOCK_VEHICLES[0];

  return (
    <div className="flex flex-col pb-24 min-h-screen bg-background-dark">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center p-4 pb-2 justify-between">
          <div className="text-white flex size-12 items-center justify-start">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </div>
          <h2 className="text-white text-lg font-bold flex-1 text-center">Vehicle History</h2>
          <div className="flex w-12 items-center justify-end">
            <span className="material-symbols-outlined text-white">share</span>
          </div>
        </div>
      </div>

      {/* Vehicle Info Card */}
      <div className="flex p-4">
        <div className="flex gap-4 items-center w-full">
          <img src={activeVehicle.imageUrl} className="h-24 w-24 object-cover rounded-xl shadow-lg border border-[#324867]" alt="car" />
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-1">
              <p className="text-white text-xl font-bold">{activeVehicle.name}</p>
              <span className="material-symbols-outlined text-primary text-sm fill-1">verified</span>
            </div>
            <p className="text-[#92a9c9] text-sm font-mono mt-1 uppercase tracking-tight">VIN: {activeVehicle.vin}</p>
            <div className="flex gap-2 mt-2">
              {['White', 'Sedan', 'Auto'].map(tag => (
                <span key={tag} className="bg-[#233348] text-[#92a9c9] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex gap-3 px-4 py-2">
        <div className="flex-1 rounded-xl p-4 border border-[#324867] bg-[#162231]">
          <p className="text-[#92a9c9] text-xs font-bold uppercase tracking-wider mb-1">Mileage</p>
          <p className="text-white text-xl font-bold">{activeVehicle.mileage.toLocaleString()} <span className="text-sm font-normal text-[#92a9c9]">mi</span></p>
        </div>
        <div className="flex-1 rounded-xl p-4 border border-[#324867] bg-[#162231]">
          <p className="text-[#92a9c9] text-xs font-bold uppercase tracking-wider mb-1">Next Service</p>
          <p className="text-white text-xl font-bold">{activeVehicle.nextServiceMileage / 1000}k <span className="text-sm font-normal text-[#92a9c9]">mi</span></p>
        </div>
        <div className="flex-1 rounded-xl p-4 border border-[#324867] bg-[#162231]">
          <p className="text-[#92a9c9] text-xs font-bold uppercase tracking-wider mb-1">Value</p>
          <p className="text-white text-xl font-bold">{activeVehicle.value}</p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 px-4 py-4 overflow-x-auto no-scrollbar">
        {['All Events', 'Maintenance', 'Accidents', 'Ownership'].map((filter, i) => (
          <div key={filter} className={`flex h-9 shrink-0 items-center justify-center px-5 rounded-full border transition-colors ${i === 0 ? 'bg-primary border-primary text-white shadow-lg' : 'bg-[#233348] border-[#324867] text-[#92a9c9]'}`}>
            <p className="text-sm font-semibold">{filter}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="px-4 pb-20 relative">
        <h3 className="text-white text-lg font-bold pb-6">Service Timeline</h3>
        <div className="relative space-y-8">
          {/* Timeline Vertical Line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-[2px] bg-[#233348] z-0"></div>

          {MOCK_HISTORY.map((event) => (
            <div key={event.id} className="relative pl-12">
              {/* Event Dot/Icon */}
              <div className={`absolute left-0 flex items-center justify-center size-12 rounded-full border-4 border-background-dark z-10 ${
                event.type === 'accident' ? 'bg-[#162231] text-red-500' : 
                event.type === 'maintenance' ? 'bg-[#162231] text-green-500' : 
                'bg-[#162231] text-primary'
              }`}>
                <span className="material-symbols-outlined">
                  {event.type === 'maintenance' ? 'oil_barrel' : 
                   event.type === 'accident' ? 'warning' : 
                   event.type === 'log' ? 'speed' : 'person'}
                </span>
              </div>
              {/* Card */}
              <div className={`bg-[#162231] p-4 rounded-xl border-y border-r border-[#324867] ${
                event.type === 'accident' ? 'border-l-4 border-l-red-500' : 
                event.type === 'maintenance' ? 'border-l-4 border-l-green-500' : 
                'border-l border-l-[#324867]'
              }`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-white">{event.title}</h4>
                  <span className="text-[11px] text-[#92a9c9] font-medium uppercase">{event.date}</span>
                </div>
                <p className={`text-sm ${event.type === 'accident' ? 'text-red-200/70' : 'text-[#92a9c9]'}`}>
                  {event.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#92a9c9]">{event.mileage}</span>
                  {event.isVerified && (
                    <div className="flex items-center gap-1 text-[11px] text-green-500 font-bold uppercase">
                      <span className="material-symbols-outlined text-sm">verified</span> Verified Record
                    </div>
                  )}
                  {event.details && (
                    <button className="text-xs text-primary font-bold flex items-center gap-1">
                      {event.details} <span className="material-symbols-outlined text-xs">chevron_right</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB Add */}
      <div className="fixed bottom-24 right-6 z-50">
        <button className="bg-primary hover:bg-primary/90 text-white flex items-center justify-center size-16 rounded-full shadow-2xl shadow-primary/40 active:scale-95 transition-transform">
          <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>add</span>
        </button>
      </div>
    </div>
  );
};

export default HistoryView;
