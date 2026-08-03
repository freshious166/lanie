import { API_URL } from '../constants';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const HistoryView: React.FC = () => {
  const { data: vehicle, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ['activeVehicle'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/vehicles`);
      return data[0]; // Just grab the first vehicle for this view
    }
  });

  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['service-records', vehicle?.id],
    enabled: !!vehicle?.id,
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/service-records/vehicle/${vehicle.id}`);
      return data.map((record: any) => ({
        id: record.id,
        title: record.partsUsed?.title || record.serviceType,
        date: new Date(record.serviceDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        description: record.partsUsed?.description || '',
        mileage: `${record.mileageAtService.toLocaleString()} mi`,
        type: record.serviceType,
        isVerified: record.partsUsed?.isVerified,
        details: record.partsUsed?.details
      }));
    }
  });

  if (isLoadingVehicle || isLoadingHistory) {
    return <div className="flex h-screen items-center justify-center bg-background-light text-gray-900 font-bold">Loading History...</div>;
  }

  if (!vehicle) {
    return <div className="flex h-screen items-center justify-center bg-background-light text-gray-900 font-bold">No Vehicle Data Found</div>;
  }

  const activeVehicle = {
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    vin: vehicle.vin,
    imageUrl: vehicle.imageUrl,
    mileage: vehicle.currentMileage,
    nextServiceMileage: vehicle.nextServiceMileage || 0,
    value: vehicle.value || '$0'
  };

  return (
    <div className="flex flex-col pb-24 min-h-screen bg-background-light">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md">
        <div className="flex items-center p-4 pb-2 justify-between">
          <div className="text-gray-900 flex size-12 items-center justify-start">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </div>
          <h2 className="text-gray-900 text-lg font-bold flex-1 text-center">Vehicle History</h2>
          <div className="flex w-12 items-center justify-end">
            <span className="material-symbols-outlined text-gray-900">share</span>
          </div>
        </div>
      </div>

      {/* Vehicle Info Card */}
      <div className="flex p-4">
        <div className="flex gap-4 items-center w-full">
          <img src={activeVehicle.imageUrl} className="h-24 w-24 object-cover rounded-xl shadow-lg border border-[#324867]" alt="car" />
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-1">
              <p className="text-gray-900 text-xl font-bold">{activeVehicle.name}</p>
              <span className="material-symbols-outlined text-primary text-sm fill-1">verified</span>
            </div>
            <p className="text-gray-500 text-sm font-mono mt-1 uppercase tracking-tight">VIN: {activeVehicle.vin}</p>
            <div className="flex gap-2 mt-2">
              {['White', 'Sedan', 'Auto'].map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex gap-3 px-4 py-2">
        <div className="flex-1 rounded-xl p-4 border border-[#324867] bg-[#162231]">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Mileage</p>
          <p className="text-gray-900 text-xl font-bold">{activeVehicle.mileage.toLocaleString()} <span className="text-sm font-normal text-gray-500">mi</span></p>
        </div>
        <div className="flex-1 rounded-xl p-4 border border-[#324867] bg-[#162231]">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Next Service</p>
          <p className="text-gray-900 text-xl font-bold">{activeVehicle.nextServiceMileage / 1000}k <span className="text-sm font-normal text-gray-500">mi</span></p>
        </div>
        <div className="flex-1 rounded-xl p-4 border border-[#324867] bg-[#162231]">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Value</p>
          <p className="text-gray-900 text-xl font-bold">{activeVehicle.value}</p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 px-4 py-4 overflow-x-auto no-scrollbar">
        {['All Events', 'Maintenance', 'Accidents', 'Ownership'].map((filter, i) => (
          <div key={filter} className={`flex h-9 shrink-0 items-center justify-center px-5 rounded-full border transition-colors ${i === 0 ? 'bg-primary border-primary text-gray-900 shadow-lg' : 'bg-gray-100 border-[#324867] text-gray-500'}`}>
            <p className="text-sm font-semibold">{filter}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="px-4 pb-20 relative">
        <h3 className="text-gray-900 text-lg font-bold pb-6">Service Timeline</h3>
        <div className="relative space-y-8">
          {/* Timeline Vertical Line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-[2px] bg-gray-100 z-0"></div>

          {history.map((event: any) => (
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
                  <h4 className="font-bold text-gray-900">{event.title}</h4>
                  <span className="text-[11px] text-gray-500 font-medium uppercase">{event.date}</span>
                </div>
                <p className={`text-sm ${event.type === 'accident' ? 'text-red-200/70' : 'text-gray-500'}`}>
                  {event.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500">{event.mileage}</span>
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
        <button className="bg-primary hover:bg-primary/90 text-gray-900 flex items-center justify-center size-16 rounded-full shadow-2xl shadow-primary/40 active:scale-95 transition-transform">
          <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>add</span>
        </button>
      </div>
    </div>
  );
};

export default HistoryView;
