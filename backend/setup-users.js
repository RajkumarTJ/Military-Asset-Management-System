const axios = require('axios');

const baseURL = 'http://localhost:8080';

const setupUsers = async () => {
    try {
        // First login as admin
        console.log('Logging in as admin...');
        const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });

        if (!loginResponse.data.token) {
            throw new Error('No token received from login');
        }

        const token = loginResponse.data.token;
        console.log('Admin login successful');

        // Create Base Commander
        console.log('Creating base commander...');
        const bcResponse = await axios.post(
            `${baseURL}/api/auth/register`,
            {
                username: 'base_commander',
                password: 'commander123',
                role: 'base_commander',
                assignedBase: 'Alpha Base'
            },
            {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('✅ Base Commander created:', bcResponse.data.message);

        // Create Logistics Officer
        console.log('Creating logistics officer...');
        const loResponse = await axios.post(
            `${baseURL}/api/auth/register`,
            {
                username: 'logistics_officer',
                password: 'logistics123',
                role: 'logistics_officer'
            },
            {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('✅ Logistics Officer created:', loResponse.data.message);

    } catch (error) {
        if (error.response) {
            console.error('Server Error:', error.response.data);
            console.error('Status:', error.response.status);
        } else if (error.request) {
            console.error('No response received. Is the server running?');
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
};

// Run the setup
setupUsers().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
}); 