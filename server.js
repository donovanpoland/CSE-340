//import the express function from express
import express from "express";
//import fileurltopath function
import { fileURLToPath } from 'url';
//import path object
import path from 'path';
// import testing of databse connection
import { testConnection } from './src/models/db.js';
// import routes object
import router from './src/routes.js';


// use the string stored in .env to display what enviroment is being worked inside of
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
//set filename to the absolute path of the file imported from the server
const __filename = fileURLToPath(import.meta.url);
// set the directory by providing the filename and path to dirname function of path object
const __dirname = path.dirname(__filename);
// use the port stored in .env or default to this port
const PORT = process.env.PORT || 3000;
// use the IP or address stored in .env or this default IP
const IP = process.env.IP || "127.0.0.1";
// use https if in production and http if in development (this doesnt change the protocal just the string used)
const PROTO = "http://";
// call the express function and store the returned application object in app
const app = express();


/**** Configure Express middleware ****/
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Set EJS as the templating engine
app.set('view engine', 'ejs');
// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));
// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next(); // Pass control to the next middleware or route
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();// Pass control to the next middleware or route
});

// Use the imported router to handle routes
app.use(router);


// *** Errors ***
// Catch-all route for 404 errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    // Log error details for debugging
    if(err.message != "")
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    
    // Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        keywords: `Error ${status}`,
        desc: `${status} status error code page`,
        error: err.message,
        stack: err.stack
    };
    
    // Render the appropriate error template
    res.status(status).render(`errors/${template}`, context);
});

// use the listen method from the Express application object
// start the server and listen for incoming connections on the provided port
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at ${PROTO}:${IP}:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});



