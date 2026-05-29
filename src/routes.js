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

import { categoriesPage, categoryDetailsPage, processAssignedCategories, assignCategoriesForm} from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";
const router = express.Router();

/*** Routes imported from controlers***/
router.get('/', homePage);
// Organizations
router.get('/organizations', organizationsPage); // open organizations list page
router.get('/organization/:id', organizationDetailsPage); //open specific organization by id page
router.get('/new-organization', newOrganizationForm); // open form page to add new organization
router.post('/new-organization', organizationValidation, processNewOrganization); //validate and process new organization submital
router.get('/edit-organization/:id', editOrganizationForm);// open form page to edit an organization by id
router.post('/edit-organization/:id', organizationValidation, processEditOrganization); // validate and process edited organization submital

// projects
router.get('/projects', projectsPage); // open projects list page
router.get('/project/:id', projectDetailsPage); // open specific project by id page
router.get('/new-project', newProjectForm);// open form page to add new project
// validate and process new project submital then redirect to category assignment form upon success
router.post('/new-project', projectValidation, processNewProject, assignCategoriesForm); 
// router.get('/edit_project/:id', ); // open form page to edit a project by id
// router.post('/edit-project/:id', ); // validate and process edited project submital

// categories
router.get('/categories', categoriesPage); // open categories list page
router.get('/category/:id', categoryDetailsPage); // open specific category by id page
router.get('/assign-categories/:projectId', assignCategoriesForm); // open form for asigning category to project by id
router.post('/assign-categories/:projectId', processAssignedCategories); // process category to project (no validation due to no user submited data)
// router.get('/new-category', ); // open form page to add new category
// router.post('/new-category', ); // validate and proccess new category submital
// router.get('/edit-category/:id', ); // open form page to edit a category by id
// router.post('/edit-category/:id', ); // validate and proccess edited category submital



// error-handling routes
router.get('/test-error', testErrorPage);

export default router;
