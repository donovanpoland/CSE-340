import db from './db.js';

//if database columns change update here to update all queries
const orId = "organization_id";
const orName = "org_name";
const orDesc = "org_description";
const email = "contact_email";
const fileName = "logo_filename";

// Gets all organizations with summary details,
// ordered alphabetically by organization name.
const getAllOrganizations = async() => {
    const query = `
        SELECT 
            org.${orId},
            org.${orName}, 
            org.${email}, 
            org.${fileName}
        FROM public.organizations org
        ORDER BY org.${orName} ASC;
    `;

    // Runs the query and stores all organization rows from the database.
    const result = await db.query(query);

    return result.rows;
};

// Gets the full details for one organization by organization ID.
const getOrganizationDetails = async (organizationId) => {
      const query = `
      SELECT
        org.${orId},
        org.${orName},
        org.${orDesc},
        org.${email},
        org.${fileName}
      FROM public.organizations org
      WHERE org.${orId} = $1;
    `;

      const queryParams = [organizationId];
      // Runs the query and stores the matching organization details row.
      const result = await db.query(query, queryParams);

      // Return the first row of the result set, or null if no rows are found
      return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Creates a new organization in the database.
 * @param {string} name - The name of the organization.
 * @param {string} description - A description of the organization.
 * @param {string} contactEmail - The contact email for the organization.
 * @param {string} logoFilename - The filename of the organization's logo.
 * @returns {string} The id of the newly created organization record.
 */
const createOrganization = async (name, description, contactEmail, logoFilename) => {
    const query = `
      INSERT INTO organizations (${orName}, ${orDesc}, ${email}, ${fileName})
      VALUES ($1, $2, $3, $4)
      RETURNING ${orId};
    `;

    const queryParams = [name, description, contactEmail, logoFilename];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new organization with ID:', result.rows[0][orId]);
    }

    return result.rows[0][orId];
};

const updateOrganization = async (organizationId, name, description, contactEmail) => {
    const query = `
      UPDATE organizations
      SET ${orName} = $1, ${orDesc} = $2, ${email} = $3
      WHERE ${orId} = $4
      RETURNING ${orId};
    `;
    const queryParams = [name, description, contactEmail, organizationId];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
      throw new Error('Organization not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log('Updated organization with ID:', organizationId);
    }
    return result.rows[0][orId];
};

export {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
  updateOrganization};
