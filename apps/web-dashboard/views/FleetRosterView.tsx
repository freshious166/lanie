import React, { useState } from 'react';
import { API_URL } from '../constants';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AddVehicleModal } from '../components/AddVehicleModal';
import { AssignDriverModal } from '../components/AssignDriverModal';

const FleetRosterView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [assignModalVehicleId, setAssignModalVehicleId] = useState<string | null>(null);
    const [assignModalCurrentOwnerId, setAssignModalCurrentOwnerId] = useState<string | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data: roster = [], isLoading, isError } = useQuery({
        queryKey: ['vehicles'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/vehicles`);
            return data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`${API_URL}/vehicles/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
            setOpenDropdownId(null);
        }
    });

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading vehicles...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Failed to load vehicles from database.</div>;

    const filteredRoster = roster.filter((v: any) => {
        const search = searchTerm.toLowerCase();
        return (
            v.plateNumber?.toLowerCase().includes(search) ||
            v.make?.toLowerCase().includes(search) ||
            v.model?.toLowerCase().includes(search) ||
            v.vin?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="relative w-72">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input 
                        type="text" 
                        placeholder="Search vehicles, drivers..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:border-primary transition-colors text-slate-800 dark:text-gray-900"
                    />
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Add Vehicle
                </button>
            </div>
            
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse min-w-max">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <th className="px-6 py-4 font-medium">Vehicle</th>
                            <th className="px-6 py-4 font-medium">Driver</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Health</th>
                            <th className="px-6 py-4 font-medium">Last Ping</th>
                            <th className="px-6 py-4 font-medium">Insurance Exp.</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredRoster.map((v: any) => (
                            <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-900 dark:text-gray-900">{v.plateNumber}</span>
                                        <span className="text-xs text-slate-500">{v.make} {v.model}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                                            {v.owner?.fullName?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-sm text-slate-700 dark:text-slate-300">{v.owner?.fullName || 'Unassigned'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                                        v.status === 'Healthy' ? 'bg-green-100 text-green-700' :
                                        v.status === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {v.status || 'ACTIVE'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-2 h-2 rounded-full ${
                                            v.status === 'Healthy' ? 'bg-green-500' :
                                            v.status === 'Warning' ? 'bg-amber-500' : 'bg-red-500'
                                        }`}></div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">{v.status || 'GOOD'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                    {v.lastPingAt ? new Date(v.lastPingAt).toLocaleTimeString() : 'Never'}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                    {v.insuranceExp || '2027-01-01'}
                                </td>
                                <td className="px-6 py-4 text-right relative">
                                    <button 
                                        onClick={() => setOpenDropdownId(openDropdownId === v.id ? null : v.id)}
                                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                    </button>
                                    
                                    {openDropdownId === v.id && (
                                        <div className="absolute right-6 top-10 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-10">
                                            <button 
                                                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                                                onClick={() => {
                                                    setOpenDropdownId(null);
                                                    alert('View Details coming soon!');
                                                }}
                                            >
                                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                View
                                            </button>
                                            <button 
                                                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                                                onClick={() => {
                                                    setOpenDropdownId(null);
                                                    setAssignModalCurrentOwnerId(v.owner?.id || null);
                                                    setAssignModalVehicleId(v.id);
                                                }}
                                            >
                                                <span className="material-symbols-outlined text-[16px]">person_add</span>
                                                Assign Driver
                                            </button>
                                            <button 
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this vehicle?')) {
                                                        deleteMutation.mutate(v.id);
                                                    }
                                                }}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                                {deleteMutation.isPending ? '...' : 'Delete'}
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AddVehicleModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
            />

            <AssignDriverModal
                isOpen={!!assignModalVehicleId}
                onClose={() => setAssignModalVehicleId(null)}
                vehicleId={assignModalVehicleId}
                currentOwnerId={assignModalCurrentOwnerId}
            />
        </div>
    );
};

export default FleetRosterView;
