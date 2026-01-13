
import React, { useState, useMemo } from 'react';
import { MOCK_VEHICLES } from '../constants';
import { GoogleGenAI, Type } from '@google/genai';

interface VINResult {
  isValid: boolean;
  message: string;
  details?: {
    year: string;
    make: string;
    model: string;
    engine: string;
  };
}

const GarageView: React.FC = () => {
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVehicleId, setActiveVehicleId] = useState(MOCK_VEHICLES[0].id);
  const [vinInput, setVinInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VINResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const statusFilters = ['All', 'Healthy', 'Needs Attention', 'Warning'];

  const filteredVehicles = useMemo(() => {
    return MOCK_VEHICLES.filter((vehicle) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        vehicle.name.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.licensePlate.toLowerCase().includes(query);
      
      const matchesStatus = 
        activeStatusFilter === 'All' || 
        vehicle.status === activeStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, activeStatusFilter]);

  const activeVehicle = useMemo(() => {
    return MOCK_VEHICLES.find(v => v.id === activeVehicleId) || MOCK_VEHICLES[0];
  }, [activeVehicleId]);

  const validateVINFormat = (vin: string): string | null => {
    const cleanVin = vin.trim().toUpperCase();
    if (cleanVin.length === 0) return 'Please enter a VIN.';
    if (cleanVin.length !== 17) return `VIN must be exactly 17 characters (current: ${cleanVin.length}).`;
    
    // VINs never contain I, O, or Q to avoid confusion with 1, 0, or 9.
    if (/[IOQ]/.test(cleanVin)) {
      return 'VIN cannot contain letters I, O, or Q (often confused with numbers).';
    }
    
    if (/[^A-Z0-9]/.test(cleanVin)) {
      return 'VIN must only contain alphanumeric characters (letters and numbers).';
    }
    
    return null;
  };

  const handleVerifyVIN = async () => {
    const formatError = validateVINFormat(vinInput);
    if (formatError) {
      setError(formatError);
      return;
    }

    setIsVerifying(true);
    setError(null);
    setVerificationResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Verify this Vehicle Identification Number (VIN) and extract details: ${vinInput}. 
                  Strictly follow the JSON schema. If the VIN is a dummy (like "ABC12345678901234") or appears invalid for real-world use despite format, mark isValid: false.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isValid: { type: Type.BOOLEAN, description: "Whether the VIN appears to be a valid format" },
              message: { type: Type.STRING, description: "Brief status message" },
              details: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.STRING },
                  make: { type: Type.STRING },
                  model: { type: Type.STRING },
                  engine: { type: Type.STRING }
                },
                required: ["year", "make", "model", "engine"]
              }
            },
            required: ["isValid", "message"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setVerificationResult(data);
    } catch (err) {
      console.error(err);
      setError('Connection failed. Please check your network and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setVinInput(value);
    if (error) setError(null); // Clear error while typing
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Top Header */}
      <header className="flex items-center p-4 pb-2 justify-between sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md">
        <div className="text-white flex size-12 items-center justify-start">
          <span className="material-symbols-outlined text-3xl">account_circle</span>
        </div>
        <h2 className="text-white text-lg font-bold flex-1 text-center">Personal Garage</h2>
        <div className="flex w-12 items-center justify-end">
          <span className="material-symbols-outlined text-2xl text-white">notifications</span>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 mt-2">
        <div className="flex items-center h-12 bg-surface-dark/50 rounded-xl border border-white/10 px-4 gap-3">
          <span className="material-symbols-outlined text-[#92a9c9]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, model or plate..."
            className="bg-transparent border-none focus:ring-0 text-white placeholder-[#324867] w-full text-sm font-medium p-0"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#92a9c9]">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Vehicle Carousel */}
      <section className="mt-4">
        {filteredVehicles.length > 0 ? (
          <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 gap-4">
            {filteredVehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                onClick={() => setActiveVehicleId(vehicle.id)}
                className={`flex h-full flex-none flex-col gap-3 rounded-xl w-[85%] snap-center transition-all duration-300 cursor-pointer ${activeVehicleId === vehicle.id ? 'scale-[1.02]' : 'opacity-60'}`}
              >
                <div className={`relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border-2 transition-colors ${activeVehicleId === vehicle.id ? 'border-primary' : 'border-transparent'}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs fill-1">verified</span> ACTIVE
                  </div>
                </div>
                <div>
                  <p className={`text-lg font-bold leading-tight transition-colors ${activeVehicleId === vehicle.id ? 'text-white' : 'text-[#92a9c9]'}`}>{vehicle.name}</p>
                  <p className="text-[#92a9c9] text-sm font-medium">{vehicle.model} • {vehicle.licensePlate}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-8 text-center bg-surface-dark/30 mx-4 rounded-xl border border-white/5 border-dashed">
            <span className="material-symbols-outlined text-[#324867] text-4xl mb-2">directions_car</span>
            <p className="text-[#92a9c9] text-sm font-medium">No vehicles found matching your search.</p>
          </div>
        )}
        
        {filteredVehicles.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {filteredVehicles.map((v) => (
              <div 
                key={v.id} 
                className={`h-1.5 rounded-full transition-all duration-300 ${activeVehicleId === v.id ? 'w-6 bg-primary' : 'w-1.5 bg-slate-300 dark:bg-surface-accent'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Status Filters */}
      <div className="mt-6 px-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveStatusFilter(filter)}
              className={`flex h-9 shrink-0 items-center justify-center gap-2 rounded-full px-5 transition-all text-sm font-semibold border ${
                activeStatusFilter === filter
                  ? 'bg-primary border-primary text-white shadow-lg'
                  : 'bg-surface-dark border-white/10 text-[#92a9c9]'
              }`}
            >
              {filter !== 'All' && (
                <div className={`w-2 h-2 rounded-full ${
                  filter === 'Healthy' ? 'bg-green-500' : 
                  filter === 'Needs Attention' ? 'bg-amber-500' : 'bg-red-500'
                }`}></div>
              )}
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* VIN Verification Section */}
      <div className="mt-6 px-4">
        <div className="bg-surface-dark rounded-2xl border border-white/5 p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-base font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">qr_code_scanner</span>
              VIN Verification
            </h3>
            <span className="text-[10px] font-bold text-[#92a9c9] tracking-widest uppercase">Safety First</span>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="text"
                maxLength={17}
                value={vinInput}
                onChange={handleVinChange}
                placeholder="Enter 17-digit VIN"
                className={`w-full bg-[#101822] border rounded-xl py-3 px-4 text-white font-mono placeholder-[#324867] focus:ring-primary focus:border-primary uppercase transition-colors ${
                  error ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-white/10'
                }`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#92a9c9] font-bold">
                {vinInput.length}/17
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-red-400 px-1 py-1 animate-in fade-in slide-in-from-left-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <p className="text-xs font-medium">{error}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleVerifyVIN}
            disabled={isVerifying}
            className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
              isVerifying
                ? 'bg-surface-accent text-[#324867] cursor-not-allowed'
                : 'bg-primary text-white shadow-lg shadow-primary/20 active:scale-95'
            }`}
          >
            {isVerifying ? (
              <div className="flex items-center gap-3">
                <span className="animate-spin material-symbols-outlined text-xl">progress_activity</span>
                <span>Checking Database...</span>
              </div>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl">verified_user</span>
                Verify Now
              </>
            )}
          </button>

          {verificationResult && (
            <div className={`mt-2 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${
              verificationResult.isValid ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
            }`}>
              <div className="flex items-start gap-3">
                <span className={`material-symbols-outlined ${verificationResult.isValid ? 'text-green-500' : 'text-red-500'}`}>
                  {verificationResult.isValid ? 'check_circle' : 'warning'}
                </span>
                <div className="flex flex-col gap-1">
                  <p className="text-white text-sm font-bold">{verificationResult.message}</p>
                  {verificationResult.details && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#92a9c9] uppercase tracking-wider font-bold">Vehicle</span>
                        <span className="text-xs text-white">{verificationResult.details.year} {verificationResult.details.make}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#92a9c9] uppercase tracking-wider font-bold">Model</span>
                        <span className="text-xs text-white">{verificationResult.details.model}</span>
                      </div>
                      <div className="flex flex-col col-span-2 mt-1">
                        <span className="text-[10px] text-[#92a9c9] uppercase tracking-wider font-bold">Engine Specs</span>
                        <span className="text-xs text-white">{verificationResult.details.engine}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Details Section */}
      <div className="mt-6 px-4">
        <div className="bg-surface-dark rounded-2xl border border-white/5 p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-base font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Vehicle Specifications
            </h3>
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Live Data</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center p-3 bg-[#101822] rounded-xl border border-white/5 gap-1">
              <span className="material-symbols-outlined text-[#92a9c9] text-lg">speed</span>
              <p className="text-[10px] text-[#92a9c9] uppercase font-bold tracking-tight">Mileage</p>
              <p className="text-white text-sm font-bold">{activeVehicle.mileage.toLocaleString()}</p>
              <p className="text-[8px] text-[#92a9c9] font-medium italic">mi total</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-[#101822] rounded-xl border border-white/5 gap-1 text-center">
              <span className="material-symbols-outlined text-[#92a9c9] text-lg">event_note</span>
              <p className="text-[10px] text-[#92a9c9] uppercase font-bold tracking-tight">Next Svc</p>
              <p className="text-white text-sm font-bold">{activeVehicle.nextServiceMileage.toLocaleString()}</p>
              <p className="text-[8px] text-[#92a9c9] font-medium italic">mi target</p>
            </div>

            <div className="flex flex-col items-center justify-center p-3 bg-[#101822] rounded-xl border border-white/5 gap-1">
              <span className="material-symbols-outlined text-green-500 text-lg">payments</span>
              <p className="text-[10px] text-[#92a9c9] uppercase font-bold tracking-tight">Value</p>
              <p className="text-white text-sm font-bold">{activeVehicle.value}</p>
              <p className="text-[8px] text-[#92a9c9] font-medium italic">est. mkt</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-[#92a9c9] bg-white/5 p-2 rounded-lg">
            <span className="material-symbols-outlined text-xs">info</span>
            <span>Data synchronized with LaineFleet Cloud on {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Vehicle Status */}
      <h3 className="text-white text-lg font-bold px-4 pb-2 pt-6">Vehicle Status</h3>
      <div className="space-y-4 px-4 pb-4">
        {/* Maintenance Card */}
        <div className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-surface-dark p-4 border border-slate-100 dark:border-transparent">
          <div className="flex flex-[2_2_0px] flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-sm">build</span>
                <p className="text-primary text-[11px] font-bold uppercase tracking-wider">Maintenance</p>
              </div>
              <p className="text-white text-base font-bold leading-tight">Next Service in {Math.max(0, activeVehicle.nextServiceMileage - activeVehicle.mileage)} mi</p>
              <p className="text-[#92a9c9] text-sm font-normal">Oil change and brake inspection</p>
            </div>
            <button className="flex min-w-[100px] items-center justify-center rounded-lg h-9 px-4 bg-primary/10 dark:bg-surface-accent text-primary dark:text-white gap-2 text-sm font-semibold">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>Schedule</span>
            </button>
          </div>
          <div className="w-32 bg-[#233348] rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary/40">car_repair</span>
          </div>
        </div>

        {/* Insurance Card */}
        <div className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-surface-dark p-4 border border-slate-100 dark:border-transparent">
          <div className="flex flex-[2_2_0px] flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-500 text-sm">priority_high</span>
                <p className="text-amber-500 text-[11px] font-bold uppercase tracking-wider">Urgent</p>
              </div>
              <p className="text-white text-base font-bold leading-tight">Insurance Expires in 30 days</p>
              <p className="text-[#92a9c9] text-sm font-normal">Policy #LN-99283</p>
            </div>
            <button className="flex min-w-[100px] items-center justify-center rounded-lg h-9 px-4 bg-primary text-white gap-2 text-sm font-semibold">
              <span className="material-symbols-outlined text-[18px]">sync</span>
              <span>Renew</span>
            </button>
          </div>
          <div className="w-32 bg-[#233348] rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-amber-500/40">shield</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="text-white text-lg font-bold px-4 pb-2 pt-6">Quick Actions</h3>
      <div className="flex flex-col gap-3 px-4">
        {[
          { icon: 'add_circle', title: 'Add New Vehicle', desc: 'Register a new car to your garage' },
          { icon: 'description', title: 'Manage Documents', desc: 'Insurance, Registration, Logs' },
          { icon: 'settings_input_component', title: 'View Specs', desc: 'Technical data and VIN info' },
        ].map((action, idx) => (
          <button key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-transparent active:bg-surface-accent transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">{action.icon}</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-white">{action.title}</p>
                <p className="text-xs text-[#92a9c9]">{action.desc}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GarageView;
