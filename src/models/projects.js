import { query } from 'express-validator';
import db from './db.js';

//if database columns change update here to update all queries
const pId = "project_id"
const pTitle = "title";
const pDesc = "proj_description";
const pdt = "project_datetime";
const ptz = "project_timezone";
const pLoc = "event_location";

const orId = "organization_id";
const orName = "org_name";

const cId = "category_id";
const cName = "cat_name";
const cDesc = "cat_description";

// Gets a limited list of upcoming projects
// with their basic details and organization name.
const getUpcomingProjects = async (number_of_projects) =>{
    const query = `
        SELECT
            proj.${pId},
            proj.${pTitle},
            proj.${pdt},
            proj.${ptz},
            proj.${pLoc},
            proj.${orId},
            org.${orName} AS organization_name
        FROM public.projects proj
        JOIN public.organization org 
        ON proj.${orId} = org.${orId}
        WHERE proj.${pdt} >= CURRENT_DATE
        ORDER BY proj.${pdt} ASC
        LIMIT $1;
    `;

    // Runs the query and stores the upcoming project rows from the database.
    const result = await db.query(query, [number_of_projects]);
    
    return result.rows;
};

// Gets the full details for one project,
// including the organization name, by project ID.
const getProjectDetails = async (id) => {
    const query = `
        SELECT
            proj.${pId},
            proj.${pTitle},
            proj.${pDesc},
            proj.${pdt},
            proj.${ptz},
            proj.${pLoc},
            proj.${orId},
            org.${orName} AS organization_name
        FROM public.projects proj
        JOIN public.organization org 
        ON proj.${orId} = org.${orId}
        WHERE proj.${pId} = $1
    `;

    // Runs the query and stores the matching project details row.
    const result = await db.query(query, [id]);

    return result.rows[0];
};

// Gets all projects that belong to a specific organization,
// ordered by project date.
const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          proj.${pId},
          proj.${orId},
          proj.${pTitle},
          proj.${pDesc},
          proj.${pLoc},
          proj.${pdt},
          proj.${ptz}
        FROM public.projects proj
        WHERE proj.${orId} = $1
        ORDER BY proj.${pdt};
      `;
      
      const queryParams = [organizationId];
      // Runs the query and stores all project rows for the selected organization.
      const result = await db.query(query, queryParams);

      return result.rows;
};

const createProject = async (
    title, 
    description, 
    location, 
    dateTime, 
    timezone, 
    organizationId) => {
    // $4 is the date and time given from the user via html date type
    // cast to timestamp value for the database
    // Then ad the timezone with $5
    // example string would look like: '2026-06-10T09:00'::timestamp AT TIME ZONE 'America/Denver'
    const timestampTzExpression = "$4::timestamp AT TIME ZONE $5"

    const query = `
          INSERT INTO projects (${pTitle}, ${pDesc}, ${pLoc}, ${pdt}, ${ptz}, ${orId})
          VALUES ($1, $2, $3, ${timestampTzExpression}, $5, $6)
          RETURNING ${pId};
        `;
    
    const queryParams = [title, description, location, dateTime, timezone, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

const updateProject = async (projectId, title, description, dateTime, timezone, location, organizationId) => {
    const timestampTzExpression = "$3::timestamp AT TIME ZONE $4"
    const query = `
        UPDATE projects
        SET ${pTitle} = $1,
            ${pDesc} = $2, 
            ${pdt} = ${timestampTzExpression}, 
            ${ptz} = $4, 
            ${pLoc} = $5, 
            ${orId} = $6
        WHERE ${pId} = $7
        RETURNING ${pId};
    `;

    const queryParams = [title, description, dateTime, timezone, location, organizationId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('project not found');
      }
    
      if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', projectId);
      }
    
      return result.rows[0].project_id;
};

export {getUpcomingProjects, getProjectsByOrganizationId, getProjectDetails, createProject, updateProject};