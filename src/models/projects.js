import { query } from 'express-validator';
import db from './db.js';

//if database columns change update here to update all queries
//projects
const PROJECT_ID = "project_id";
const PROJECT_TITLE = "title";
const PROJECT_DESCRIPTION = "proj_description";
const PROJECT_DATETIME = "project_datetime";
const PROJECT_TIMEZONE = "project_timezone";
const PROJECT_LOCATION = "event_location";

//organizations
const ORGANIZATION_ID = "organization_id";
const ORGANIZATION_NAME = "org_name";

//categories
const CATEGORY_ID = "category_id";
const CATEGORY_NAME = "cat_name";
const CATEGORY_DESCRIPTION = "cat_description";

//users
const USER_ID = "user_id";
const FIRST_NAME = "first_name";
const LAST_NAME = "last_name";
const USER_EMAIL = "user_email";

// Gets a limited list of upcoming projects
// with their basic details and organization name.
const getUpcomingProjects = async (number_of_projects) =>{
    const query = `
        SELECT
            proj.${PROJECT_ID},
            proj.${PROJECT_TITLE},
            proj.${PROJECT_DATETIME},
            proj.${PROJECT_TIMEZONE},
            proj.${PROJECT_LOCATION},
            proj.${ORGANIZATION_ID},
            org.${ORGANIZATION_NAME} AS organization_name
        FROM public.projects proj
        JOIN public.organizations org 
        ON proj.${ORGANIZATION_ID} = org.${ORGANIZATION_ID}
        WHERE proj.${PROJECT_DATETIME} >= CURRENT_DATE
        ORDER BY proj.${PROJECT_DATETIME} ASC
        LIMIT $1;
    `;

    // Runs the query and lists the upcoming project rows from the database.
    const result = await db.query(query, [number_of_projects]);
    
    return result.rows;
};

// Gets the full details for one project,
// including the organization name, by project ID.
const getProjectDetails = async (id) => {
    const query = `
        SELECT
            proj.${PROJECT_ID},
            proj.${PROJECT_TITLE},
            proj.${PROJECT_DESCRIPTION},
            proj.${PROJECT_DATETIME},
            proj.${PROJECT_TIMEZONE},
            proj.${PROJECT_LOCATION},
            proj.${ORGANIZATION_ID},
            org.${ORGANIZATION_NAME} AS organization_name,
            COUNT(pv.${USER_ID}) AS volunteer_count
        FROM public.projects proj
        JOIN public.organizations org
            ON proj.${ORGANIZATION_ID} = org.${ORGANIZATION_ID}
        LEFT JOIN public.project_volunteers pv
            ON proj.${PROJECT_ID} = pv.${PROJECT_ID}
        WHERE proj.${PROJECT_ID} = $1
        GROUP BY
            proj.${PROJECT_ID},
            proj.${PROJECT_TITLE},
            proj.${PROJECT_DESCRIPTION},
            proj.${PROJECT_DATETIME},
            proj.${PROJECT_TIMEZONE},
            proj.${PROJECT_LOCATION},
            proj.${ORGANIZATION_ID},
            org.${ORGANIZATION_NAME}
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
          proj.${PROJECT_ID},
          proj.${ORGANIZATION_ID},
          proj.${PROJECT_TITLE},
          proj.${PROJECT_DESCRIPTION},
          proj.${PROJECT_LOCATION},
          proj.${PROJECT_DATETIME},
          proj.${PROJECT_TIMEZONE}
        FROM public.projects proj
        WHERE proj.${ORGANIZATION_ID} = $1
        ORDER BY proj.${PROJECT_DATETIME};
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
    const timestampWithTimezoneExpression = "$4::timestamp AT TIME ZONE $5";

    const query = `
          INSERT INTO projects (${PROJECT_TITLE}, ${PROJECT_DESCRIPTION}, ${PROJECT_LOCATION}, ${PROJECT_DATETIME}, ${PROJECT_TIMEZONE}, ${ORGANIZATION_ID})
          VALUES ($1, $2, $3, ${timestampWithTimezoneExpression}, $5, $6)
          RETURNING ${PROJECT_ID};
        `;
    
    const queryParams = [title, description, location, dateTime, timezone, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0][PROJECT_ID]);
    }

    return result.rows[0][PROJECT_ID];
};

const updateProject = async (projectId, title, description, dateTime, timezone, location, organizationId) => {
    const timestampWithTimezoneExpression = "$3::timestamp AT TIME ZONE $4";
    const query = `
        UPDATE projects
        SET ${PROJECT_TITLE} = $1,
            ${PROJECT_DESCRIPTION} = $2, 
            ${PROJECT_DATETIME} = ${timestampWithTimezoneExpression}, 
            ${PROJECT_TIMEZONE} = $4, 
            ${PROJECT_LOCATION} = $5, 
            ${ORGANIZATION_ID} = $6
        WHERE ${PROJECT_ID} = $7
        RETURNING ${PROJECT_ID};
    `;

    const queryParams = [title, description, dateTime, timezone, location, organizationId, projectId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('project not found');
    }
    
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', projectId);
    }
    
    return result.rows[0][PROJECT_ID];
};

const getVolunteersByProjectId = async (projectId) => {
    const query = `
      SELECT u.${USER_ID}, u.${FIRST_NAME}, u.${LAST_NAME}, u.${USER_EMAIL}
      FROM project_volunteers pv
      JOIN users u ON pv.${USER_ID} = u.${USER_ID}
      WHERE pv.${PROJECT_ID} = $1
      ORDER BY u.${LAST_NAME} ASC, u.${FIRST_NAME} ASC;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
  };

export {getUpcomingProjects, getProjectsByOrganizationId, getProjectDetails, createProject, updateProject, getVolunteersByProjectId};
