export interface Vehicle {
    id: string;
    name: string;
    model: string;
    licensePlate: string;
    status: 'Healthy' | 'Needs Attention' | 'Warning';
    imageUrl: any;
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
    imageUrl: any;
    services: Service[];
    latitude: number;
    longitude: number;
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

export const COLORS = {
    primary: '#3B82F6',
    background: '#0D1117',
    surface: '#161C26',
    surfaceAccent: '#1E2A3A',
    textPrimary: '#FFFFFF',
    textSecondary: '#92a9c9',
    textMuted: '#324867',
    border: 'rgba(255,255,255,0.08)',
    amber: '#F59E0B',
    green: '#22C55E',
    red: '#EF4444',
};

export const MOCK_VEHICLES: Vehicle[] = [
    {
        id: '1',
        name: '2022 BMW X5',
        model: 'xDrive40i',
        licensePlate: 'ABC-1234',
        status: 'Healthy',
        imageUrl: require('../assets/images/bmw_x5.png'),
        vin: 'BMW-X5-2022-VIN',
        mileage: 45230,
        nextServiceMileage: 48000,
        value: '$21.4k',
    },
    {
        id: '2',
        name: '2019 Tesla Model 3',
        model: 'Dual Motor',
        licensePlate: 'XYZ-9876',
        status: 'Healthy',
        imageUrl: require('../assets/images/tesla_model_3.png'),
        vin: 'TSLA-M3-2019-VIN',
        mileage: 52100,
        nextServiceMileage: 55000,
        value: '$28.5k',
    },
];

export const MOCK_WORKSHOPS: Workshop[] = [
    {
        id: '1',
        name: 'Elite Auto Care',
        description: 'Full service garage specializing in European models.',
        rating: 4.9,
        reviewCount: 124,
        address: '123 Mechanic St, Brooklyn, NY 11201',
        distance: '0.8 mi',
        hours: 'Open until 7 PM',
        isVerified: true,
        imageUrl: require('../assets/images/workshop_interior.png'),
        services: [
            { id: 's1', name: 'Standard Oil Change', duration: '45-60 min', price: '$50.00', icon: 'oil-barrel' },
            { id: 's2', name: 'Tire Rotation & Balance', duration: '30 min', price: '$40.00', icon: 'tire' },
            { id: 's3', name: 'Brake Inspection', duration: '20 min', price: '$25.00', icon: 'car' },
        ],
        latitude: 6.5967,
        longitude: 3.3444,
    },
    {
        id: '2',
        name: 'Premier BMW Service',
        description: 'Certified dealer with genuine parts.',
        rating: 4.7,
        reviewCount: 89,
        address: '456 Dealer Way, New York, NY 10001',
        distance: '1.4 mi',
        hours: 'Open Now',
        isVerified: true,
        imageUrl: require('../assets/images/workshop_interior.png'),
        services: [],
        latitude: 6.6018,
        longitude: 3.3515,
    },
    {
        id: '3',
        name: 'Rapid Tow & Recovery',
        description: '24/7 Roadside assistance and towing.',
        rating: 4.5,
        reviewCount: 230,
        address: '789 Rescue Rd, Queens, NY 11101',
        distance: '2.1 mi',
        hours: 'Available 24/7',
        isVerified: true,
        imageUrl: require('../assets/images/towing_truck.png'),
        services: [],
        latitude: 6.4311,
        longitude: 3.4831,
    },
];

export const MOCK_HISTORY: HistoryEvent[] = [
    {
        id: 'h1',
        title: 'Mileage Logged',
        date: 'Today',
        description: 'Odometer updated via LaineFleet Sync',
        mileage: '45,230 mi',
        type: 'log',
    },
    {
        id: 'h2',
        title: 'Oil Change',
        date: 'Oct 12, 2023',
        description: 'Shell Service Station • Downtown',
        mileage: '42,100 mi',
        type: 'maintenance',
        isVerified: true,
    },
    {
        id: 'h3',
        title: 'Minor Accident Reported',
        date: 'Aug 05, 2023',
        description: 'Front-end collision. Damage to bumper and grill reported by insurance provider.',
        mileage: '38,450 mi',
        type: 'accident',
        details: 'View Details',
    },
    {
        id: 'h4',
        title: 'New Tires Installed',
        date: 'May 14, 2023',
        description: 'Michelin Pilot Sport 4S (Full Set)',
        mileage: '35,200 mi',
        type: 'maintenance',
        isVerified: true,
    },
    {
        id: 'h5',
        title: 'Ownership Transfer',
        date: 'Jan 10, 2022',
        description: 'Vehicle purchased as "Certified Pre-Owned"',
        mileage: '12,400 mi',
        type: 'ownership',
    },
];
