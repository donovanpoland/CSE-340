//import the express function from express
import express, { Router } from "express";

// import routes
import { homePage } from "./controllers/index.js";
import { 
    organizationsPage, organizationDetailsPage, newOrganizationForm, editOrganizationForm,
    processNewOrganization, processEditOrganization, organizationValidation
} from "./controllers/organizations.js";

import { 
    projectsPage, projectDetailsPage, newProjectForm,
    processNewProject, projectValidation
} from "./controllers/projects.js";

import { categoriesPage, categoryDetailsPage} from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";
const router = express.Router();

/*** Routes imported from controlers***/
router.get('/', homePage);
// Organizations
router.get('/organizations', organizationsPage);
router.get('/organization/:id', organizationDetailsPage);
router.get('/new-organization', newOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganization);
router.get('/edit-organization/:id', editOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganization);

// projects
router.get('/projects', projectsPage);
router.get('/project/:id', projectDetailsPage);
router.get('/new-project', newProjectForm);
router.post('/new-project', projectValidation, processNewProject);
// router.get('/edit_project/:id', );
// router.post('/edit-project/:id', );

// categories
router.get('/categories', categoriesPage);
router.get('/category/:id', categoryDetailsPage);



// error-handling routes
router.get('/test-error', testErrorPage);

export default router;
