// Import necessary Node.js modules
const http = require('http'); // The built-in HTTP module to create a server
const fs = require('fs').promises; // File System module for asynchronous file operations (using promises)
const path = require('path'); // Path module for working with file and directory paths (cross-platform compatibility)

const PORT = 3000; // Define the port number on which your server will listen

/**
 * requestListener function: This is the core logic of your web server.
 * It gets executed every time a client (e.g., a web browser) makes a request to your server.
 * @param {http.IncomingMessage} req - The request object (contains information about the client's request, like URL).
 * @param {http.ServerResponse} res - The response object (used to send data back to the client).
 */
const requestListener = async function (req, res) {
    // Log the incoming request URL to the console for debugging purposes
    console.log(`Request received for: ${req.url}`);

    let filePath;      // Variable to store the full path to the file we want to serve
    let contentType;   // Variable to store the HTTP Content-Type header for the response

    // --- Implement Routing Logic ---
    // This switch statement checks the requested URL (req.url) and decides which file to serve.
    switch (req.url) {
        case '/home':
        case '/': // Handle the root path '/' as the home page
            filePath = path.join(__dirname, 'public', 'home.html');
            contentType = 'text/html';
            break; // Exit the switch statement
        case '/about':
            filePath = path.join(__dirname, 'public', 'about.html');
            contentType = 'text/html';
            break;
        case '/contact':
            filePath = path.join(__dirname, 'public', 'contact.html');
            contentType = 'text/html';
            break;
        case '/style.css': // Handle requests for the CSS file
            filePath = path.join(__dirname, 'public', 'style.css');
            contentType = 'text/css';
            break;
        default:
            // If the requested URL doesn't match any of the above, serve the 404 Not Found page
            filePath = path.join(__dirname, 'public', '404.html');
            contentType = 'text/html';
            break;
    }

    try {
        // --- Asynchronously Read File Content ---
        // fs.promises.readFile() reads the file content. 'await' pauses execution here until the file is read.
        const content = await fs.readFile(filePath);

        // --- Determine HTTP Status Code ---
        // Send 200 OK for successful routes, and 404 Not Found specifically for the 404 page serving.
        const statusCode = (req.url === '/home' || req.url === '/' || req.url === '/about' || req.url === '/contact' || req.url === '/style.css') ? 200 : 404;

        // --- Set HTTP Headers ---
        // res.writeHead() sets the HTTP status code and response headers.
        res.writeHead(statusCode, { 'Content-Type': contentType });

        // --- Send Response Body ---
        // res.end() sends the file content (HTML or CSS) back to the client and closes the response.
        res.end(content);
        console.log(`Served ${req.url} with status ${statusCode}`);

    } catch (error) {
        // --- Error Handling for File Reading ---
        // This block catches any errors that occur during fs.readFile (e.g., file not found, permission error).
        console.error(`Error serving ${req.url}:`, error.message);

        // Send a 500 Internal Server Error response to the client
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error - An unexpected error occurred on the server.');
    }
};

// --- Create the HTTP Server ---
// http.createServer() creates an instance of the HTTP server and registers the requestListener.
const server = http.createServer(requestListener);

// --- Start the Server ---
// server.listen() makes the server start listening for incoming requests on the specified port.
server.listen(PORT, () => {
    // This callback function runs once the server has successfully started listening.
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('You can test the following routes in your web browser:');
    console.log(`- Home Page:   http://localhost:${PORT}/ or http://localhost:${PORT}/home`);
    console.log(`- About Page:  http://localhost:${PORT}/about`);
    console.log(`- Contact Page:http://localhost:${PORT}/contact`);
    console.log(`- CSS File:    http://localhost:${PORT}/style.css`);
    console.log(`- 404 Page:    http://localhost:${PORT}/non-existent-page`);
});