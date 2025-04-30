const http = require('http');
const fs = require('fs');
const path = require('path');
let serverPORT = process.env.PORT || 5000;
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const firebase = require('firebase/app');
require('firebase/database');
const firebaseConfig = {
    apiKey: 'AIzaSyDSZ8Sf_4drlrJkH_r1_9TVEF6xZyU7Vg8',
    authDomain: 'cpjs-662f5.firebaseapp.com',
    databaseURL: 'https://cpjs-662f5-default-rtdb.firebaseio.com/',
    projectId: 'cpjs-662f5',
    storageBucket: 'cpjs-662f5.firebaseapp.com',
    messagingSenderId: '306683211357',
    appId: '1:306683211357:web:367e12554760ebe5a3a7b4',
    measurementId: 'G-VE4TPPP91N',
  };
  firebase.initializeApp(firebaseConfig);
const db = firebase.database();

async function getPort(input) {
    rl.output.write('type "end" anytime to terminate the process\n');
    return new Promise((resolve) => {
        if (input) {
            serverPORT = input;
            resolve();
        } else {
            rl.question('Enter PORT number\n', (port) => {
                if (port) {
                    if (port === 'end') {
                        console.log('Process terminated');
                        server.close(() => {
                            rl.close();
                            process.exit(0);
                        });
                    } else {
                        serverPORT = port;
                        resolve();
                    }
                }
            });
        }
    });
}

rl.on('line', (input) => {
    if (input === 'end') {
        console.log('Process terminated');
        server.close(() => {
            rl.close(); // Close the readline interface after the server has closed
            process.exit(0);
        });
    } else if (input === 'dbTEST') {
        console.log('Testing database');
        rl.question('enter path\n', (path) => {
            rl.question('command?\n', (command) => {
                if (command === 'end') {
                    console.log('Process terminated');
                    server.close(() => {
                        rl.close(); // Close the readline interface after the server has closed
                        process.exit(0);
                    });
                    return;
                }
                if (command === 'once') {
                    rl.question('data?\n', async (extradata) => {
                        try {
                            console.log(`Running db.ref('${path}').${command}('value')`);
                            const snapshot = await db.ref(path).once('value'); // Await the Promise
                            const result = snapshot.val(); // Extract the value from the snapshot
                            console.log('Result:', result);
                        } catch (error) {
                            console.error('Error executing database command:', error);
                        }
                    });
                } else if (command === 'set') {
                    rl.question('data?\n', async (data) => {
                        try {
                            console.log(`Running db.ref('${path}').${command}(${data})`);
                            await db.ref(path).set(data); // Await the Promise
                            console.log('Data set successfully');
                        } catch (error) {
                            console.error('Error executing database command:', error);
                        }
                    });
                } else if (command === 'remove') {
                    rl.question('data?\n', async (data) => {
                        try {
                            console.log(`Running db.ref('${path}').remove();`);
                            await db.ref(path + '/' + data).remove(); // Correctly remove the data at the specified path
                            console.log('Data removed successfully');
                        } catch (error) {
                            console.error('Error executing database command:', error);
                        }
                    });
                } else {
                    console.error('Unsupported command:', command);
                }
            });
        });
    }
});

const server = http.createServer((req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || 'http'; // Use 'https' if behind a proxy
    const host = req.headers.host; // Get the host (e.g., localhost:3000)
    const fullUrl = `${protocol}://${host}${req.url}`; // Construct the full URL
    console.log(`URL attempting to access: ${fullUrl}`);

        // Handle POST requests from client and send the data back
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                console.log(`Server received: ${body}`);
                let parsedBody;
            
                try {
                    parsedBody = JSON.parse(body); // Parse the body as JSON
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON format' }));
                    return;
                }
            
                if (parsedBody.action === 'readUserDataByName') {
                    try {
                        const snapshot = await db.ref(`cpjs/users/${parsedBody.name}`).once('value');
                        const userData = snapshot.val(); // Extract snapshot data
            
                        if (userData) {
                            console.log('Successful read');
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(userData)); // Send user data as JSON
                        } else {
                            console.warn("No user data found for:", parsedBody.name);
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'User not found' }));
                        }
                    } catch (error) {
                        console.error("Error reading user data:", error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Internal server error' }));
                    }
                } else if (parsedBody.action === 'updateUserData') {
                    db.ref(`cpjs/users/${parsedBody.name}`).update(parsedBody.data).then(() => {
                        console.log('User data updated successfully');
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'User data updated successfully' }));
                    }
                    ).catch((error) => {
                        console.error('Error updating user data:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Internal server error' }));
                    });
                } else if (parsedBody.action === 'removeUser') {
                    db.ref(`cpjs/users/${parsedBody.name}`).remove().then(() => {
                        console.log(`${parsedBody.name} data removed successfully`);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: `${parsedBody.name} data removed successfully` }));
                    }
                    ).catch((error) => {
                        console.error('Error removing user data:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Internal server error' }));
                    });
                } else if (parsedBody.action === 'pushNewUser') {
                    db.ref(`cpjs/users/${parsedBody.data.name}`).set(parsedBody.data).then(() => {
                        console.log('User data pushed successfully');
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'User data pushed successfully' }));
                    }
                    ).catch((error) => {
                        console.error('Error pushing user data:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Internal server error' }));
                    });
                }
            });
            return;
        }

    let filePath = req.url.endsWith('/')
    ? path.join(__dirname, req.url, 'index.html')
    : req.url === '/api' ? '' : path.join(__dirname, req.url);

    if (!path.extname(filePath)) {
        filePath += '.html';
    }

    // Ensure the file path does not append `.html` unnecessarily брух
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    // Set the correct MIME type based on the file extension
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        default:
            contentType = 'text/html';
            break;
    }

    // Read and serve the file
    fs.readFile(filePath, (error, content) => {
        if (filePath === '' || filePath === undefined || filePath === null) {
            return;
        }
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                fs.readFile(path.join(__dirname, 'web/404.html'), (err, content) => {
                    res.end(content, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('Sorry, there was an error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

getPort(5000).then(() => {
    server.listen(serverPORT, () => {
        console.log('Server running at port ' + serverPORT);
    });
});