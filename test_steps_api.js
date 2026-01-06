async function testStepsAPI() {
    try {
        console.log('Testing Steps API Endpoint...\n');

        // First, login as admin to get token
        console.log('1. Logging in as admin...');
        const loginRes = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
        }

        const { token } = await loginRes.json();
        console.log('✓ Login successful\n');

        // Test the steps endpoint for case ID 3
        console.log('2. Fetching steps for case ID 3...');
        const stepsRes = await fetch('http://localhost:4000/api/admin/cases/3/steps', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!stepsRes.ok) {
            throw new Error(`Fetch steps failed: ${stepsRes.status} ${stepsRes.statusText}`);
        }

        const steps = await stepsRes.json();
        console.log(`✓ Found ${steps.length} steps\n`);

        // Display step details
        steps.forEach((step, index) => {
            console.log(`--- Step ${index + 1} (stepIndex: ${step.stepIndex}) ---`);
            console.log(`Type: ${step.type}`);
            console.log(`Question: ${step.question || 'N/A'}`);
            console.log(`Max Score: ${step.maxScore || 0}`);
            console.log(`Options: ${step.options?.length || 0}`);
            console.log(`Investigations: ${step.investigations?.length || 0}`);
            console.log(`X-rays: ${step.xrays?.length || 0}`);

            if (step.content) {
                console.log(`Content keys: ${Object.keys(step.content).join(', ')}`);
            }

            if (step.options && step.options.length > 0) {
                console.log('Options:');
                step.options.forEach((opt, i) => {
                    console.log(`  ${i + 1}. ${opt.label} ${opt.isCorrect ? '✓' : ''}`);
                });
            }
            console.log('');
        });

        console.log('✅ Test completed successfully!');
        console.log('\nConclusion: The API endpoint is working correctly.');
        console.log('If steps are not showing in the admin dashboard, the issue is likely in the frontend.');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\nPossible causes:');
        console.log('- Backend server is not running (run: cd backend && node server.js)');
        console.log('- Backend is running on a different port');
        console.log('- Database connection issue');
    }
}

testStepsAPI();
