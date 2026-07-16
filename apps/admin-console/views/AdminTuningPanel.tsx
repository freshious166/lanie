import React, { useState } from 'react';

const AdminTuningPanel: React.FC = () => {
    const [fuelDropThreshold, setFuelDropThreshold] = useState('10');
    const [speedingPenalty, setSpeedingPenalty] = useState('2');
    const [harshBrakingPenalty, setHarshBrakingPenalty] = useState('5');

    const handleSave = () => {
        alert('Tuning parameters updated globally.');
    };

    return (
        <div className="flex flex-col h-full gap-6 p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ML & Intelligence Tuning Panel</h1>
            <p className="text-slate-500 mb-4">Adjust baseline thresholds for anomaly detection and risk scoring across all tenants.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-500">local_gas_station</span>
                        Fuel Anomaly Detection
                    </h2>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sudden Drop Threshold (%)</label>
                        <input 
                            type="number" 
                            value={fuelDropThreshold} 
                            onChange={(e) => setFuelDropThreshold(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white"
                        />
                        <p className="text-xs text-slate-500 mt-1">Triggers alert if fuel drops by this percentage in under 1 hour.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500">speed</span>
                        Driver Risk Scoring
                    </h2>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Speeding Event Penalty (pts)</label>
                        <input 
                            type="number" 
                            value={speedingPenalty} 
                            onChange={(e) => setSpeedingPenalty(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Harsh Braking Penalty (pts)</label>
                        <input 
                            type="number" 
                            value={harshBrakingPenalty} 
                            onChange={(e) => setHarshBrakingPenalty(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white"
                        />
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

export default AdminTuningPanel;
