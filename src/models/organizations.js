import db from './db.js';

const getAllOrganizations = async() => {
    const query = `
        SELECT 
            organization_id, 
            org_name, 
            org_description, 
            contact_email, 
            logo_filename
        FROM public.organization
        ORDER BY org_name ASC;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllOrganizations};
