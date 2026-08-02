const axios = require('axios');

async function seed() {
    const API_URL = 'https://lanie.onrender.com';

    const vendors = [
        {
            businessName: 'Autolab Mechanics',
            email: 'contact@autolab.com',
            phoneNumber: '08012345678',
            address: '14 Allen Avenue',
            city: 'Ikeja',
            state: 'Lagos',
            primaryCategory: 'GENERAL_MECHANIC'
        },
        {
            businessName: 'Speedy Towing Service',
            email: 'hello@speedytowing.com',
            phoneNumber: '08123456789',
            address: '22 Lekki Epe Express',
            city: 'Lekki',
            state: 'Lagos',
            primaryCategory: 'TOWING'
        },
        {
            businessName: 'Elite Bodywork Shop',
            email: 'elite@bodyworks.com',
            phoneNumber: '08098765432',
            address: '5 Bode Thomas St',
            city: 'Surulere',
            state: 'Lagos',
            primaryCategory: 'BODY_SHOP'
        }
    ];

    try {
        console.log('Seeding vendors...');
        for (const v of vendors) {
            const res = await axios.post(`${API_URL}/vendors`, v);
            console.log(`Created vendor: ${res.data.businessName} [${res.data.status}]`);
        }
        console.log('Done seeding vendors.');
    } catch (e) {
        console.error('Error seeding vendors:', e.response?.data || e.message);
    }
}

seed();
