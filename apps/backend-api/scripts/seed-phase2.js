const axios = require('axios');

async function seed() {
    const API_URL = 'https://lanie.onrender.com';
    let attempts = 0;

    while (attempts < 10) {
        try {
            console.log(`Seeding Billing... (Attempt ${attempts + 1})`);
            const billingRes = await axios.post(`${API_URL}/billing/seed`);
            console.log('Billing Seed Result:', billingRes.data);

            console.log('Seeding Job Disputes...');
            const disputesRes = await axios.post(`${API_URL}/job-disputes/seed`);
            console.log('Disputes Seed Result:', disputesRes.data);

            console.log('Phase 2 Seeding Complete.');
            return; // Exit on success
        } catch (e) {
            console.error('Error seeding (waiting for deploy):', e.response?.data || e.message);
            attempts++;
            await new Promise(r => setTimeout(r, 15000));
        }
    }
}

seed();
