import db from './db.js';

//if database columns change update here to update all queries
const pId = "project_id"
const pTitle = "title";
const pDesc = "proj_description";
const pdt = "project_datetime";
const pLoc = "event_location";
const orId = "organization_id";
const orName = "org_name";


const getUpcomingProjects = async (number_of_projects) =>{
    const query = `
        SELECT
            proj.${pId},
            proj.${pTitle},
            proj.${pdt},
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

    const result = await db.query(query, [number_of_projects]);
    
    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            proj.${pId},
            proj.${pTitle},
            proj.${pDesc},
            proj.${pLoc},
            proj.${pdt},
            proj.${orId},
            org.${orName} AS organization_name
        FROM public.projects proj
        JOIN public.organization org 
        ON proj.${orId} = org.${orId}
        WHERE proj.${pId} = $1
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
};

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          proj.${pId},
          proj.${orId},
          proj.${pTitle},
          proj.${pDesc},
          proj.${pLoc},
          proj.${pdt}
        FROM public.projects proj
        WHERE proj.${orId} = $1
        ORDER BY proj.${pdt};
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};



export {getUpcomingProjects, getProjectsByOrganizationId, getProjectDetails};