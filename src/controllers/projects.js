import { getUpcomingProjects, getProjectDetails, createProject, updateProject,  } from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";
import { formatProjectDateTime, formatDateTimeLocalInput } from "../utils/datetime.js";
import { getMetaData } from "../utils/meta.js";
import { getCategoriesByProjectId } from "../models/categories.js";
import { body, validationResult} from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;
const SUPPORTED_TIMEZONES = Intl.supportedValuesOf("timeZone");
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 150 }).withMessage('Title must be no more than 150 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .custom((value) => {
              if (/^\d+$/.test(value.trim())) {
                throw new Error("Location cannot be only numbers");
              }
        
              return true;
            })
        .isLength({ min: 3, max: 255 }).withMessage('Location must be between 3 and 255 characters'),
    body('dateTime')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('timezone')
        .notEmpty().withMessage('Timezone is required')
        .isIn(SUPPORTED_TIMEZONES).withMessage('Timezone must be a valid supported timezone'), 
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
        project_datetime: formatProjectDateTime(project.project_datetime, project.project_timezone)
    }));
    
    const meta = getMetaData(
        "Upcoming Service Projects",
        ["Upcoming Service Projects", "volunteering", "community events"],
        "View the next five upcoming service projects and their event details."
    );

    res.render("projects/projects", {
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
        project_datetime: formatProjectDateTime(projectData.project_datetime, projectData.project_timezone)
    };

    const meta = getMetaData(
        `${project.title}`,
        [project.title, "Service Projects", "Volunteering", "Community Events"],
        `View details for the ${project.title} service project.`
    );

    res.render("projects/project", {
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
            ["Create New Service Projects", "New Volunteering Opportunity", "New Community Event"],
            `Enter details for the your new service project.`
        );
    
        res.render('projects/new-project', { 
            title: meta.title, 
            keywords: meta.keywords,
            desc: meta.desc,
            organizations,
            timezones: SUPPORTED_TIMEZONES
         });
};
  
const processNewProject = async (req, res) => {
    // check for validation errors
    const results = validationResult(req);
        if(!results.isEmpty()){
            // Loop through validation errors and flash them
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });
    // Redirect back to the new project form
    return res.redirect('/new-project');
    }
    // Extract form data from req.body
    const { title, description, location, dateTime, timezone, organizationId } = req.body;
    // catch errors or update successfull
    try {
        // Create the new project in the database - id is returned when createProject is used
        const newProjectId = await createProject(
            title, description, location, dateTime, timezone, organizationId);
        // Send flash message to user
        req.flash('success', 'New service project created successfully!');
        // Redirect
        res.redirect(`/assign-categories/${newProjectId}`);
    } catch (error) {
        // Log error
        console.error('Error creating new project:', error);
        // Send flash message to user
        req.flash('error', 'There was an error creating the service project.');
        // Redirect
        res.redirect('/new-project');
    }
};

const editProjectForm = async(req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    project.dateTimeInput = formatDateTimeLocalInput(
        project.project_datetime,
        project.project_timezone
      );

    const meta = getMetaData(
            "Edit project Form",
            ["edit project details", `${project.title}`],
            "Edit your project information here."
          );
    res.render('projects/edit-project', { 
            title: meta.title,
            keywords: meta.keywords,
            desc: meta.desc,
            timezones: SUPPORTED_TIMEZONES,
            organizations,
            project
          });
};

const processEditedProject = async(req, res) => {
    // Get id for current project
    const projectId = req.params.id;
    // check for validation errors
    const results = validationResult(req);
        if(!results.isEmpty()){
            // Loop through validation errors and flash them
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });
    // redirect back to the new organization form
    return res.redirect(`/edit-project/${projectId}`);
    }
    // Extract form data from req.body
    const {title, description, dateTime, timezone, location, organizationId} = req.body;
    // catch errors or update successfull
    try {
        // update the project in the database - id is returned when updateProject is used
        const updatedProjectId = await updateProject(
            projectId, title, description, dateTime, timezone, location, organizationId);
        // Send flash message to user
        req.flash('success', 'Project updated successfully!')
        // Redirect
        res.redirect(`/project/${updatedProjectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        // Send flash message to user
        req.flash('error', 'There was an error updating the project.');
        // Redirect
        res.redirect(`/edit-project/${projectId}`);
    }
};

// Export any controller functions
export {
    projectsPage, projectDetailsPage, newProjectForm, editProjectForm,
    projectValidation, processEditedProject, processNewProject
};
