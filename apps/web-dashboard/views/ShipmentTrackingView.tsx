import React from 'react';
import { API_URL } from '../constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const ShipmentTrackingView: React.FC = () => {
    const { data: shipments, isLoading } = useQuery({
        queryKey: ['shipments'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/shipments`);
            return res.data;
        }
    });

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-900">Supply Chain & Load Planning</h1>
                <button className="bg-primary hover:bg-primary/90 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">add</span>
                    New Shipment
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* Active Shipments */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-900 mb-4">Active Deliveries</h2>
                    
                    {isLoading ? (
                        <p className="text-slate-500">Loading shipments...</p>
                    ) : shipments && shipments.length > 0 ? (
                        shipments.map((shipment: any) => (
                            <div key={shipment.id} className={`border rounded-lg p-4 mb-4 ${shipment.status === 'EXCEPTION' ? 'border-red-200 bg-red-50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className={`font-bold ${shipment.status === 'EXCEPTION' ? 'text-red-900 dark:text-red-300' : 'text-slate-900 dark:text-gray-900'}`}>
                                            {shipment.trackingNumber} <span className={`text-sm font-normal ml-2 ${shipment.status === 'EXCEPTION' ? 'text-red-700' : 'text-slate-500'}`}>{shipment.origin?.contactInfo}</span>
                                        </h3>
                                        <p className={`text-sm mt-1 ${shipment.status === 'EXCEPTION' ? 'text-red-700' : 'text-slate-500'}`}>
                                            {shipment.origin?.address} → {shipment.destination?.address}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${shipment.status === 'EXCEPTION' ? 'bg-red-200 text-red-800' : 'bg-blue-100 text-blue-700'}`}>
                                        {shipment.status}
                                    </span>
                                </div>

                                {shipment.status !== 'EXCEPTION' && (
                                    <>
                                        {/* Status Timeline */}
                                        <div className="flex items-center text-sm text-slate-500 gap-2 mb-4">
                                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                                            <span>Picked Up</span>
                                            <div className="h-[2px] bg-slate-200 flex-1 mx-2"></div>
                                            <span className="material-symbols-outlined text-blue-500 animate-pulse">local_shipping</span>
                                            <span className="font-bold text-slate-900 dark:text-gray-900">In Transit</span>
                                            <div className="h-[2px] bg-slate-200 flex-1 mx-2"></div>
                                            <span className="material-symbols-outlined text-slate-300">inventory_2</span>
                                            <span>Delivered</span>
                                        </div>
                                        
                                        <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                                            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                                <span className="material-symbols-outlined text-sm">ac_unit</span>
                                                Cold Chain: <span className="font-semibold text-green-600">{shipment.temperatureLogs?.[0]?.temp}°C ({shipment.temperatureLogs?.[0]?.status})</span>
                                            </div>
                                            <button className="text-primary text-sm font-semibold">Copy Public Tracking Link</button>
                                        </div>
                                    </>
                                )}

                                {shipment.status === 'EXCEPTION' && (
                                    <div className="flex items-center gap-2 text-sm text-red-800">
                                        <span className="material-symbols-outlined">warning</span>
                                        <span className="font-semibold">{shipment.temperatureLogs?.[0]?.status}: {shipment.temperatureLogs?.[0]?.temp}°C</span>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500">No active deliveries found.</p>
                    )}
                </div>

                {/* Load Planning Side */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-900 mb-4">Load Planning</h2>
                    
                    <div className="flex-1 flex flex-col gap-3">
                        <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <p className="font-semibold text-slate-900 dark:text-gray-900 text-sm">Unassigned Shipment: Retail Restock</p>
                            <p className="text-xs text-slate-500 mt-1">Capacity required: 2.5 Tons</p>
                            <button className="mt-3 text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 px-3 py-1 rounded font-medium">Assign Vehicle</button>
                        </div>
                        <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                            <p className="font-semibold text-slate-900 dark:text-gray-900 text-sm">Unassigned Shipment: Medical Supplies</p>
                            <p className="text-xs text-slate-500 mt-1">Requires Reefer (Cold Chain)</p>
                            <button className="mt-3 text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 px-3 py-1 rounded font-medium">Assign Vehicle</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipmentTrackingView;
