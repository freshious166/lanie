import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../constants';

interface AssignDriverModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleId: string | null;
    currentOwnerId: string | null;
}

export const AssignDriverModal: React.FC<AssignDriverModalProps> = ({ isOpen, onClose, vehicleId, currentOwnerId }) => {
    const [selectedUserId, setSelectedUserId] = useState<string>(currentOwnerId || '');
    const queryClient = useQueryClient();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/users`);
            return data;
        },
        enabled: isOpen
    });

    const assignMutation = useMutation({
        mutationFn: async (ownerId: string) => {
            await axios.patch(`${API_URL}/vehicles/${vehicleId}`, { ownerId: ownerId || null });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
            onClose();
        }
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Assign Driver</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center text-slate-500 py-4">Loading drivers...</div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Select Driver
                                </label>
                                <select 
                                    value={selectedUserId}
                                    onChange={e => setSelectedUserId(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-primary text-slate-800 dark:text-slate-200"
                                >
                                    <option value="">-- Unassigned --</option>
                                    {users.map((user: any) => (
                                        <option key={user.id} value={user.id}>
                                            {user.fullName || user.email} ({user.role})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => assignMutation.mutate(selectedUserId)}
                        disabled={assignMutation.isPending || isLoading}
                        className="px-4 py-2 text-sm font-semibold bg-primary hover:bg-primary/90 text-gray-900 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {assignMutation.isPending ? 'Saving...' : 'Save Assignment'}
                    </button>
                </div>
            </div>
        </div>
    );
};
