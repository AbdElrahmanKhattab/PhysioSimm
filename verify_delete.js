// const fetch = require('node-fetch'); // Native fetch in Node 18+

const BASE_URL = 'http://localhost:4000/api';
let token = '';

async function run() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.message);
        token = loginData.token;
        console.log('Logged in.');

        // 2. Create a dummy case
        console.log('Creating dummy case...');
        const createRes = await fetch(`${BASE_URL}/admin/cases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Delete Me Case',
                specialty: 'Test',
                category: 'Test',
                difficulty: 'Beginner',
                isLocked: false,
                metadata: { brief: 'To be deleted' }
            })
        });
        const caseData = await createRes.json();
        if (!createRes.ok) throw new Error(caseData.message);
        const caseId = caseData.id;
        console.log(`Created case with ID: ${caseId}`);

        // 3. Delete the case
        console.log('Deleting case...');
        const deleteRes = await fetch(`${BASE_URL}/admin/cases/${caseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const deleteData = await deleteRes.json();
        if (!deleteRes.ok) throw new Error(deleteData.message);
        console.log('Case deleted.');

        // 4. Verify it's gone
        console.log('Verifying deletion...');
        const getRes = await fetch(`${BASE_URL}/cases/${caseId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (getRes.status === 404) {
            console.log('Success! Case not found (404) as expected.');
        } else {
            console.error('Error: Case still exists or other error.', getRes.status);
        }

    } catch (err) {
        console.error('Test Failed:', err.message);
    }
}

run();
