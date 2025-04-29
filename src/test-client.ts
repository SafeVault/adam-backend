import * as http from 'http';

// Function to make a GET request to our test server
function getTransactions() {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/transactions',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      
      try {
        const parsedData = JSON.parse(data);
        console.log('Response:');
        console.log(JSON.stringify(parsedData, null, 2));
      } catch (e) {
        console.error('Error parsing JSON:', e);
        console.log('Raw response:', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('Error:', error);
  });
  
  req.end();
}

// Wait a bit for the server to start, then make the request
setTimeout(() => {
  console.log('Testing GET /transactions endpoint...');
  getTransactions();
}, 2000); 