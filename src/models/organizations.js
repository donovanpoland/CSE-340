import db from './db.js';

//if database columns change update here to update all queries
const ORGANIZATION_ID = "organization_id";
const ORGANIZATION_NAME = "org_name";
const ORGANIZATION_DESCRIPTION = "org_description";
const ORGANIZATION_EMAIL = "contact_email";
const ORGANIZATION_FILENAME = "logo_filename";

// Gets all organizations with summary details,
// ordered alphabetically by organization name.
const getAllOrganizations = async() => {
    const query = `
        SELECT 
            org.${ORGANIZATION_ID},
            org.${ORGANIZATION_NAME}, 
            org.${ORGANIZATION_EMAIL}, 
            org.${ORGANIZATION_FILENAME}
        FROM public.organizations org
        ORDER BY org.${ORGANIZATION_NAME} ASC;
    `;

    // Runs the query and stores all organization rows from the database.
    const result = await db.query(query);

    return result.rows;
};

// Gets the full details for one organization by organization ID.
const getOrganizationDetails = async (id) => {
      const query = `
      SELECT
        org.${ORGANIZATION_ID},
        org.${ORGANIZATION_NAME},
        org.${ORGANIZATION_DESCRIPTION},
        org.${ORGANIZATION_EMAIL},
        org.${ORGANIZATION_FILENAME}
      FROM public.organizations org
      WHERE org.${ORGANIZATION_ID} = $1;
    `;

      const queryParams = [id];
      // Runs the query and stores the matching organization details row.
      const result = await db.query(query, queryParams);

      // Return the first row of the result set, or null if no rows are found
      return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Creates a new organization in the database.
 * @param {string} name - The name of the organization.
 * @param {string} description - A description of the organization.
 * @param {string} contactEmail - The contact ORGANIZATION_EMAIL for the organization.
 * @param {string} logoFilename - The filename of the organization's logo.
 * @returns {string} The id of the newly created organization record.
 */
const createOrganization = async (name, description, contactEmail, logoFilename) => {
    const query = `
      INSERT INTO organizations (${ORGANIZATION_NAME}, ${ORGANIZATION_DESCRIPTION}, ${ORGANIZATION_EMAIL}, ${ORGANIZATION_FILENAME})
      VALUES ($1, $2, $3, $4)
      RETURNING ${ORGANIZATION_ID};
    `;

    const queryParams = [name, description, contactEmail, logoFilename];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new organization with ID:', result.rows[0][ORGANIZATION_ID]);
    }

    return result.rows[0][ORGANIZATION_ID];
};

const updateOrganization = async (id, name, description, contactEmail) => {
    const query = `
      UPDATE organizations
      SET ${ORGANIZATION_NAME} = $1, ${ORGANIZATION_DESCRIPTION} = $2, ${ORGANIZATION_EMAIL} = $3
      WHERE ${ORGANIZATION_ID} = $4
      RETURNING ${ORGANIZATION_ID};
    `;
    const queryParams = [name, description, contactEmail, id];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
      throw new Error('Organization not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log('Updated organization with ID:', id);
    }
    return result.rows[0][ORGANIZATION_ID];
};

export {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
  updateOrganization};
