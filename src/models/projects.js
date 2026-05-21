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

const getUpcomingProjects = async (number_of_projects) =>{
    const query = `
        SELECT
            proj.project_id,
            proj.title,
            proj.description,
            proj.date,
            proj.location,
            proj.organization_id,
            org.org_name AS organization_name
        FROM public.project proj
        JOIN public.organization org ON p.organization_id = org.organization_id
        WHERE proj.project_datetime >= CURRENT_DATE
        ORDER BY proj.project_datetime ASC
        LIMIT $1;
    `;
}


export {getAllProjects, getUpcomingProjects};