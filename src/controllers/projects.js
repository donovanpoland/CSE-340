import { getAllProjects } from "../models/projects.js";

const projectsPage = async (req, res) => {
    const projects = await getAllProjects();
    //console.log(projects);
    //page title
    const title = 'Service Projects';
    //page keywords for SEO
    const keywords = '';
    //page description
    const desc = '';
    res.render('projects', { title, keywords, desc, projects });
};

// Export any controller functions
export {projectsPage};
