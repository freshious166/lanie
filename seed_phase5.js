const axios = require('axios');

const API_URL = 'http://localhost:3002';

async function seedPhase5() {
    try {
        console.log('Seeding Vehicles...');
        let vehicle1Id;
        try {
            const v1Res = await axios.post(`${API_URL}/vehicles`, {
                make: 'BMW',
                model: 'X5 xDrive40i',
                year: 2022,
                vin: 'BMW-X5-2022-VIN',
                plateNumber: 'ABC-1234',
                currentMileage: 45230,
                imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlgipqPrOvR4br47DCmTgFSO1OugUGCNNI8Y6AMTAZyQu01i5sax6iKLIjsZOyaygY9AmWr83nJdG_4iPLN-p4iCxOehjLb2VXGvujwu5dadEhradNlWx4CG868DVKbMxmpv4wgPulmcNavlGTlMrxhIs2vDwm6usmoUS-x5RwGGxpk4A-8p_KcRDBQa2zXAGmaOoKesIURewzy6rRyf94EZ78MWaThJU_7xIHJWFa8HuLdsXEyfOc_TrNc1nYaE8OciJRUYWrS_k',
                status: 'Healthy',
                value: '$21.4k',
                nextServiceMileage: 48000
            });
            vehicle1Id = v1Res.data.id;

            await axios.post(`${API_URL}/vehicles`, {
                make: 'Tesla',
                model: 'Model 3 Dual Motor',
                year: 2019,
                vin: 'TSLA-M3-2019-VIN',
                plateNumber: 'XYZ-9876',
                currentMileage: 52100,
                imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQKrzdgoRO-vI39sZ1ZYQdtoQnOp6jxJLOVhMRlvhlJf5pY1dy5hT_7jEXLp8P9AnRWGU9_YjaK5tpXPuXv_rrHUMy3TOgHv2fZEZOacKVq1lywa0Di5kJQC--qhz6712dyBjfaYfy6lUM0azpZBpNnXLwgspXunzQORTGHvts3RJtbS5uK5jTIpfIH1SzqoDFAO7ydMBqXGJS3DsbSOzJvsfnWah4drn3V-wmcUKBvNKaFGnfYqusl-12hVrx3jWNuGuJOup9cI0',
                status: 'Healthy',
                value: '$28.5k',
                nextServiceMileage: 55000
            });
        } catch (e) {
            console.log('Vehicles already exist, fetching them...');
            const vRes = await axios.get(`${API_URL}/vehicles`);
            vehicle1Id = vRes.data.find(v => v.vin === 'BMW-X5-2022-VIN').id;
        }

        console.log('Seeding Service Records for Vehicle 1...');
        const historyEvents = [
            { title: 'Mileage Logged', serviceDate: new Date().toISOString(), serviceType: 'log', description: 'Odometer updated via LaineFleet Sync', mileageAtService: 45230, totalCost: 0, partsUsed: { details: '' } },
            { title: 'Oil Change', serviceDate: '2023-10-12T00:00:00Z', serviceType: 'maintenance', description: 'Shell Service Station • Downtown', mileageAtService: 42100, totalCost: 0, partsUsed: { isVerified: true } },
            { title: 'Minor Accident Reported', serviceDate: '2023-08-05T00:00:00Z', serviceType: 'accident', description: 'Front-end collision. Damage to bumper and grill reported by insurance provider.', mileageAtService: 38450, totalCost: 0, partsUsed: { details: 'View Details' } },
            { title: 'New Tires Installed', serviceDate: '2023-05-14T00:00:00Z', serviceType: 'maintenance', description: 'Michelin Pilot Sport 4S (Full Set)', mileageAtService: 35200, totalCost: 0, partsUsed: { isVerified: true } },
            { title: 'Ownership Transfer', serviceDate: '2022-01-10T00:00:00Z', serviceType: 'ownership', description: 'Vehicle purchased as "Certified Pre-Owned"', mileageAtService: 12400, totalCost: 0, partsUsed: { details: '' } }
        ];

        for (const ev of historyEvents) {
            await axios.post(`${API_URL}/service-records`, {
                vehicle: { id: vehicle1Id },
                serviceDate: ev.serviceDate,
                serviceType: ev.serviceType,
                mileageAtService: ev.mileageAtService,
                totalCost: ev.totalCost,
                partsUsed: { title: ev.title, description: ev.description, ...ev.partsUsed }
            });
        }

        console.log('Seeding Vendors (Workshops)...');
        // Elite Auto Care
        const w1 = await axios.post(`${API_URL}/vendors`, {
            businessName: 'Elite Auto Care',
            description: 'Full service garage specializing in European models.',
            email: 'elite@example.com',
            phoneNumber: '555-0100',
            address: '123 Mechanic St, Brooklyn, NY 11201',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            primaryCategory: 'GENERAL_MECHANIC',
            status: 'VERIFIED',
            isVerified: true,
            is24Hours: false,
            openingTime: '08:00',
            closingTime: '19:00',
            averageRating: 4.9,
            totalReviews: 124,
            bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmws4hLiH1IjTywsk0128tG3CyND4DU1-gB8nVFi7AvdjIQm_S5XtrlEHD_puGHRwEBP01buVE1kuB196V6iI_9iARYIY7fUCp3E9k7S9O_Xguswe5WTWAxMWa56OGkZjn_IAu0vJPBkqIvTajat0_hcRW1EmpvCdyupPHsxou13Z_XW0gPkv1o6f2W6WD_04HGlwDoydQSc1I_z6lwZPtjV5_iGw-bzKTwfnzjZYOE7ZTXTOid2dPt5I2UOJhUm-PmjNfAkRT1OQ'
        });

        await axios.post(`${API_URL}/vendors/${w1.data.id}/services`, { name: 'Standard Oil Change', price: 50.00, estimatedDurationMinutes: 60 });
        await axios.post(`${API_URL}/vendors/${w1.data.id}/services`, { name: 'Tire Rotation & Balance', price: 40.00, estimatedDurationMinutes: 30 });
        await axios.post(`${API_URL}/vendors/${w1.data.id}/services`, { name: 'Brake Inspection', price: 25.00, estimatedDurationMinutes: 20 });

        // Premier BMW Service
        await axios.post(`${API_URL}/vendors`, {
            businessName: 'Premier BMW Service',
            description: 'Certified dealer with genuine parts.',
            email: 'premier@example.com',
            phoneNumber: '555-0200',
            address: '456 Dealer Way, New York, NY 10001',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            primaryCategory: 'DEALERSHIP',
            status: 'VERIFIED',
            isVerified: true,
            is24Hours: true,
            averageRating: 4.7,
            totalReviews: 89,
            bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUNo_MvOlix77qsqzCUe3uFuYNOMluBUbBLBwV-oxxGThUW0CQHgdS7bXddxQwVD3XNVV0o4gxPqwkt2zXcA--vKZYxfz3_dVuas-CORNAwkVWPPvWfgcUCY0FMfVBQVbd11PC4Q5sOQ2Ocx1I2h4eh-bwUDnWx68KjSPwBBtkDb8ohzztS7ZSab6ure_RXDEfuGJ9peApvgV46Fco8E-WWq6gx8CxcHXzVysWwhzeLO2BtgFrSAgrjfAkaOi3YL_ewHIJVpRGyjE'
        });

        // Rapid Tow & Recovery
        await axios.post(`${API_URL}/vendors`, {
            businessName: 'Rapid Tow & Recovery',
            description: '24/7 Roadside assistance and towing.',
            email: 'rapid@example.com',
            phoneNumber: '555-0300',
            address: '789 Rescue Rd, Queens, NY 11101',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            primaryCategory: 'TOWING',
            status: 'VERIFIED',
            isVerified: true,
            is24Hours: true,
            averageRating: 4.5,
            totalReviews: 230,
            bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5mV5mEYcpYGlTi-o84ZtTawoUmBGKbah24ba5vlztCZcpXr35EXueKdDdPOd07_-m1BKjZHoXVHm3WwyXJ77Lyn98Ub20ECMdnRxyUJ5yzKq33a7V7w98N-MGrtWM9YQT-tDmE21Gp-W3EoThARrhP5Qr1zXjZrhc8oG3EPbYYUvlRJ_weox6HQxUK3Mf4YcqJUNZVUozzTb3Apgds0c-rq7hsrzG2tIzqM08nI_M91_dpEFKxn6XWZOlgnyBwuVtefUuKd3SVpM'
        });

        console.log('Seeding Phase 5 complete!');
    } catch (error) {
        console.error('Error seeding phase 5:', error?.response?.data || error);
    }
}

seedPhase5();
