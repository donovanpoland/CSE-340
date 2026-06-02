import { query } from 'express-validator';
import db from './db.js';

//if database columns change update here to update all queries
const projectId = "project_id"
const projectTitle = "title";
const projectDescription = "proj_description";
const projectDateTime = "project_datetime";
const projectTimezone = "project_timezone";
const projectLocation = "event_location";

const organizationId = "organization_id";
const organizationName = "org_name";

const categoryId = "category_id";
const categoryName = "cat_name";
const categoryDescription = "cat_description";

// Gets a limited list of upcoming projects
// with their basic details and organization name.
const getUpcomingProjects = async (number_of_projects) =>{
    const query = `
        SELECT
            proj.${projectId},
            proj.${projectTitle},
            proj.${projectDateTime},
            proj.${projectTimezone},
            proj.${projectLocation},
            proj.${organizationId},
            org.${organizationName} AS organization_name
        FROM public.projects proj
        JOIN public.organizations org 
        ON proj.${organizationId} = org.${organizationId}
        WHERE proj.${projectDateTime} >= CURRENT_DATE
        ORDER BY proj.${projectDateTime} ASC
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
            proj.${projectId},
            proj.${projectTitle},
            proj.${projectDescription},
            proj.${projectDateTime},
            proj.${projectTimezone},
            proj.${projectLocation},
            proj.${organizationId},
            org.${organizationName} AS organization_name
        FROM public.projects proj
        JOIN public.organizations org 
        ON proj.${organizationId} = org.${organizationId}
        WHERE proj.${projectId} = $1
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
          proj.${projectId},
          proj.${organizationId},
          proj.${projectTitle},
          proj.${projectDescription},
          proj.${projectLocation},
          proj.${projectDateTime},
          proj.${projectTimezone}
        FROM public.projects proj
        WHERE proj.${organizationId} = $1
        ORDER BY proj.${projectDateTime};
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
    const timestamprojectTimezoneExpression = "$4::timestamp AT TIME ZONE $5"

    const query = `
          INSERT INTO projects (${projectTitle}, ${projectDescription}, ${projectLocation}, ${projectDateTime}, ${projectTimezone}, ${organizationId})
          VALUES ($1, $2, $3, ${timestamprojectTimezoneExpression}, $5, $6)
          RETURNING ${projectId};
        `;
    
    const queryParams = [title, description, location, dateTime, timezone, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0][projectId]);
    }

    return result.rows[0][projectId];
};

const updateProject = async (projectId, title, description, dateTime, timezone, location, organizationId) => {
    const timestamprojectTimezoneExpression = "$3::timestamp AT TIME ZONE $4"
    const query = `
        UPDATE projects
        SET ${projectTitle} = $1,
            ${projectDescription} = $2, 
            ${projectDateTime} = ${timestamprojectTimezoneExpression}, 
            ${projectTimezone} = $4, 
            ${projectLocation} = $5, 
            ${organizationId} = $6
        WHERE ${projectId} = $7
        RETURNING ${projectId};
    `;

    const queryParams = [title, description, dateTime, timezone, location, organizationId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('project not found');
    }
    
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', projectId);
    }
    
    return result.rows[0][projectId];
};

export {getUpcomingProjects, getProjectsByOrganizationId, getProjectDetails, createProject, updateProject};