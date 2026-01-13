
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmergencyView: React.FC = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState('Towing');
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const issues = [
    { id: 'tire', label: 'Flat Tire', sub: 'Replace or repair', icon: 'tire_repair' },
    { id: 'battery', label: 'Dead Battery', sub: 'Needs jumpstart', icon: 'battery_charging_full' },
    { id: 'engine', label: 'Engine Issue', sub: 'Mechanical failure', icon: 'car_repair' },
    { id: 'fuel', label: 'Out of Fuel', sub: 'Gas delivery', icon: 'local_gas_station' },
  ];

  return (
    <div className="relative flex h-screen flex-col bg-background-dark overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center p-4 pb-2 justify-between z-10">
        <button onClick={() => navigate(-1)} className="text-white flex size-12 items-center">
          <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
        </button>
        <h2 className="text-white text-lg font-bold flex-1 text-center pr-12">Emergency Assistance</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-48">
        {/* Map Section */}
        <div className="relative px-4 py-3">
          <div className="w-full h-48 bg-center bg-no-repeat rounded-xl overflow-hidden relative shadow-lg" 
               style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCtAena5DYU4nKhe36psgmew2SfRIG65jIWL44aiwYYh-h_QOm4QRlRS7iY4YKGoDXUDhLMPxsfE_YsvFq9ZtPe0ysQ5guNpMLGrx9GuWdjhgRbD5Nnof0EsnUks9jetXodxlG5jDnpbjhSJHYy-L5A3qCQxICN0wLJcsE1hjykPCuSb3yjYdDOR7NJDQxBN2F8xiVhuooOxhBlOuBYl9_QDkJN0OBMnE52GIL0fU_shGCqvrh6E_VKOWZlKSN0IoaTbAUZQ9BiYjA")', backgroundSize: 'cover' }}>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                <span className="material-symbols-outlined text-primary text-5xl drop-shadow-md fill-1">location_on</span>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary/30 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
          {/* Detected Location Overlay */}
          <div className="absolute bottom-6 left-8 right-8 bg-background-dark/90 backdrop-blur-md border border-white/10 rounded-lg p-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">my_location</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#92a9c9] uppercase tracking-widest font-bold">Detected Location</span>
              <span className="text-sm font-semibold truncate">Hwy 101 North, Near Exit 422</span>
            </div>
            <button className="ml-auto text-xs text-primary font-bold">EDIT</button>
          </div>
        </div>

        {/* Headline */}
        <div className="pt-2">
          <h3 className="text-white text-2xl font-bold px-4 text-center">What's the emergency?</h3>
          <p className="text-[#92a9c9] text-sm text-center px-8 mt-1">Select the type of assistance you need immediately.</p>
        </div>

        {/* Segmented Buttons */}
        <div className="flex px-4 py-6">
          <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#233348] p-1.5 shadow-inner">
            <button 
              onClick={() => setServiceType('Towing')}
              className={`flex h-full grow items-center justify-center rounded-lg px-2 transition-all font-bold text-sm ${serviceType === 'Towing' ? 'bg-primary text-white shadow-lg' : 'text-[#92a9c9]'}`}>
              Towing
            </button>
            <button 
              onClick={() => setServiceType('Roadside Repair')}
              className={`flex h-full grow items-center justify-center rounded-lg px-2 transition-all font-bold text-sm ${serviceType === 'Roadside Repair' ? 'bg-primary text-white shadow-lg' : 'text-[#92a9c9]'}`}>
              Roadside Repair
            </button>
          </div>
        </div>

        {/* Issue Grid */}
        <div className="grid grid-cols-2 gap-3 px-4 pb-6">
          {issues.map(issue => (
            <div 
              key={issue.id} 
              onClick={() => setSelectedIssue(issue.id)}
              className={`flex flex-col gap-3 rounded-xl border p-4 cursor-pointer transition-colors active:scale-95 ${
                selectedIssue === issue.id ? 'border-primary bg-[#233348]' : 'border-white/10 bg-[#192433]'
              }`}>
              <div className="text-primary">
                <span className="material-symbols-outlined text-3xl">{issue.icon}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <h2 className="text-white text-base font-bold leading-tight">{issue.label}</h2>
                <p className="text-[#92a9c9] text-[12px] font-medium">{issue.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="px-4">
          <div className="bg-[#192433] border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-sm text-slate-400">edit_note</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Additional details</span>
            </div>
            <textarea 
              className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 text-white placeholder:text-slate-500" 
              placeholder="Describe your situation here..." 
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-24 bg-background-dark/80 backdrop-blur-xl border-t border-white/5">
        <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
          <span className="material-symbols-outlined">sos</span>
          <span className="text-lg">Request Help Now</span>
        </button>
      </div>
    </div>
  );
};

export default EmergencyView;
