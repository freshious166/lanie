const axios = require('axios');

const API_URL = 'http://localhost:3002';

async function seedShipments() {
    try {
        console.log('Seeding Shipments...');
        const shipments = [
            {
                trackingNumber: 'SHP-8472-X',
                origin: { address: 'Lagos', contactInfo: 'FMCG Distributors Ltd' },
                destination: { address: 'Ibadan' },
                status: 'IN_TRANSIT',
                temperatureLogs: [{ temp: -18.2, status: 'Optimal' }]
            },
            {
                trackingNumber: 'SHP-9102-Y',
                origin: { address: 'Abuja', contactInfo: 'PharmaCare NG' },
                destination: { address: 'Kano' },
                status: 'EXCEPTION',
                temperatureLogs: [{ temp: -12.0, status: 'Breach Detected' }]
            }
        ];

        for (const s of shipments) {
            await axios.post(`${API_URL}/shipments`, s);
        }

        console.log('Seeding shipments complete!');
    } catch (error) {
        console.error('Error seeding shipments:', error);
    }
}

seedShipments();
