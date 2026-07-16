
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../services/db';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = db.getUsers();
    const user = users.find(u => u.email === email);
    
    // For demo purposes, any password works if email exists
    if (user) {
      db.setActiveUser(user);
      navigate('/garage');
    } else {
      setError('User not found. Try signing up.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 bg-background-light dark:bg-background-dark">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary mb-4 text-white">
            <span className="material-symbols-outlined text-4xl">directions_car</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">LaineFleet</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your fleet with precision</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-600 dark:text-slate-300">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-card-dark text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                placeholder="driver@lainefleet.com"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-600 dark:text-slate-300">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-card-dark text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button 
            type="submit"
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          New to LaineFleet?{' '}
          <Link to="/signup" className="font-bold text-primary hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
};
