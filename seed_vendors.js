const axios = require('axios');

const API_URL = 'http://localhost:3002';

async function seedVendors() {
    try {
        console.log('Seeding Vendors...');
        const vendors = [
            {
                businessName: 'Auto Fix Pro',
                email: 'contact@autofixpro.com',
                phoneNumber: '08012345678',
                address: '123 Lekki Expressway',
                city: 'Lekki',
                state: 'Lagos',
                country: 'Nigeria',
                primaryCategory: 'GENERAL_MECHANIC',
                status: 'PENDING',
                cacDocumentUrl: 'https://example.com/cac.pdf',
                idDocumentUrl: 'https://example.com/id.pdf',
                addressProofUrl: 'https://example.com/address.pdf'
            },
            {
                businessName: 'Lekki Fast Towing',
                email: 'help@lekkifasttowing.com',
                phoneNumber: '08098765432',
                address: '45 Admiralty Way',
                city: 'Lekki',
                state: 'Lagos',
                country: 'Nigeria',
                primaryCategory: 'TOWING',
                status: 'PENDING',
                cacDocumentUrl: 'https://example.com/cac2.pdf',
                idDocumentUrl: 'https://example.com/id2.pdf'
            }
        ];

        for (const v of vendors) {
            await axios.post(`${API_URL}/vendors`, v);
        }

        console.log('Seeding complete!');
    } catch (error) {
        console.error('Error seeding vendors:', error);
    }
}

seedVendors();
