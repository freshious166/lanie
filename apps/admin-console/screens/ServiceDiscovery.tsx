
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { geminiService } from '../services/geminiService';

interface GroundedWorkshop {
  id: string;
  name: string;
  uri: string;
  description: string;
}

export const ServiceDiscovery: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [workshops, setWorkshops] = useState<GroundedWorkshop[]>([]);
  const [summary, setSummary] = useState('');
  const [location, setLocation] = useState({ lat: 37.7749, lng: -122.4194 }); // Default to SF

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log("Location access denied, using default.")
      );
    }
    // Initial search
    handleSearch('automotive repair');
  }, []);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    const result = await geminiService.discoverWorkshops(query, location);
    if (result) {
      setWorkshops(result.workshops);
      setSummary(result.text);
    }
    setIsSearching(false);
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      <header className="z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 pb-2 justify-between">
          <div className="flex size-10 items-center justify-center rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <span className="material-symbols-outlined text-2xl">menu</span>
          </div>
          <h2 className="text-lg font-black uppercase tracking-widest flex-1 text-center">Discovery</h2>
          <div className="flex w-10 justify-end">
            <button className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">map</span>
            </button>
          </div>
        </div>
        <div className="px-4 py-2">
          <div className="flex w-full items-stretch rounded-2xl h-12 shadow-inner bg-white dark:bg-card-dark border border-slate-100 dark:border-slate-800">
            <div className="text-slate-400 flex items-center justify-center pl-4">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input 
              className="form-input flex-1 border-none bg-transparent px-4 text-sm font-medium focus:ring-0" 
              placeholder="Search local workshops..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
            />
            {isSearching && (
              <div className="flex items-center pr-4">
                <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative flex-1 overflow-y-auto pb-48">
        <div className="p-4 space-y-4">
          {summary && (
            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary fill-1 text-lg">auto_awesome</span>
                <span className="text-[10px] font-black uppercase text-primary tracking-widest">AI Discovery Summary</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">{summary.split('.')[0]}.</p>
            </div>
          )}

          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] px-2 mb-2">
            {isSearching ? 'Analyzing Local Market...' : 'Top Verified Partners'}
          </h3>

          <div className="space-y-4">
            {workshops.map((ws) => (
              <div 
                key={ws.id} 
                className="bg-white dark:bg-card-dark p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl group hover:border-primary transition-all"
              >
                <div className="flex gap-4">
                  <div className="h-16 w-16 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">home_repair_service</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-lg truncate leading-tight">{ws.name}</h4>
                      <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-lg text-[10px] font-black">
                        <span className="material-symbols-outlined text-xs fill-1">verified</span>
                        MAPS
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ws.description}</p>
                    <div className="mt-4 flex gap-3">
                      <a 
                        href={ws.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 h-10 flex items-center justify-center gap-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                        View on Maps
                      </a>
                      <button 
                        onClick={() => navigate('/workshop')}
                        className="px-4 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">more_horiz</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {workshops.length === 0 && !isSearching && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
                <p className="font-bold uppercase tracking-widest text-xs">No partners found in this area</p>
                <button onClick={() => handleSearch('repair')} className="mt-4 text-primary font-black text-xs uppercase underline">Retry Generic Search</button>
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNav active="discovery" />
    </div>
  );
};
