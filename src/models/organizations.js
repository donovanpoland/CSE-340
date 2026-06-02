import db from './db.js';

//if database columns change update here to update all queries
const organizationId = "organization_id";
const organizationName = "org_name";
const organizationDescription = "org_description";
const organizationEmail = "contact_email";
const organizationFilename = "logo_filename";

// Gets all organizations with summary details,
// ordered alphabetically by organization name.
const getAllOrganizations = async() => {
    const query = `
        SELECT 
            org.${organizationId},
            org.${organizationName}, 
            org.${organizationEmail}, 
            org.${organizationFilename}
        FROM public.organizations org
        ORDER BY org.${organizationName} ASC;
    `;

    // Runs the query and stores all organization rows from the database.
    const result = await db.query(query);

    return result.rows;
};

// Gets the full details for one organization by organization ID.
const getOrganizationDetails = async (organizationId) => {
      const query = `
      SELECT
        org.${organizationId},
        org.${organizationName},
        org.${organizationDescription},
        org.${organizationEmail},
        org.${organizationFilename}
      FROM public.organizations org
      WHERE org.${organizationId} = $1;
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
 * @param {string} contactEmail - The contact organizationEmail for the organization.
 * @param {string} logoFilename - The filename of the organization's logo.
 * @returns {string} The id of the newly created organization record.
 */
const createOrganization = async (name, description, contactEmail, logoFilename) => {
    const query = `
      INSERT INTO organizations (${organizationName}, ${organizationDescription}, ${organizationEmail}, ${organizationFilename})
      VALUES ($1, $2, $3, $4)
      RETURNING ${organizationId};
    `;

    const queryParams = [name, description, contactEmail, logoFilename];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new organization with ID:', result.rows[0][organizationId]);
    }

    return result.rows[0][organizationId];
};

const updateOrganization = async (organizationId, name, description, contactEmail) => {
    const query = `
      UPDATE organizations
      SET ${organizationName} = $1, ${organizationDescription} = $2, ${organizationEmail} = $3
      WHERE ${organizationId} = $4
      RETURNING ${organizationId};
    `;
    const queryParams = [name, description, contactEmail, organizationId];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
      throw new Error('Organization not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log('Updated organization with ID:', organizationId);
    }
    return result.rows[0][organizationId];
};

export {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
  updateOrganization};
