
import { User, Vehicle, ServiceRecord } from '../types';

const STORAGE_KEYS = {
  USERS: 'lf_users',
  ACTIVE_USER: 'lf_active_user',
  VEHICLES: 'lf_vehicles',
  RECORDS: 'lf_records'
};

const createSafeStorage = () => {
  const memoryStore: Record<string, string> = {};
  
  const getPersistentStorage = (): Storage | null => {
    try {
      // Accessing the property itself can throw a SecurityError in some sandboxes
      const s = window['localStorage'];
      if (s) {
        s.setItem('__test__', '1');
        s.removeItem('__test__');
        return s;
      }
    } catch (e) {
      console.warn('LaineFleet: Persistent storage access blocked. Falling back to memory.');
    }
    return null;
  };

  const storage = getPersistentStorage();

  return {
    getItem: (key: string): string | null => {
      try {
        if (storage) return storage.getItem(key);
      } catch (e) {}
      return memoryStore[key] || null;
    },
    setItem: (key: string, value: string): void => {
      try {
        if (storage) {
          storage.setItem(key, value);
          return;
        }
      } catch (e) {}
      memoryStore[key] = value;
    },
    removeItem: (key: string): void => {
      try {
        if (storage) {
          storage.removeItem(key);
          return;
        }
      } catch (e) {}
      delete memoryStore[key];
    }
  };
};

const safeStorage = createSafeStorage();

const safeJsonParse = (data: string | null, fallback: any) => {
  if (!data) return fallback;
  try {
    return JSON.parse(data);
  } catch (e) {
    return fallback;
  }
};

export const db = {
  getUsers: (): User[] => safeJsonParse(safeStorage.getItem(STORAGE_KEYS.USERS), []),
  
  saveUser: (user: User) => {
    const users = db.getUsers();
    safeStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...users, user]));
  },

  setActiveUser: (user: User | null) => {
    if (user) safeStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
    else safeStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
  },

  getActiveUser: (): User | null => {
    const data = safeStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    return safeJsonParse(data, null);
  },

  getVehicles: (userId: string): Vehicle[] => {
    const all = safeJsonParse(safeStorage.getItem(STORAGE_KEYS.VEHICLES), []);
    const userVehicles = all.filter((v: Vehicle) => v.userId === userId);
    
    if (userVehicles.length === 0 && all.length === 0) {
      const initial: Vehicle[] = [
        { id: '1', userId, name: "2023 Porsche 911 GT3", make: "Porsche", model: "911 GT3", year: 2023, vin: "WP0AA2A9...", odometer: 5240, status: "Healthy", color: "green", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800" },
        { id: '2', userId, name: "2021 Tesla Model 3", make: "Tesla", model: "Model 3", year: 2021, vin: "5YJ3E1EA...", odometer: 18450, status: "Service Due", color: "amber", image: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=800" },
        { id: '3', userId, name: "2020 Land Rover Defender", make: "Land Rover", model: "Defender", year: 2020, vin: "SALGS2EV...", odometer: 32110, status: "Healthy", color: "green", image: "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?auto=format&fit=crop&q=80&w=800" }
      ];
      safeStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify([...all, ...initial]));
      return initial;
    }
    return userVehicles;
  },

  getServiceRecords: (vehicleId: string): ServiceRecord[] => {
    const all = safeJsonParse(safeStorage.getItem(STORAGE_KEYS.RECORDS), []);
    const records = all.filter((r: ServiceRecord) => r.vehicleId === vehicleId);

    if (records.length === 0) {
        const initial: ServiceRecord[] = [
            { id: 'r1', vehicleId, date: '2024-03-15', type: 'Annual Inspection', mileage: 27100, description: 'Full vehicle health check, tire rotation, and cabin filter replacement.', verified: true },
            { id: 'r2', vehicleId, date: '2023-11-10', type: 'Brake Pad Replacement', mileage: 22400, description: 'Rear ceramic brake pads replaced. Brake fluid flush performed.', verified: true }
        ];
        return initial;
    }
    return records;
  }
};
