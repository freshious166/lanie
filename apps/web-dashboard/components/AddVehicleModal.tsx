import React, { useState } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../constants';

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        vin: '',
        plateNumber: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post(`${API_URL}/vehicles`, formData);
            await queryClient.invalidateQueries({ queryKey: ['vehicles'] });
            setFormData({ vin: '', plateNumber: '', make: '', model: '', year: new Date().getFullYear() });
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add vehicle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add New Vehicle</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Make</label>
                        <input required type="text" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Model</label>
                        <input required type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Year</label>
                            <input required type="number" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Plate Number</label>
                            <input required type="text" value={formData.plateNumber} onChange={e => setFormData({...formData, plateNumber: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-primary" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">VIN</label>
                        <input required type="text" value={formData.vin} onChange={e => setFormData({...formData, vin: e.target.value})} className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-primary" />
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-primary hover:bg-primary/90 text-gray-900 rounded-lg font-semibold transition-colors disabled:opacity-50">
                            {loading ? 'Adding...' : 'Add Vehicle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
