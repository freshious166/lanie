import React from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../constants';
import { MapPolyline } from '../components/MapPolyline';

// Mock Initial Vehicles in Lagos, Nigeria
const MapView: React.FC = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

    const { data: vehicles = [] } = useQuery({
        queryKey: ['vehicles-telemetry'],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/vehicles`);
            return data;
        },
        refetchInterval: 3000,
    });

    const activeVehicles = vehicles.length;
    const activeAlerts = vehicles.filter((v: any) => v.status === 'Warning').length;
    const breakdowns = vehicles.filter((v: any) => v.status === 'Critical').length;
    
    const movingVehicles = vehicles.filter((v: any) => v.currentSpeed && v.currentSpeed > 0);
    const avgSpeed = movingVehicles.length > 0 
        ? Math.round(movingVehicles.reduce((sum: number, v: any) => sum + Number(v.currentSpeed), 0) / movingVehicles.length) 
        : 0;

    const recentAlerts = vehicles.filter((v: any) => v.status === 'Warning' || v.status === 'Critical').slice(0, 4);

    return (
        <div className="w-full h-full flex flex-col z-0 relative">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">directions_car</span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Active Vehicles</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-gray-900">{activeVehicles}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">warning</span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Active Alerts</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-gray-900">{activeAlerts}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">speed</span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Avg Speed</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-gray-900">{avgSpeed} km/h</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                        <span className="material-symbols-outlined">car_crash</span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Breakdowns</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-gray-900">{breakdowns}</p>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative min-h-[400px]">
                {apiKey ? (
                    <APIProvider apiKey={apiKey}>
                        <Map 
                            defaultCenter={{ lat: 6.5244, lng: 3.3792 }} 
                            defaultZoom={13} 
                            mapId="DEMO_MAP_ID"
                            disableDefaultUI={true}
                        >
                            {vehicles.filter((v: any) => v.currentLat && v.currentLng).map((vehicle: any) => (
                                <React.Fragment key={vehicle.id}>
                                    <AdvancedMarker 
                                        position={{ lat: Number(vehicle.currentLat), lng: Number(vehicle.currentLng) }}
                                    >
                                        <div className="w-8 h-8 bg-primary text-gray-900 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800 cursor-pointer group">
                                            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                                            <div className="absolute bottom-full mb-2 hidden group-hover:block w-32 bg-white dark:bg-slate-900 p-2 rounded-lg shadow-xl text-center pointer-events-none z-50">
                                                <p className="text-xs font-bold text-slate-800 dark:text-white">{vehicle.plateNumber}</p>
                                                <p className="text-xs text-slate-500 mt-1">{vehicle.currentSpeed || 0} km/h</p>
                                            </div>
                                        </div>
                                    </AdvancedMarker>
                                    
                                    {/* Render historical tracking breadcrumb trail */}
                                    {vehicle.telemetryHistory && vehicle.telemetryHistory.length > 1 && (
                                        <MapPolyline 
                                            points={vehicle.telemetryHistory.map((pt: any) => ({ lat: Number(pt.lat), lng: Number(pt.lng) }))} 
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </Map>
                    </APIProvider>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined text-6xl mb-4 opacity-50">map</span>
                        <p className="font-medium">Live Map requires Google Maps API Key</p>
                        <p className="text-sm mt-2 opacity-75">Please configure VITE_GOOGLE_MAPS_API_KEY in your Vercel settings</p>
                    </div>
                )}
                
                {/* Overlays */}
                <div className="absolute top-4 right-4 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-3 w-64 pointer-events-none">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-gray-900 mb-2">Recent Alerts</h3>
                    <div className="space-y-2">
                        {recentAlerts.length > 0 ? (
                            recentAlerts.map((alert: any) => (
                                <div key={alert.id} className="flex items-start gap-2 text-xs">
                                    <span className={`material-symbols-outlined text-[16px] ${alert.status === 'Critical' ? 'text-red-500' : 'text-amber-500'}`}>
                                        {alert.status === 'Critical' ? 'error' : 'warning'}
                                    </span>
                                    <span className="text-slate-600 dark:text-slate-400">
                                        {alert.status === 'Critical' ? 'Breakdown reported for' : 'Warning alert for'} {alert.plateNumber}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-xs text-slate-500">No active alerts detected.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapView;
