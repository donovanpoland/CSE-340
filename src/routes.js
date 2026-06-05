//import the express function from express
import express, { Router } from "express";

// import routes
import { homePage } from "./controllers/index.js";

// Organizations
import { 
    organizationsPage, organizationDetailsPage, newOrganizationForm, editOrganizationForm,
    processNewOrganization, processEditOrganization, organizationValidation
} from "./controllers/organizations.js";

// Projects
import { 
    projectsPage, projectDetailsPage, newProjectForm, editProjectForm,
    processNewProject, processEditedProject, projectValidation
} from "./controllers/projects.js";

// Categories
import { categoriesPage, categoryDetailsPage, assignCategoriesForm, newCategoryForm, editCategoryForm,
     processAssignedCategories, processNewCategory, processEditCategory, categoryValidation
} from "./controllers/categories.js";

// Users
import { 
    userRegistrationForm, processUserRegistration, loginForm, showDashboard,
    processLogin, processLogout,
    loginValidation, userValidation,
    requireLogin, requireRole
} from "./controllers/users.js";

import { testErrorPage } from "./controllers/errors.js";
const router = express.Router();

/*** Routes imported from controllers***/
router.get('/', homePage);
// Organizations
router.get('/organizations', organizationsPage); // open organizations list page
router.get('/organization/:id', organizationDetailsPage); //open specific organization by id page
router.get('/new-organization', requireRole('admin'), newOrganizationForm); // open form page to add new organization
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganization); //validate and process new organization submital
router.get('/edit-organization/:id', requireRole('admin'), editOrganizationForm);// open form page to edit an organization by id
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganization); // validate and process edited organization submital

// projects
router.get('/projects', projectsPage); // open projects list page
router.get('/project/:id', projectDetailsPage); // open specific project by id page
router.get('/new-project', requireRole('admin'), newProjectForm);// open form page to add new project
// validate and process new project submital then redirect to category assignment form upon success
router.post('/new-project', requireRole('admin'), projectValidation, processNewProject);
router.get('/edit-project/:id', requireRole('admin'), editProjectForm); // open form page to edit a project by id
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditedProject); // validate and process edited project submital

// categories
router.get('/categories', categoriesPage); // open categories list page
router.get('/category/:id', categoryDetailsPage); // open specific category by id page
router.get('/assign-categories/:projectId', requireRole('admin'), assignCategoriesForm); // open form for assigning category to project by id
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignedCategories); // process category to project (no validation due to no user submited data)
router.get('/new-category', requireRole('admin'), newCategoryForm);  // open form page to add new category
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategory); // validate and process new category submital
router.get('/edit-category/:id', requireRole('admin'), editCategoryForm); // open form page to edit a category by id
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategory ); // validate and process edited category submital

//users
router.get('/register', userRegistrationForm);
router.post('/register', userValidation, processUserRegistration);
router.get('/login', loginForm);
router.post('/login', loginValidation, processLogin);
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;
