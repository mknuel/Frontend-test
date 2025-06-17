import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testServer() {
  try {
    console.log('Testing server endpoints...\n');

    // Test 1: Get recommendations (first page)
    console.log('1. Testing GET /recommendations');
    const recommendations = await fetch(`${BASE_URL}/recommendations?limit=2`);
    const recommendationsData = await recommendations.json();
    console.log('Response:', JSON.stringify(recommendationsData, null, 2), '\n');

    // Test 2: Archive a recommendation
    console.log('2. Testing POST /recommendations/:id/archive');
    const recommendationId = recommendationsData.data[0].recommendationId;
    const archive = await fetch(`${BASE_URL}/recommendations/${recommendationId}/archive`, {
      method: 'POST'
    });
    const archiveData = await archive.json();
    console.log('Response:', JSON.stringify(archiveData, null, 2), '\n');

    // Test 3: Get archived recommendations
    console.log('3. Testing GET /recommendations/archive');
    const archived = await fetch(`${BASE_URL}/recommendations/archive`);
    const archivedData = await archived.json();
    console.log('Response:', JSON.stringify(archivedData, null, 2), '\n');

    // Test 4: Unarchive a recommendation
    console.log('4. Testing POST /recommendations/:id/unarchive');
    const unarchive = await fetch(`${BASE_URL}/recommendations/${recommendationId}/unarchive`, {
      method: 'POST'
    });
    const unarchiveData = await unarchive.json();
    console.log('Response:', JSON.stringify(unarchiveData, null, 2), '\n');

    // Test 5: Login
    console.log('5. Testing POST /login');
    const login = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'password'
      })
    });
    const loginData = await login.json();
    console.log('Response:', JSON.stringify(loginData, null, 2), '\n');

    // Test 6: Authenticated request
    if (loginData.token) {
      console.log('6. Testing authenticated GET /recommendations');
      const authed = await fetch(`${BASE_URL}/recommendations`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      const authedData = await authed.json();
      console.log('Response:', JSON.stringify(authedData, null, 2), '\n');
    }

    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Run tests when server is ready
setTimeout(testServer, 1000);
