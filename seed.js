const axios = require('axios');

const API_URL = 'http://localhost:3002';

async function seedDatabase() {
    try {
        console.log('Seeding Users...');
        await axios.post(`${API_URL}/auth/register`, {
            email: 'admin@laniefleet.com',
            password: 'password123',
            fullName: 'Admin User',
            role: 'SUPER_ADMIN'
        });

        console.log('Seeding Vehicles...');
        const vehicles = [
            { vin: 'VIN1234567890ABCDE', plateNumber: 'KJA-123-XY', make: 'Toyota', model: 'Hilux', year: 2022 },
            { vin: 'VIN0987654321VWXYZ', plateNumber: 'LSD-999-AB', make: 'Ford', model: 'Transit', year: 2021 },
            { vin: 'VIN4567890123QWERT', plateNumber: 'ABJ-456-YZ', make: 'Mitsubishi', model: 'L200', year: 2023 },
            { vin: 'VIN7890123456ASDFG', plateNumber: 'PHC-789-QW', make: 'Toyota', model: 'Hiace', year: 2020 }
        ];

        for (const v of vehicles) {
            await axios.post(`${API_URL}/vehicles`, v);
        }

        console.log('Seeding complete!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seedDatabase();
