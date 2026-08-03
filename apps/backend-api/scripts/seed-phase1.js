const axios = require('axios');

async function seed() {
    const API_URL = 'https://lanie.onrender.com';
    let attempts = 0;

    while (attempts < 10) {
        try {
            console.log(`Seeding HSE... (Attempt ${attempts + 1})`);
            const hseRes = await axios.post(`${API_URL}/hse/seed`);
            console.log('HSE Seed Result:', hseRes.data);

            console.log('Seeding Supply Chain...');
            const scRes = await axios.post(`${API_URL}/shipments/seed`);
            console.log('Supply Chain Seed Result:', scRes.data);

            console.log('Phase 1 Seeding Complete.');
            return; // Exit on success
        } catch (e) {
            console.error('Error seeding (waiting for deploy):', e.response?.data || e.message);
            attempts++;
            await new Promise(r => setTimeout(r, 15000));
        }
    }
}

seed();
