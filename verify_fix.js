
// Using native fetch

async function verify() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful, got token.');

        // 2. Create logic with large string
        const largeString = 'a'.repeat(100 * 1024); // 100KB string, larger than TEXT (64KB)

        console.log('Attempting to create case with 100KB thumbnail URL payload...');
        const createRes = await fetch('http://localhost:4000/api/admin/cases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Verification Case',
                specialty: 'Test',
                category: 'Test',
                difficulty: 'Beginner',
                isLocked: false,
                thumbnailUrl: largeString,
                duration: 10
            })
        });

        if (!createRes.ok) {
            const errText = await createRes.text();
            throw new Error(`Create case failed: ${createRes.status} ${createRes.statusText} - ${errText}`);
        }

        const caseData = await createRes.json();
        console.log('Case created successfully with ID:', caseData.id);

        // 3. Cleanup (delete the case)
        console.log('Cleaning up...');
        await fetch(`http://localhost:4000/api/admin/cases/${caseData.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Cleanup successful.');
        console.log('VERIFICATION PASSED!');

    } catch (err) {
        console.error('VERIFICATION FAILED:', err);
        process.exit(1);
    }
}

verify();
