import React, { useState } from 'react';
import { API_URL } from '../constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const HseComplianceView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'audits' | 'incidents' | 'journeys' | 'docs'>('audits');

    const { data, isLoading } = useQuery({
        queryKey: ['hse', 'compliance'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/hse/compliance`);
            return res.data;
        }
    });

    if (isLoading || !data) return <div className="p-6">Loading HSE data...</div>;

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-900">HSE & Compliance</h1>
                <button className="bg-green-600 hover:bg-green-700 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Export ISO 45001 Report
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button onClick={() => setActiveTab('audits')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'audits' ? 'text-primary border-b-2 border-primary' : 'text-slate-500'}`}>Safety Audits</button>
                <button onClick={() => setActiveTab('incidents')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'incidents' ? 'text-primary border-b-2 border-primary' : 'text-slate-500'}`}>Incident RCA</button>
                <button onClick={() => setActiveTab('journeys')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'journeys' ? 'text-primary border-b-2 border-primary' : 'text-slate-500'}`}>Journey Management</button>
                <button onClick={() => setActiveTab('docs')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'docs' ? 'text-primary border-b-2 border-primary' : 'text-slate-500'}`}>Compliance Docs</button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex-1 p-6">
                
                {activeTab === 'audits' && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-gray-900">Recent Audits</h2>
                        {data.audits.map((item: any) => (
                            <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-gray-900">{item.title}</h3>
                                        <p className="text-sm text-slate-500">Completed by {item.completedBy}</p>
                                    </div>
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold uppercase">{item.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'incidents' && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-gray-900">Incident Root Cause Analysis</h2>
                        {data.incidents.map((item: any) => (
                            <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-gray-900">{item.title}</h3>
                                        <p className="text-sm text-slate-500">Root Cause: {item.rootCause}</p>
                                    </div>
                                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded text-xs font-bold uppercase">{item.status}</span>
                                </div>
                                <button className="text-primary text-sm font-semibold">Add Corrective Action</button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'journeys' && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-gray-900">Journey Management Plans</h2>
                        {data.journeys.length === 0 ? (
                            <p className="text-slate-500">No high-risk routes pending approval.</p>
                        ) : (
                            data.journeys.map((item: any) => (
                                <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4">{item.title}</div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'docs' && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-gray-900">Expiring Documents</h2>
                        {data.docs.map((item: any) => (
                            <div key={item.id} className="border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-red-900 dark:text-red-300">{item.title}</h3>
                                        <p className="text-sm text-red-700 dark:text-red-400">{item.expiresIn}</p>
                                    </div>
                                    <button className="bg-red-600 text-gray-900 px-3 py-1 rounded text-xs font-bold">Renew Now</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default HseComplianceView;
