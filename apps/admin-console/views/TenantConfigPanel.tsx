import React, { useState } from 'react';

const TenantConfigPanel: React.FC = () => {
    const [currency, setCurrency] = useState('NGN');
    const [countryCode, setCountryCode] = useState('NG');

    const handleSave = () => {
        alert('Regional configuration saved for tenant.');
    };

    return (
        <div className="flex flex-col h-full gap-6 p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tenant Regional Configuration</h1>
            <p className="text-slate-500 mb-4">Manage ECOWAS regional settings, currency overrides, and payment routing per tenant.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500">public</span>
                        Localization Settings
                    </h2>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Operating Country (ISO 3166-1)</label>
                        <select 
                            value={countryCode} 
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white"
                        >
                            <option value="NG">Nigeria (NG)</option>
                            <option value="GH">Ghana (GH)</option>
                            <option value="CI">Côte d'Ivoire (CI)</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Billing Currency (ISO 4217)</label>
                        <select 
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white"
                        >
                            <option value="NGN">Naira (NGN)</option>
                            <option value="GHS">Cedi (GHS)</option>
                            <option value="XOF">CFA Franc (XOF)</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-500">api</span>
                        Gateway Overrides
                    </h2>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Provider</label>
                        <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white">
                            <option value="PAYSTACK">Paystack (Default)</option>
                            <option value="FLUTTERWAVE">Flutterwave</option>
                        </select>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SMS/USSD Gateway</label>
                        <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white">
                            <option value="TERMII">Termii (Nigeria focus)</option>
                            <option value="AFRICASTALKING">Africa's Talking (Pan-African)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <button 
                    onClick={handleSave}
                    className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                    Save Configuration
                </button>
            </div>
        </div>
    );
};

export default TenantConfigPanel;
