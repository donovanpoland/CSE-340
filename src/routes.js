//import the express function from express
import express from "express";

// import routes
import { homePage } from "./controllers/index.js";
import { organizationsPage } from "./controllers/organizations.js";
import { projectsPage } from "./controllers/projects.js";
import { categoriesPage } from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";


const router = express.Router();

/*** Routes imported from controlers***/
router.get('/', homePage);
router.get('/organizations', organizationsPage);
router.get('/projects', projectsPage);
router.get('/categories', categoriesPage);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;