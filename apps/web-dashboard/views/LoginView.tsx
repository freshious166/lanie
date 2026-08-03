import React, { useState } from 'react';
import { API_URL } from '../constants';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginView: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('admin@laniefleet.com');
    const [password, setPassword] = useState('Password123');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
            localStorage.setItem('access_token', data.access_token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-4xl text-primary fill-1">directions_car</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-gray-900">LANIE Ops</h1>
                    <p className="text-sm text-slate-500 mt-2">Fleet Management Command Center</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="you@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                        <input 
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <div className="flex items-center justify-between pb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300 bg-white dark:bg-slate-900" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-primary font-medium hover:underline">Forgot password?</a>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 text-gray-900 font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center h-11"
                    >
                        {isLoading ? (
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginView;
