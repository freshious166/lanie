const axios = require('axios');

const API_URL = 'https://lanie.onrender.com';

async function simulate() {
  try {
    // 1. Fetch all vehicles
    console.log('Fetching active vehicles from database...');
    const { data: vehicles } = await axios.get(`${API_URL}/vehicles`);
    
    if (vehicles.length === 0) {
      console.log('No vehicles found in the database! Please add some via the Dashboard first.');
      return;
    }

    console.log(`Found ${vehicles.length} vehicles. Starting telemetry simulation...`);

    // Assign initial coordinates around Lagos if they don't have any
    vehicles.forEach((v, idx) => {
        if (!v.currentLat || !v.currentLng) {
            v.currentLat = 6.5244 + (Math.random() * 0.05);
            v.currentLng = 3.3792 + (Math.random() * 0.05);
            v.currentSpeed = 40 + Math.floor(Math.random() * 20);
        }
    });

    // 2. Loop indefinitely
    setInterval(async () => {
      for (const v of vehicles) {
        // Move vehicle slightly
        v.currentLat = Number(v.currentLat) + (Math.random() - 0.5) * 0.002;
        v.currentLng = Number(v.currentLng) + (Math.random() - 0.5) * 0.002;
        
        // Randomly fluctuate speed
        v.currentSpeed = Math.max(0, Number(v.currentSpeed) + (Math.random() - 0.5) * 10);

        try {
            await axios.post(`${API_URL}/vehicles/${v.id}/telemetry`, {
                lat: v.currentLat,
                lng: v.currentLng,
                speed: v.currentSpeed.toFixed(1)
            });
            console.log(`📡 Pinged Telemetry for ${v.plateNumber} at [${v.currentLat.toFixed(5)}, ${v.currentLng.toFixed(5)}]`);
        } catch (err) {
            console.error(`Failed to ping telemetry for ${v.plateNumber}:`, err.message);
        }
      }
      console.log('---');
    }, 3000);

  } catch (err) {
    console.error('Simulation failed:', err.message);
  }
}

simulate();
