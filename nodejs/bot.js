const net = require('net');
const targetHost = process.argv[2];
const targetPort = process.argv[3];

function isValidDomain(domain) {
    const domainPattern = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return domainPattern.test(domain);
}

if (!isValidDomain(targetHost)) {
    console.error('Error: Argument 1 must be a valid URL.');
    process.exit(1);
}
if (isNaN(targetPort)) {
    console.error('Error: Argument 2 must be a valid number.');
    process.exit(1);
}

createTcpProxy(process.argv[4]);

// Function to create a TCP proxy server
function createTcpProxy(listenPort) {
    const server = net.createServer((clientSocket) => {
        console.log(`Client connected ${listenPort}`);

        // Connect to the target server
        const serverSocket = net.createConnection({ host: targetHost, port: targetPort }, () => {
            console.log(`Connected to target server at ${targetHost}:${targetPort}`);
        });

        // Forward data from the client to the target server with search and replace
        clientSocket.on('data', (data) => {
            let message = data.toString();
            serverSocket.write(message);
        });

        // Forward data from the target server back to the client
        serverSocket.on('data', (data) => {
            console.log('Received response from server:', data.toString());
            clientSocket.write(data);  // Send data back to the client
        });

        // Handle client disconnection
        clientSocket.on('end', () => {
            console.log('Client disconnected');
            serverSocket.end();  // Close the connection to the target server
        });

        // Handle server disconnection
        serverSocket.on('end', () => {
            console.log('Target server disconnected');
            clientSocket.end();  // Close the connection to the client
        });

        // Error handling for client
        clientSocket.on('error', (err) => {
            console.error('Client error:', err.message);
            serverSocket.end();
        });

        // Error handling for server
        serverSocket.on('error', (err) => {
            console.error('Server error:', err.message);
            clientSocket.end();
        });
    });

    // Start the proxy server on the given port
    server.listen(listenPort, () => {
        console.log(`TCP proxy listening on port ${listenPort}`);
    });

    // Error handling for the proxy server itself
    server.on('error', (err) => {
        console.error('Proxy server error:', err.message);
    });
}
