//import the express function from express
import express from "express";

// import routes
import { homePage } from "./controllers/index.js";
import { organizationsPage, organizationDetailsPage } from "./controllers/organizations.js";
import { projectsPage, projectDetailsPage } from "./controllers/projects.js";
import { categoriesPage, categoryDetailsPage} from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";


const router = express.Router();

/*** Routes imported from controlers***/
router.get('/', homePage);
router.get('/organizations', organizationsPage);
router.get('/organization/:id', organizationDetailsPage);
router.get('/projects', projectsPage);
router.get('/project/:id', projectDetailsPage);
router.get('/categories', categoriesPage);
router.get('/category/:id', categoryDetailsPage);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;
