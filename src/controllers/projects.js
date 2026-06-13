import { getUpcomingProjects, getProjectDetails, createProject, updateProject, getVolunteersByProjectId } from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";
import { formatProjectDateTime, formatDateTimeLocalInput } from "../utils/datetime.js";
import { getMetaData } from "../utils/meta.js";
import { getCategoriesByProjectId } from "../models/categories.js";
import { isVolunteered } from "../models/users.js";


const NUMBER_OF_UPCOMING_PROJECTS = 8;
const SUPPORTED_TIMEZONES = Intl.supportedValuesOf("timeZone");


const projectsPage = async (req, res) => {
    // get upcoming projects(limit)
    // feed array into a map to change the format of the date on each object
    const projects = (await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS))
    .map((project) => ({
        ...project, //all object data
        //format data data
        project_datetime: formatProjectDateTime(project.project_datetime, project.project_timezone)
    }));
    
    const meta = getMetaData(
        "Upcoming Service Projects",
        ["Upcoming Service Projects", "volunteering", "community events"],
        "View the next upcoming service projects and their event details."
    );

    res.render("projects/projects", {
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc,
        projects
    });
};

const projectDetailsPage = async (req, res) => {
    const userId = req.session.user?.user_id ?? null;
    const projectId = req.params.id;

    const isAdmin = req.session.user?.role_name === 'admin';
    const volunteers = isAdmin ? await getVolunteersByProjectId(projectId) : [];

    const projectData = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectData.project_id);

    const volunteerStatus = userId ? await isVolunteered(userId, projectId) : false;

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
        categories,
        isVolunteered: volunteerStatus,
        volunteers
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
    const projectId = req.params.id;
    // Extract form data from req.body
    const {title, description, dateTime, timezone, location, organizationId} = req.body;
    // catch errors or update successfull
    try {
        // update the project in the database - id is returned when updateProject is used
        const updatedProjectId = await updateProject(
            projectId, title, description, dateTime, 
            timezone, location, organizationId);
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
    processEditedProject, processNewProject
};
