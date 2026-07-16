
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../services/db';
import { User } from '../types';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email
    };
    db.saveUser(newUser);
    db.setActiveUser(newUser);
    navigate('/garage');
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 bg-background-light dark:bg-background-dark">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Join LaineFleet</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Start managing your personal garage</p>
        </div>

        <form onSubmit={handleSignup} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-600 dark:text-slate-300">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-1 block w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-card-dark text-slate-900 dark:text-white focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-600 dark:text-slate-300">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-card-dark text-slate-900 dark:text-white focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-600 dark:text-slate-300">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-card-dark text-slate-900 dark:text-white focus:ring-primary"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-primary hover:bg-primary/90"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
