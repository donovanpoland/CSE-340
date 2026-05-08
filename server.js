//import the express function from express
import express from "express";

import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// use the string stored in .env to display what enviroment is being worked inside of
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
// use the port stored in .env or default to this port
const PORT = process.env.PORT || 3000;
// use the IP or address stored in .env or this default IP
const IP = process.env.IP || "127.0.0.1";
// use https if in production and http if in development (this doesnt change the protocal just the string used)
const PROTO = "http://";

console.log("File is running...");

// call the express function and store the returned application object in app
const app = express();

// use the get method from the Express application object
// register a route handler for GET requests to "/"
//
// req = request object created by Express
// res = response object created by Express
//
// use the send method from the response object to send data back to the client/browser 
// app.get("/", (req, res) => {
//     res.send("Hello from Express (from nodemon) (live edit)")
//     console.log("Hello, Node.js!");
// });

/**
  * Configure Express middleware
*/
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

/**
  * Routes
*/
app.get('/', async (req, res) => {
    const title = 'Home';
    const keywords = '';
    const description = '';
    res.render('home', { title, keywords, description });
});

app.get('/organizations', async (req, res) => {
    const title = 'Our Partner Organizations';
    const keywords = '';
    const description = '';
    res.render('organizations', { title, keywords, description });
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    const keywords = '';
    const description = '';
    res.render('projects', { title, keywords, description });
});

app.get('/categories', async (req, res) =>{
    const title = "Service Project Categories";
    const keywords = '';
    const description = '';
    res.render('categories', { title, keywords, description });
});

// use the listen method from the Express application object
// start the server and listen for incoming connections on the provided port
app.listen(PORT, () => {
    console.log(`Server is running at ${PROTO}${IP}:${PORT}`);
    console.log(`Enviroment: ${NODE_ENV}`);
});






