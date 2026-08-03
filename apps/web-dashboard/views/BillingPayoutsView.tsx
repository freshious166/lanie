import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../constants';

const BillingPayoutsView: React.FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['billing', 'dashboard'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/billing/dashboard`);
            return res.data;
        }
    });

    if (isLoading || !data) return <div className="p-6">Loading billing data...</div>;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-900">Billing & Commission</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium mb-1">Active Subscriptions (MRR)</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-gray-900">{formatCurrency(data.mrr)}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium mb-1">Pending Partner Payouts</p>
                    <p className="text-3xl font-bold text-amber-500">{formatCurrency(data.pendingPayouts)}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium mb-1">Total Commission Earned</p>
                    <p className="text-3xl font-bold text-green-500">{formatCurrency(data.commissionEarned)}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex-1 p-0 flex flex-col">
                <div className="p-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-900">Payout Ledger</h2>
                </div>
                <div className="overflow-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500">
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Vendor</th>
                                <th className="px-6 py-4 font-medium text-right">Gross Amount</th>
                                <th className="px-6 py-4 font-medium text-right text-green-600">Our Commission</th>
                                <th className="px-6 py-4 font-medium text-right">Net Payout</th>
                                <th className="px-6 py-4 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {data.ledgerHistory.length > 0 ? data.ledgerHistory.map((l: any) => (
                                <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {new Date(l.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-gray-900">
                                        {l.vendorName}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm">
                                        {formatCurrency(l.gross)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm text-green-600 font-medium">
                                        {formatCurrency(l.commission)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-semibold">
                                        {formatCurrency(l.net)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${l.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {l.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <span className="material-symbols-outlined text-4xl mb-2 text-slate-400">account_balance</span>
                                        <p>No payout history</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BillingPayoutsView;
