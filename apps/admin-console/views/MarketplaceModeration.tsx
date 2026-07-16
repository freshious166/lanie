import React from 'react';

const MarketplaceModeration: React.FC = () => {
    return (
        <div className="flex flex-col h-full gap-6 p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Marketplace Moderation Queue</h1>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex-1 p-6">
                
                <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Pending Listings</h2>
                
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 mb-4 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">2018 Mack Anthem (KJA-453-XY)</h3>
                            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Pending Verification</span>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Listed by: FMCG Distributors Ltd • Asking: ₦45,000,000</p>
                        
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">System Checks</p>
                            <ul className="text-sm space-y-1">
                                <li className="flex items-center gap-2 text-green-600"><span className="material-symbols-outlined text-sm">check_circle</span> 14 verified service records found</li>
                                <li className="flex items-center gap-2 text-green-600"><span className="material-symbols-outlined text-sm">check_circle</span> Odometer verified (142,500 km)</li>
                                <li className="flex items-center gap-2 text-red-500"><span className="material-symbols-outlined text-sm">warning</span> 1 expired compliance document (Roadworthiness)</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">Approve & Certify</button>
                        <button className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">Approve (Uncertified)</button>
                        <button className="bg-red-100 text-red-600 hover:bg-red-200 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">Reject Listing</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MarketplaceModeration;
