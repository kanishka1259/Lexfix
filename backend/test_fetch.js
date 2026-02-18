const studentId = '69831e3fefe58671600f694d';

async function test() {
    console.log(`Testing fetch for student ${studentId}...`);
    try {
        const res = await fetch(`http://localhost:5000/api/tasks/student/${studentId}`);
        const data = await res.json();
        console.log('Response status:', res.status);
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Fetch failed:', e.message);
    }
}

test();
