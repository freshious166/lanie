
export interface Vehicle {
  id: string;
  name: string;
  model: string;
  licensePlate: string;
  status: 'Healthy' | 'Needs Attention' | 'Warning';
  imageUrl: string;
  vin: string;
  mileage: number;
  nextServiceMileage: number;
  value: string;
}

export interface Workshop {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  address: string;
  distance: string;
  hours: string;
  isVerified: boolean;
  imageUrl: string;
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
  icon: string;
}

export interface HistoryEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  mileage: string;
  type: 'maintenance' | 'accident' | 'ownership' | 'log';
  isVerified?: boolean;
  details?: string;
}
