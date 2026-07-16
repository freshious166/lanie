
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  name: string;
  vin: string;
  odometer: number;
  status: 'Healthy' | 'Service Due' | 'Urgent';
  color: 'green' | 'amber' | 'red';
  image: string;
  make: string;
  model: string;
  year: number;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: string;
  mileage: number;
  description: string;
  verified: boolean;
  cost?: number;
}

export interface Workshop {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: string;
  verified: boolean;
  services: { name: string; price: number; duration: string; description: string; icon: string }[];
}
