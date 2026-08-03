import React from 'react';
import { API_URL } from '../constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BiDashboardView: React.FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['intelligence', 'dashboard'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/intelligence/dashboard`);
            return res.data;
        }
    });

    const fuelCost = data?.fuelCost || 'Loading...';
    const highRiskVehicles = data?.highRiskVehicles || 0;
    const carbonEmissions = data?.carbonEmissions || 'Loading...';
    const utilization = data?.utilization || 'Loading...';

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-900">Executive BI Dashboard</h1>
                <button className="bg-primary hover:bg-primary/90 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">download</span>
                    Export PDF
                </button>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-t-4 border-t-amber-500">
                    <p className="text-sm text-slate-500 font-medium mb-1">Fuel Benchmarking</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-gray-900">{fuelCost}</p>
                    <p className="text-xs text-amber-500 font-semibold mt-2">↑ 2% vs last month</p>
                </div>
                
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-t-4 border-t-red-500">
                    <p className="text-sm text-slate-500 font-medium mb-1">High Risk Vehicles</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-gray-900">{highRiskVehicles}</p>
                    <p className="text-xs text-red-500 font-semibold mt-2">Predictive alerts active</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-t-4 border-t-primary">
                    <p className="text-sm text-slate-500 font-medium mb-1">Fleet Utilization</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-gray-900">{utilization}</p>
                    <p className="text-xs text-primary font-semibold mt-2">Optimal</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-t-4 border-t-green-500">
                    <p className="text-sm text-slate-500 font-medium mb-1">Carbon Emissions</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-gray-900">{carbonEmissions}</p>
                    <p className="text-xs text-green-500 font-semibold mt-2">↓ 5% vs last month</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-900 mb-4">Maintenance Forecasting</h2>
                    <div className="flex-1 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">trending_up</span>
                            <p className="text-slate-500">Cost-by-Component Graph rendering...</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-900 mb-4">Driver Risk Scorecard (Fleet Avg)</h2>
                    <div className="flex-1 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">speed</span>
                            <p className="text-slate-500">Driver risk distribution graph rendering...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BiDashboardView;
