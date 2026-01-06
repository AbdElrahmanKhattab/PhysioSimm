const mysql = require('mysql2/promise');

async function checkDatabase() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Mazen198165967#',
        database: 'PhysioCaseLab'
    });

    try {
        console.log('=== CASES ===');
        const [cases] = await connection.query('SELECT * FROM cases');
        cases.forEach(c => {
            console.log(`\nCase ID: ${c.id}`);
            console.log(`Title: ${c.title}`);
            console.log(`Specialty: ${c.specialty}`);
            console.log(`Difficulty: ${c.difficulty}`);
        });

        console.log('\n\n=== CASE STEPS ===');
        const [steps] = await connection.query('SELECT * FROM case_steps ORDER BY caseId, stepIndex');
        steps.forEach(s => {
            console.log(`\nCase ID: ${s.caseId}, Step ${s.stepIndex}`);
            console.log(`Type: ${s.type}`);
            console.log(`Question: ${s.question || 'N/A'}`);
            const content = s.content ? JSON.parse(s.content) : {};
            console.log(`Content keys: ${Object.keys(content).join(', ')}`);
        });

        console.log('\n\n=== CASE STEP OPTIONS ===');
        const [options] = await connection.query('SELECT * FROM case_step_options');
        console.log(`Total options: ${options.length}`);
        options.forEach(o => {
            console.log(`Step ID: ${o.stepId}, Label: ${o.label}, Correct: ${o.isCorrect}`);
        });

    } finally {
        await connection.end();
    }
}

checkDatabase().catch(console.error);
