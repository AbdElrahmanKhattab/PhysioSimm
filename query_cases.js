const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/data.db');

db.all(`SELECT * FROM cases`, [], (err, cases) => {
    if (err) {
        console.error('Error querying cases:', err);
        return;
    }

    console.log('All cases:');
    cases.forEach((c, idx) => {
        console.log(`\n--- Case ${idx + 1} (ID: ${c.id}) ---`);
        console.log('Title:', c.title);
        console.log('Specialty:', c.specialty);
        console.log('Description:', c.description ? c.description.substring(0, 100) : 'N/A');
    });

    // Now get steps for each case
    db.all(`SELECT * FROM case_steps ORDER BY case_id, step_number`, [], (err, steps) => {
        if (err) {
            console.error('Error querying steps:', err);
            db.close();
            return;
        }

        console.log('\n\n=== CASE STEPS ===');
        steps.forEach(step => {
            console.log(`\nCase ID: ${step.case_id}, Step ${step.step_number}`);
            console.log('Title:', step.title);
            console.log('Content:', step.content ? step.content.substring(0, 150) : 'N/A');
        });

        db.close();
    });
});
