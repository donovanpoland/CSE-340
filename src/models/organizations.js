import db from './db.js';

//if database columns change update here to update all queries
const orId = "organization_id";
const orName = "org_name";
const orDesc = "org_description";
const email = "contact_email";
const fileName = "logo_filename";

const getAllOrganizations = async() => {
    const query = `
        SELECT 
            org.${orId},
            org.${orName}, 
            org.${email}, 
            org.${fileName}
        FROM public.organization org
        ORDER BY org.${orName} ASC;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getOrganizationDetails = async (organizationId) => {
      const query = `
      SELECT
        org.${orId},
        org.${orName},
        org.${orDesc},
        org.${email},
        org.${fileName}
      FROM public.organization org
      WHERE org.${orId} = $1;
    `;

      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      // Return the first row of the result set, or null if no rows are found
      return result.rows.length > 0 ? result.rows[0] : null;
};

export {getAllOrganizations, getOrganizationDetails};
