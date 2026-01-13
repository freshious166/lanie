
import { Vehicle, Workshop, HistoryEvent } from './types';

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: '1',
    name: '2022 BMW X5',
    model: 'xDrive40i',
    licensePlate: 'ABC-1234',
    status: 'Healthy',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlgipqPrOvR4br47DCmTgFSO1OugUGCNNI8Y6AMTAZyQu01i5sax6iKLIjsZOyaygY9AmWr83nJdG_4iPLN-p4iCxOehjLb2VXGvujwu5dadEhradNlWx4CG868DVKbMxmpv4wgPulmcNavlGTlMrxhIs2vDwm6usmoUS-x5RwGGxpk4A-8p_KcRDBQa2zXAGmaOoKesIURewzy6rRyf94EZ78MWaThJU_7xIHJWFa8HuLdsXEyfOc_TrNc1nYaE8OciJRUYWrS_k',
    vin: 'BMW-X5-2022-VIN',
    mileage: 45230,
    nextServiceMileage: 48000,
    value: '$21.4k'
  },
  {
    id: '2',
    name: '2019 Tesla Model 3',
    model: 'Dual Motor',
    licensePlate: 'XYZ-9876',
    status: 'Healthy',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQKrzdgoRO-vI39sZ1ZYQdtoQnOp6jxJLOVhMRlvhlJf5pY1dy5hT_7jEXLp8P9AnRWGU9_YjaK5tpXPuXv_rrHUMy3TOgHv2fZEZOacKVq1lywa0Di5kJQC--qhz6712dyBjfaYfy6lUM0azpZBpNnXLwgspXunzQORTGHvts3RJtbS5uK5jTIpfIH1SzqoDFAO7ydMBqXGJS3DsbSOzJvsfnWah4drn3V-wmcUKBvNKaFGnfYqusl-12hVrx3jWNuGuJOup9cI0',
    vin: 'TSLA-M3-2019-VIN',
    mileage: 52100,
    nextServiceMileage: 55000,
    value: '$28.5k'
  }
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
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmws4hLiH1IjTywsk0128tG3CyND4DU1-gB8nVFi7AvdjIQm_S5XtrlEHD_puGHRwEBP01buVE1kuB196V6iI_9iARYIY7fUCp3E9k7S9O_Xguswe5WTWAxMWa56OGkZjn_IAu0vJPBkqIvTajat0_hcRW1EmpvCdyupPHsxou13Z_XW0gPkv1o6f2W6WD_04HGlwDoydQSc1I_z6lwZPtjV5_iGw-bzKTwfnzjZYOE7ZTXTOid2dPt5I2UOJhUm-PmjNfAkRT1OQ',
    services: [
      { id: 's1', name: 'Standard Oil Change', duration: '45-60 min', price: '$50.00', icon: 'oil_barrel' },
      { id: 's2', name: 'Tire Rotation & Balance', duration: '30 min', price: '$40.00', icon: 'tire_repair' },
      { id: 's3', name: 'Brake Inspection', duration: '20 min', price: '$25.00', icon: 'car_repair' }
    ]
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
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUNo_MvOlix77qsqzCUe3uFuYNOMluBUbBLBwV-oxxGThUW0CQHgdS7bXddxQwVD3XNVV0o4gxPqwkt2zXcA--vKZYxfz3_dVuas-CORNAwkVWPPvWfgcUCY0FMfVBQVbd11PC4Q5sOQ2Ocx1I2h4eh-bwUDnWx68KjSPwBBtkDb8ohzztS7ZSab6ure_RXDEfuGJ9peApvgV46Fco8E-WWq6gx8CxcHXzVysWwhzeLO2BtgFrSAgrjfAkaOi3YL_ewHIJVpRGyjE',
    services: []
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
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5mV5mEYcpYGlTi-o84ZtTawoUmBGKbah24ba5vlztCZcpXr35EXueKdDdPOd07_-m1BKjZHoXVHm3WwyXJ77Lyn98Ub20ECMdnRxyUJ5yzKq33a7V7w98N-MGrtWM9YQT-tDmE21Gp-W3EoThARrhP5Qr1zXjZrhc8oG3EPbYYUvlRJ_weox6HQxUK3Mf4YcqJUNZVUozzTb3Apgds0c-rq7hsrzG2tIzqM08nI_M91_dpEFKxn6XWZOlgnyBwuVtefUuKd3SVpM',
    services: []
  }
];

export const MOCK_HISTORY: HistoryEvent[] = [
  {
    id: 'h1',
    title: 'Mileage Logged',
    date: 'Today',
    description: 'Odometer updated via LaineFleet Sync',
    mileage: '45,230 mi',
    type: 'log'
  },
  {
    id: 'h2',
    title: 'Oil Change',
    date: 'Oct 12, 2023',
    description: 'Shell Service Station • Downtown',
    mileage: '42,100 mi',
    type: 'maintenance',
    isVerified: true
  },
  {
    id: 'h3',
    title: 'Minor Accident Reported',
    date: 'Aug 05, 2023',
    description: 'Front-end collision. Damage to bumper and grill reported by insurance provider.',
    mileage: '38,450 mi',
    type: 'accident',
    details: 'View Details'
  },
  {
    id: 'h4',
    title: 'New Tires Installed',
    date: 'May 14, 2023',
    description: 'Michelin Pilot Sport 4S (Full Set)',
    mileage: '35,200 mi',
    type: 'maintenance',
    isVerified: true
  },
  {
    id: 'h5',
    title: 'Ownership Transfer',
    date: 'Jan 10, 2022',
    description: 'Vehicle purchased as "Certified Pre-Owned"',
    mileage: '12,400 mi',
    type: 'ownership'
  }
];
