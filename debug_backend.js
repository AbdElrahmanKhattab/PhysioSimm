// Native fetch is available in Node 18+
// If node-fetch is not available, I'll use http
// Actually, standard fetch is available in Node 18+. I'll assume Node 18+ or I will use a simple http request wrapper if it fails.

const BASE_URL = 'http://localhost:4000';

async function run() {
    try {
        // 1. Login
        console.log('Logging in as admin...');
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
        });

        if (!loginRes.ok) {
            console.error('Login failed:', loginRes.status, await loginRes.text());
            return;
        }

        const loginData = await loginRes.json();
        console.log('Login successful. Token:', loginData.token ? 'Yes' : 'No');
        const token = loginData.token;

        // 2. Fetch Overview
        console.log('\nFetching Overview...');
        const overviewRes = await fetch(`${BASE_URL}/api/admin/overview`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!overviewRes.ok) {
            console.error('Overview fetch failed:', overviewRes.status, await overviewRes.text());
        } else {
            const overviewData = await overviewRes.json();
            console.log('Overview Data:', JSON.stringify(overviewData, null, 2));
        }

        // 3. Fetch Users
        console.log('\nFetching Users...');
        const usersRes = await fetch(`${BASE_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!usersRes.ok) {
            console.error('Users fetch failed:', usersRes.status, await usersRes.text());
        } else {
            const usersData = await usersRes.json();
            console.log('Users Data Type:', Array.isArray(usersData) ? 'Array' : typeof usersData);
            console.log('Users Count:', Array.isArray(usersData) ? usersData.length : 'N/A');
            if (Array.isArray(usersData) && usersData.length > 0) {
                console.log('First User Sample:', JSON.stringify(usersData[0], null, 2));
            } else {
                console.log('Users Data:', JSON.stringify(usersData, null, 2));
            }
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

run();
