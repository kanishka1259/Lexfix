import axios from 'axios';

const testAPI = async () => {
    const studentId = '69831e3fefe58671600f694d';
    // I need a token. I'll mock a login or just use a known secret to generate one if I could, 
    // but better to just use the token from the user if I had it.
    // Wait, I can't easily get the user's token.

    // I'll try to call the endpoint WITHOUT protection if I modify the route temporarily,
    // or I'll just check if the controller itself works by calling it in a node script.
    console.log('Testing endpoint...');
    try {
        const res = await axios.get(`http://localhost:5000/api/tasks/student/${studentId}`);
        console.log('Response:', res.data);
    } catch (error) {
        console.error('Error:', error.response?.status, error.response?.data || error.message);
    }
};

testAPI();
