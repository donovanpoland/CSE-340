//import the express function from express
import { Router } from "express";

// import routes
import { homePage } from "./controllers/index.js";

// Validation
import { userValidation, loginValidation, organizationValidation, categoryValidation, projectValidation, handleValidationErrors, userEditValidation } from "./controllers/validation.js";

// Organizations
import { 
    organizationsPage, organizationDetailsPage, newOrganizationForm, editOrganizationForm,
    processNewOrganization, processEditOrganization
} from "./controllers/organizations.js";

// Projects
import { 
    projectsPage, projectDetailsPage, newProjectForm, editProjectForm,
    processNewProject, processEditedProject
} from "./controllers/projects.js";

// Categories
import { categoriesPage, categoryDetailsPage, assignCategoriesForm, newCategoryForm, editCategoryForm,
     processAssignedCategories, processNewCategory, processEditCategory
} from "./controllers/categories.js";

// Users
import { 
    userRegistrationForm, processUserRegistration, loginForm, showDashboard, showAllUsers, showEditUserForm,
    processLogin, processLogout, processEditUser, processVolunteer, processUnvolunteer,
    requireLogin, requireRole, requireSelf
} from "./controllers/users.js";

import { testErrorPage } from "./controllers/errors.js";

const router = Router();

/*** Routes imported from controllers***/
router.get('/', homePage);
// Organizations
router.get('/organizations', organizationsPage); // open organizations list page
router.get('/organization/:id', organizationDetailsPage); //open specific organization by id page
router.get('/new-organization', requireRole('admin'), newOrganizationForm); // open form page to add new organization
router.post(
    '/new-organization', //route
    requireRole('admin'), //require role
    organizationValidation, //validation
    handleValidationErrors('/new-organization'),// handle validation errors
    processNewOrganization // process new organization submital
); 
router.get('/edit-organization/:id', requireRole('admin'), editOrganizationForm);// open form page to edit an organization by id
router.post(
    '/edit-organization/:id', //route
    requireRole('admin'), //require role
    organizationValidation, //validation
    handleValidationErrors((req) => `/edit-organization/${req.params.id}`), // handle validation errors
    processEditOrganization // process edited organization submital
); 

// projects
router.get('/projects', projectsPage); // open projects list page
router.get('/project/:id', projectDetailsPage); // open specific project by id page
router.get('/new-project', requireRole('admin'), newProjectForm);// open form page to add new project
router.post(
    '/new-project', //route
    requireRole('admin'), //require role
    projectValidation, //validation
    handleValidationErrors('/new-project'), // handle validation errors
    processNewProject // process new project submital
);
router.get('/edit-project/:id', requireRole('admin'), editProjectForm); // open form page to edit a project by id
router.post(
    '/edit-project/:id', //route
    requireRole('admin'), //require role
    projectValidation, //validation
    handleValidationErrors((req) => `/edit-project/${req.params.id}`), // handle validation errors
    processEditedProject // process new project submital
);
router.post('/project/:id/volunteer', requireLogin, processVolunteer);
router.post('/project/:id/unvolunteer', requireLogin, processUnvolunteer);

// categories
router.get('/categories', categoriesPage); // open categories list page
router.get('/category/:id', categoryDetailsPage); // open specific category by id page
router.get('/assign-categories/:projectId', requireRole('admin'), assignCategoriesForm); // open form for assigning category to project by id
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignedCategories); // process category to project (no validation due to no user submited data)
router.get('/new-category', requireRole('admin'), newCategoryForm);  // open form page to add new category
router.post(
    '/new-category',
    requireRole('admin'),
    categoryValidation,
    handleValidationErrors('/new-category'),
    processNewCategory
); // validate and process new category submital
router.get('/edit-category/:id', requireRole('admin'), editCategoryForm); // open form page to edit a category by id
router.post(
    '/edit-category/:id',
    requireRole('admin'),
    categoryValidation,
    handleValidationErrors((req) => `/edit-category/${req.params.id}`),
    processEditCategory
); // validate and process edited category submital

//users
router.get('/register', userRegistrationForm);
router.post(
    '/register',
    userValidation,
    handleValidationErrors('/register'),
    processUserRegistration
);
router.get('/login', loginForm);
router.post(
    '/login',
    loginValidation,
    handleValidationErrors('/login'),
    processLogin
);
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireRole('admin'), showAllUsers);
router.get('/edit-user/:id', requireLogin, requireSelf, showEditUserForm);
router.post(
    '/edit-user/:id', 
    requireLogin,
    requireSelf,
    userEditValidation,
    handleValidationErrors((req) => `/edit-user/${req.params.id}`),
    processEditUser);


// error-handling routes
router.get('/test-error', testErrorPage);

export default router;
