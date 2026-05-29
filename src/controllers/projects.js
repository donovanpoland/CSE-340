import { getUpcomingProjects, getProjectDetails, createProject } from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";
import { formatProjectDateTime } from "../utils/datetime.js";
import { getMetaData } from "../utils/meta.js";
import { getCategoriesByProjectId } from "../models/categories.js";
import { body, validationResult} from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('dateTime')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const projectsPage = async (req, res) => {
    // get upcoming projects(limit)
    // feed array into a map to change the format of the date on each object
    const projects = (await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS))
    .map((project) => ({
        ...project, //all object data
        project_datetime: formatProjectDateTime(project.project_datetime)
    }));
    
    const meta = getMetaData(
        "Upcoming Service Projects",
        ["Upcoming Service Projects", "volunteering", "community events"],
        "View the next five upcoming service projects and their event details."
    );

    res.render("projects", {
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc,
        projects
    });
};

const projectDetailsPage = async (req, res) => {
    const { id } = req.params;
    const projectData = await getProjectDetails(id);
    const categories = await getCategoriesByProjectId(projectData.project_id);
    const project = {
        ...projectData, //all object data
        project_datetime: formatProjectDateTime(projectData.project_datetime)
    };

    const meta = getMetaData(
        `${project.title}`,
        [project.title, "Service Projects", "Volunteering", "Community Events"],
        `View details for the ${project.title} service project.`
    );

    res.render("project", {
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc,
        project,
        categories
      });
};

const newProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
        const meta = getMetaData(
            "Add New Service Project",
            ["Create New Service Projects", "New Volunteering Opperturnity", "New Community Event"],
            `Enter details for the your new service project.`
        );
    
        res.render('new-project', { 
            title: meta.title, 
            keywords: meta.keywords,
            desc: meta.desc,
            organizations,
         });
};
  
const processNewProject = async (req, res) => {

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }
    // Extract form data from req.body
    const { title, description, location, dateTime, timezone, organizationId } = req.body;

    try {
        // Create the new project in the database - id is returned when createProject is used
        const newProjectId = await createProject(title, description, location, dateTime, timezone, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/assign-categories/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

// Export any controller functions
export {projectsPage, projectDetailsPage, newProjectForm, processNewProject, projectValidation};
