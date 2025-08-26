
const http = require('http'); 
const fs = require('fs').promises; 
const path = require('path'); 
const PORT = 3000; 


const requestListener = async function (req, res) {
   s
    console.log(`Request received for: ${req.url}`);

    let filePath;      
    let contentType;   
    switch (req.url) {
        case '/home':
        case '/':
            filePath = path.join(__dirname, 'public', 'home.html');
            contentType = 'text/html';
            break; 
        case '/about':
            filePath = path.join(__dirname, 'public', 'about.html');
            contentType = 'text/html';
            break;
        case '/contact':
            filePath = path.join(__dirname, 'public', 'contact.html');
            contentType = 'text/html';
            break;
        case '/style.css':
            filePath = path.join(__dirname, 'public', 'style.css');
            contentType = 'text/css';
            break;
        default:
            filePath = path.join(__dirname, 'public', '404.html');
            contentType = 'text/html';
            break;
    }

    try {
       
        const content = await fs.readFile(filePath);

        const statusCode = (req.url === '/home' || req.url === '/' || req.url === '/about' || req.url === '/contact' || req.url === '/style.css') ? 200 : 404;

        res.writeHead(statusCode, { 'Content-Type': contentType });

        res.end(content);
        console.log(`Served ${req.url} with status ${statusCode}`);

    } catch (error) {
       
        console.error(`Error serving ${req.url}:`, error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error - An unexpected error occurred on the server.');
    }
};


const server = http.createServer(requestListener);


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('You can test the following routes in your web browser:');
    console.log(`- Home Page:   http://localhost:${PORT}/ or http://localhost:${PORT}/home`);
    console.log(`- About Page:  http://localhost:${PORT}/about`);
    console.log(`- Contact Page:http://localhost:${PORT}/contact`);
    console.log(`- CSS File:    http://localhost:${PORT}/style.css`);
    console.log(`- 404 Page:    http://localhost:${PORT}/non-existent-page`);
});
