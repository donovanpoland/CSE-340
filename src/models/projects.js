import db from './db.js';

const getAllProjects = async() => {
    const query = `
        SELECT
          proj.title,
          proj.proj_description,
          proj.event_location,
          proj.project_datetime,
          org.org_name AS organization_name
          FROM public.projects proj
          JOIN public.organization org 
          ON proj.organization_id = org.organization_id
          ORDER BY proj.project_datetime;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects};