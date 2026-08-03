import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../constants';

const JobDisputesView: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: disputes, isLoading } = useQuery({
        queryKey: ['job-disputes'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/job-disputes`);
            return res.data;
        }
    });

    const resolveMutation = useMutation({
        mutationFn: async ({ id, status, notes }: { id: string, status: string, notes: string }) => {
            await axios.put(`${API_URL}/job-disputes/${id}/resolve`, { status, notes });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['job-disputes'] });
        }
    });

    if (isLoading) return <div className="p-6">Loading disputes...</div>;

    return (
        <div className="flex flex-col h-full gap-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-900">Job Disputes</h1>
            
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500">
                            <th className="px-6 py-4 font-medium">Job ID</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Customer</th>
                            <th className="px-6 py-4 font-medium">Partner</th>
                            <th className="px-6 py-4 font-medium w-1/3">Reason</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {disputes && disputes.length > 0 ? disputes.map((d: any) => (
                            <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-gray-900">
                                    {d.jobId}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${d.status === 'OPEN' ? 'bg-red-100 text-red-700' : d.status === 'IN_REVIEW' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                        {d.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                    {d.customer?.firstName || 'User'} {d.customer?.lastName}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                    {d.vendor?.businessName || 'Unknown Vendor'}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-300">
                                    {d.reason}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {d.status !== 'RESOLVED_CUSTOMER' && d.status !== 'RESOLVED_VENDOR' && d.status !== 'REFUNDED' && (
                                        <>
                                            <button 
                                                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded"
                                                onClick={() => resolveMutation.mutate({ id: d.id, status: 'RESOLVED_CUSTOMER', notes: 'Resolved in favor of customer' })}
                                            >
                                                Side with Customer
                                            </button>
                                            <button 
                                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded"
                                                onClick={() => resolveMutation.mutate({ id: d.id, status: 'RESOLVED_VENDOR', notes: 'Resolved in favor of vendor' })}
                                            >
                                                Side with Vendor
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    No active disputes. Good job!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobDisputesView;
