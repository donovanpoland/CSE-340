import { getUpcomingProjects, getProjectDetails } from "../models/projects.js";
import { formatProjectDateTime } from "../utils/datetime.js";
import { getMetaData } from "../utils/meta.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectsPage = async (req, res) => {

    const projects = (await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS)).map((project) => ({
        ...project,
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
    const project = {
        ...projectData,
        project_datetime: formatProjectDateTime(projectData.project_datetime)
    };

    const meta = getMetaData(
        `${project.title}`,
        [project.title, "Service Projects", "volunteering", "community events"],
        `View details for the ${project.title} service project.`
    );

    res.render("project", {
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc,
        project
      });
  };


// Export any controller functions
export {projectsPage, projectDetailsPage};
