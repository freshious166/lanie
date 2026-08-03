import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: 'Live Map', icon: 'map', path: '/dashboard' },
        { name: 'Fleet Roster', icon: 'directions_car', path: '/roster' },
        { name: 'Maintenance', icon: 'build', path: '/maintenance' },
        { name: 'Partner Verification', icon: 'verified_user', path: '/verification' },
        { name: 'Billing & Payouts', icon: 'payments', path: '/billing' },
        { name: 'Job Disputes', icon: 'gavel', path: '/disputes' },
        { name: 'Supply Chain', icon: 'local_shipping', path: '/supply-chain' },
        { name: 'BI Dashboard', icon: 'insights', path: '/bi-dashboard' },
        { name: 'HSE Compliance', icon: 'health_and_safety', path: '/hse' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-colors shadow-sm z-10">
                <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-xl font-bold text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary fill-1">directions_car</span>
                        LANIE Ops
                    </span>
                </div>
                
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                    isActive 
                                    ? 'bg-primary/10 text-primary font-semibold' 
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                            >
                                <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-gray-900 truncate">John Doe</p>
                            <p className="text-xs text-slate-500 truncate">Fleet Manager</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shadow-sm z-10">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-900">
                        {menuItems.find(m => location.pathname.startsWith(m.path))?.name || 'Dashboard'}
                    </h2>
                    
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-gray-900 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>
                
                <div className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
