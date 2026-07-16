
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../services/db';
import { Vehicle, ServiceRecord } from '../types';
import { geminiService } from '../services/geminiService';
import { BottomNav } from '../components/BottomNav';

export const HistoryReport: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get('vehicleId');
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('Analyzing vehicle health...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const user = db.getActiveUser();
    if (!user) {
        navigate('/login');
        return;
    }

    const vList = db.getVehicles(user.id);
    const v = vList.find(x => x.id === vehicleId) || vList[0];
    if (v) {
        setVehicle(v);
        setRecords(db.getServiceRecords(v.id));
        triggerAI(v);
    }
  }, [vehicleId, navigate]);

  const triggerAI = async (v: Vehicle) => {
    setIsAnalyzing(true);
    const result = await geminiService.analyzeVehicleHealth(v);
    setAiAnalysis(result || "Analysis failed.");
    setIsAnalyzing(false);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!vehicle) return null;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 pb-32 relative">
      <nav className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <span onClick={() => navigate(-1)} className="material-symbols-outlined cursor-pointer text-slate-600 dark:text-slate-300">arrow_back</span>
            <h1 className="text-lg font-black tracking-tight uppercase">Fleet Report</h1>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-primary">
              <span className="material-symbols-outlined font-black">picture_as_pdf</span>
            </button>
            <button 
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
      </nav>

      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl animate-bounce">
          Link Copied to Clipboard
        </div>
      )}

      <main className="max-w-md mx-auto">
        <header className="p-6">
          <div className="flex gap-5 items-center">
            <div className="aspect-square bg-cover rounded-3xl w-28 h-28 shadow-2xl ring-4 ring-primary/10" style={{backgroundImage: `url("${vehicle.image}")`}}></div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black leading-tight">{vehicle.name}</h2>
                <span className="material-symbols-outlined text-blue-500 text-sm fill-1">verified</span>
              </div>
              <p className="text-slate-500 dark:text-[#92a9c9] text-sm font-bold uppercase tracking-widest mt-1">VIN: {vehicle.vin}</p>
              <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-${vehicle.color}-500/10 text-${vehicle.color}-500 text-[10px] font-black border border-${vehicle.color}-500/20 w-fit uppercase`}>
                <span className={`w-2 h-2 rounded-full bg-${vehicle.color}-500 ${vehicle.status !== 'Healthy' ? 'animate-pulse' : ''}`}></span>
                {vehicle.status} Status
              </div>
            </div>
          </div>
        </header>

        <section className="px-6 grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-card-dark p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-widest">Current Value</p>
            <p className="text-2xl font-black mt-1 text-primary">$34,250</p>
            <div className="mt-2 flex items-center text-emerald-500 text-[10px] font-black bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="ml-1">+2.4%</span>
            </div>
          </div>
          <div className="bg-white dark:bg-card-dark p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-widest">Odometer</p>
            <p className="text-2xl font-black mt-1">{vehicle.odometer.toLocaleString()} <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">mi</span></p>
            <div className="absolute bottom-0 right-0 left-0 h-6 opacity-20 pointer-events-none">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                <path d="M0,40 L20,35 L40,32 L60,20 L80,12 L100,5" fill="none" stroke="#2b7cee" strokeWidth="4"></path>
              </svg>
            </div>
          </div>
        </section>

        {/* AI Health Check Section */}
        <section className="mt-8 px-6">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-6 rounded-[2rem] border border-primary/20 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="material-symbols-outlined text-6xl">psychology</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary fill-1">bolt</span>
                    <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Fleet Intelligence AI</h3>
                    {isAnalyzing && <div className="h-2 w-2 rounded-full bg-primary animate-ping ml-auto"></div>}
                </div>
                <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-line font-medium">
                    {aiAnalysis}
                </div>
            </div>
        </section>

        <section className="mt-10 px-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-slate-900 dark:text-white text-lg font-black uppercase tracking-widest">Service Records</h3>
            <button className="text-xs font-bold text-primary uppercase tracking-tighter bg-primary/10 px-3 py-1.5 rounded-xl">Add New</button>
          </div>
          <div className="relative pl-10 space-y-8">
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800"></div>
            {records.map((record) => (
              <div key={record.id} className="relative">
                <div className="absolute -left-10 mt-1 size-10 rounded-full bg-white dark:bg-card-dark border-4 border-background-light dark:border-background-dark flex items-center justify-center z-10 shadow-lg">
                  <span className={`material-symbols-outlined text-lg ${record.verified ? 'text-primary fill-1' : 'text-slate-400'}`}>
                    {record.type.includes('Inspection') ? 'fact_check' : 'build'}
                  </span>
                </div>
                <div className="bg-white dark:bg-card-dark p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl group hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-white">{record.type}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {record.mileage.toLocaleString()} mi</p>
                    </div>
                    {record.verified && <span className="material-symbols-outlined text-emerald-500 fill-1 text-xl">verified</span>}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{record.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav active="history" />
    </div>
  );
};
