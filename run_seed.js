const http = require('http');
const { execSync } = require('child_process');

function checkPort() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:3002/vendors', (res) => {
            resolve(res.statusCode);
        });
        req.on('error', () => resolve(false));
        req.end();
    });
}

async function run() {
    console.log('Waiting for backend on port 3002...');
    let ready = false;
    for (let i = 0; i < 30; i++) {
        const status = await checkPort();
        if (status) {
            ready = true;
            break;
        }
        await new Promise(r => setTimeout(r, 1000));
    }
    
    if (ready) {
        console.log('Backend is ready! Running seed...');
        try {
            execSync('node seed_vendors.js', { stdio: 'inherit' });
            console.log('Seeding successful.');
        } catch (e) {
            console.error('Seeding failed.');
        }
    } else {
        console.error('Backend never became ready.');
    }
}

run();
