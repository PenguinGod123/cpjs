const http = require('http');
const fs = require('fs');
const path = require('path');
let serverPORT = process.env.PORT || 5000;
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.output.write('type "end" anytime to terminate the process\n');

async function getPort(input) {
    return new Promise((resolve) => {
        if (input) {
            serverPORT = input;
            resolve();
        } else {
            rl.question('Enter PORT number\n', (port) => {
                if (port) {
                    if (port === 'end') {
                        console.log('Process terminated');
                        server.close();
                        rl.close();
                    } else {
                        serverPORT = port;
                        resolve();
                    }
                }
            });
        }

        rl.on('line', (input) => {
            if (input === 'end') {
                console.log('Process terminated');
                server.close();
                rl.close();
            }
        });
    });
}

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    // Ensure the file path does not append `.html` unnecessarily
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
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
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