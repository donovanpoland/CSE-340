import { getAllProjects } from "../models/projects.js";
import { getMetaData } from "../utils/meta.js";

const projectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const meta = getMetaData(
        "Service Projects",
        ["service projects", "volunteering", "community events"],
        "View current service project opportunities and event details."
    );
    res.render("projects", {
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc,
        projects: projects
    });
};

// Export any controller functions
export {projectsPage};
