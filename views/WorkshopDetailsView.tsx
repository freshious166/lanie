
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_WORKSHOPS } from '../constants';

const WorkshopDetailsView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const workshop = MOCK_WORKSHOPS.find(w => w.id === id) || MOCK_WORKSHOPS[0];
  const [activeTab, setActiveTab] = useState('Services');

  const handleBook = () => {
    alert(`Great! You're requesting a booking at ${workshop.name}.\nA service representative will contact you shortly to confirm your slot.`);
  };

  const handleChat = () => {
    alert(`Opening chat with ${workshop.name}...`);
  };

  return (
    <div className="flex flex-col pb-32 bg-background-dark min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between">
        <button onClick={() => navigate(-1)} className="text-white flex size-12 items-center justify-start">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-white text-lg font-bold flex-1 text-center">Workshop Details</h2>
        <div className="flex w-12 items-center justify-end">
          <span className="material-symbols-outlined text-white">share</span>
        </div>
      </div>

      <main className="pt-16">
        <div className="relative h-64 overflow-hidden">
          <img src={workshop.imageUrl} className="w-full h-full object-cover" alt={workshop.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-white text-3xl font-bold">{workshop.name}</h1>
              {workshop.isVerified && <span className="material-symbols-outlined text-primary fill-1">verified</span>}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <p className="text-sm">{workshop.address.split(',')[1].trim()}</p>
              <span className="mx-1">•</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-yellow-400 text-sm fill-1">star</span>
                <span className="text-sm font-semibold">{workshop.rating}</span>
                <span className="text-xs text-gray-400">({workshop.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mt-4">
          <div className="flex items-center gap-4 bg-primary/10 border border-primary/20 p-4 rounded-xl justify-between">
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/20 size-10">
                <span className="material-symbols-outlined">shield</span>
              </div>
              <div>
                <p className="text-white text-base font-semibold">Lainefleet Verified</p>
                <p className="text-[#92a9c9] text-xs mt-1">Background checked and guaranteed</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary">info</span>
          </div>
        </div>

        <div className="mt-6 sticky top-16 bg-background-dark z-40">
          <div className="flex border-b border-[#324867] px-4 justify-between">
            {['Services', 'Reviews', 'About'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center justify-center border-b-[3px] py-4 flex-1 transition-colors ${activeTab === tab ? 'border-primary text-white' : 'border-transparent text-gray-400'}`}
              >
                <p className="text-sm font-bold">{tab}</p>
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'Services' && (
          <div className="mt-2">
            <h3 className="text-white text-lg font-bold px-4 py-4">Available Services</h3>
            <div className="space-y-1">
              {workshop.services.length > 0 ? workshop.services.map(service => (
                <div key={service.id} onClick={handleBook} className="flex items-center gap-4 bg-background-dark px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 active:bg-white/10">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-white flex items-center justify-center rounded-lg bg-[#233348] size-12">
                      <span className="material-symbols-outlined">{service.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-white text-base font-semibold">{service.name}</p>
                      <p className="text-gray-400 text-xs">{service.duration}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-primary font-bold">{service.price}</p>
                    <span className="material-symbols-outlined text-gray-500 text-sm">chevron_right</span>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-gray-500 italic">No specific services listed. Call for pricing.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Reviews' && (
          <div className="mt-4 px-4 pb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-bold">Recent Reviews</h3>
              <span className="text-primary text-sm font-semibold">See All</span>
            </div>
            <div className="bg-[#1a2533] p-4 rounded-xl space-y-4">
              <div className="space-y-2 border-b border-white/10 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold uppercase">JD</div>
                    <p className="text-sm font-medium">John Doe</p>
                  </div>
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-xs fill-1">star</span>)}
                  </div>
                </div>
                <p className="text-sm text-gray-400 italic">"Great service! They were very professional and finished faster than expected."</p>
              </div>
              <div className="space-y-2 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold uppercase text-primary">SA</div>
                    <p className="text-sm font-medium">Sarah Adams</p>
                  </div>
                  <div className="flex text-yellow-400">
                    {[1,2,3,4].map(i => <span key={i} className="material-symbols-outlined text-xs fill-1">star</span>)}
                  </div>
                </div>
                <p className="text-sm text-gray-400 italic">"Good quality work, price was exactly as quoted. Highly recommend for BMW owners."</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'About' && (
          <div className="mt-4 px-4 pb-12 space-y-6">
            <div>
              <h3 className="text-white text-lg font-bold mb-2">Description</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{workshop.description}</p>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Location</h3>
              <div className="rounded-xl overflow-hidden h-40 relative bg-gray-800 border border-white/10">
                <img className="w-full h-full object-cover opacity-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7MrkLb_Yn1bbrMaK38Zx7GMiHfwV878-MfTLEQrfgAqjMGDn4yu6XDfwNGwDbiUwKfURvehancZHNEKXSPlPD2NPlNif80YZT2iSgAkbber8r7zoQakwu4btYidfydsJTBJnNdSbnL1GBhV26qjnVL9CRkuAcbIP893N01wGBBAKrvzUDySLMCbESDVr1w4fNvFXZLJzH-JuifdTDucK8s4DTN2LM4bd_N6HbfmZPqdPH9nh6uujdi0qupAuMdBZFR9-yerQ8vUE" alt="map" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-4xl fill-1 animate-bounce">location_on</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">directions</span>
                {workshop.address}
              </p>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-dark/90 backdrop-blur-xl border-t border-white/10 flex items-center gap-3 pb-24 z-50">
        <button onClick={handleChat} className="flex size-14 items-center justify-center rounded-xl bg-[#233348] text-white active:bg-[#2b3e57] transition-colors">
          <span className="material-symbols-outlined">chat_bubble</span>
        </button>
        <button onClick={handleBook} className="flex-1 h-14 bg-primary rounded-xl text-white font-bold text-lg shadow-lg shadow-primary/20 active:scale-95 transition-transform">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default WorkshopDetailsView;
