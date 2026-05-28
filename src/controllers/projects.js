import { getUpcomingProjects, getProjectDetails, createProject } from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";
import { formatProjectDateTime } from "../utils/datetime.js";
import { getMetaData } from "../utils/meta.js";
import { getCategoriesByProjectId } from "../models/categories.js";
import { body, validationResult} from 'express-validator';


const NUMBER_OF_UPCOMING_PROJECTS = 5;

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
        projects: projects
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

// Export any controller functions
export {projectsPage, projectDetailsPage, showNewProjectForm};
