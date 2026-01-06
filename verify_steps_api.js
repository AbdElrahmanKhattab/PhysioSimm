
// Using native fetch

async function verify() {
    try {
        const baseUrl = 'http://localhost:4000/api';

        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const { token } = await loginRes.json();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 2. Create Case
        console.log('Creating temp case...');
        const caseRes = await fetch(`${baseUrl}/admin/cases`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ title: 'Step Test Case', specialty: 'Test' })
        });
        if (!caseRes.ok) throw new Error(`Create case failed: ${caseRes.status}`);
        const { id: caseId } = await caseRes.json();
        console.log('Case created:', caseId);

        // 3. Create Step (POST)
        console.log('Creating step...');
        const stepPayload = {
            stepIndex: 0,
            type: 'info',
            content: { description: 'Test step' },
            question: 'Test question',
            maxScore: 0,
            options: [],
            investigations: [],
            xrays: []
        };
        const stepRes = await fetch(`${baseUrl}/admin/cases/${caseId}/steps`, {
            method: 'POST',
            headers,
            body: JSON.stringify(stepPayload)
        });

        // If endpoints are missing, this will fail with 404
        if (!stepRes.ok) {
            const text = await stepRes.text();
            throw new Error(`Create step failed: ${stepRes.status} ${text}`);
        }
        const { id: stepId } = await stepRes.json();
        console.log('Step created:', stepId);

        // 4. Update Step (PUT)
        console.log('Updating step...');
        const updatePayload = { ...stepPayload, question: 'Updated question' };
        const updateRes = await fetch(`${baseUrl}/admin/steps/${stepId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(updatePayload)
        });
        if (!updateRes.ok) throw new Error(`Update step failed: ${updateRes.status}`);
        console.log('Step updated.');

        // 5. Verify Step (GET)
        console.log('Verifying step...');
        const getRes = await fetch(`${baseUrl}/admin/cases/${caseId}/steps`, { headers });
        if (!getRes.ok) throw new Error(`Get steps failed: ${getRes.status}`);
        const steps = await getRes.json();
        const serverStep = steps.find(s => s.id === stepId);
        if (!serverStep || serverStep.question !== 'Updated question') {
            throw new Error('Verification failed: Step not updated correctly');
        }
        console.log('Verification passed: Step updated correctly.');

        // 6. Delete Step (DELETE)
        console.log('Deleting step...');
        const delStepRes = await fetch(`${baseUrl}/admin/steps/${stepId}`, {
            method: 'DELETE',
            headers
        });
        if (!delStepRes.ok) throw new Error(`Delete step failed: ${delStepRes.status}`);
        console.log('Step deleted.');

        // 7. Cleanup Case
        console.log('Cleaning up case...');
        await fetch(`${baseUrl}/admin/cases/${caseId}`, { method: 'DELETE', headers });
        console.log('Cleanup complete.');
        console.log('ALL API TESTS PASSED');

    } catch (err) {
        console.error('TEST FAILED:', err.message);
        process.exit(1);
    }
}

verify();
