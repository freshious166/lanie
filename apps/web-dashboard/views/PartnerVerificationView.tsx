import React from 'react';
import { API_URL } from '../constants';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const PartnerVerificationView: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: queue = [], isLoading } = useQuery({
        queryKey: ['vendors', 'pending'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/vendors?isVerified=false`);
            // Filter locally just in case, though we could pass it in query if backend supports it
            return data.filter((v: any) => v.status === 'PENDING');
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status, isVerified }: { id: string, status: string, isVerified: boolean }) => {
            await axios.patch(`${API_URL}/vendors/${id}`, { status, isVerified });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendors', 'pending'] });
        }
    });

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        if (action === 'approve') {
            updateStatusMutation.mutate({ id, status: 'VERIFIED', isVerified: true });
        } else {
            updateStatusMutation.mutate({ id, status: 'REJECTED', isVerified: false });
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-900 mb-6">Partner Verification Queue</h1>
            
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500">
                            <th className="px-6 py-4 font-medium">Partner Name</th>
                            <th className="px-6 py-4 font-medium">Category</th>
                            <th className="px-6 py-4 font-medium">Submitted</th>
                            <th className="px-6 py-4 font-medium">Documents</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {isLoading && (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading pending vendors...</td></tr>
                        )}
                        {queue.map((partner: any) => (
                            <tr key={partner.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-slate-900 dark:text-gray-900">{partner.businessName}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                    {partner.primaryCategory?.replace('_', ' ') || 'UNKNOWN'}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                    {new Date(partner.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {[
                                            partner.cacDocumentUrl && 'CAC',
                                            partner.idDocumentUrl && 'ID',
                                            partner.addressProofUrl && 'Address Proof'
                                        ].filter(Boolean).map(doc => (
                                            <span key={doc} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">
                                                {doc}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleAction(partner.id, 'reject')} className="px-3 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg">Reject</button>
                                        <button onClick={() => handleAction(partner.id, 'approve')} className="px-3 py-1.5 text-sm text-gray-900 bg-primary hover:bg-primary/90 rounded-lg">Approve</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {queue.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No pending verifications
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PartnerVerificationView;
