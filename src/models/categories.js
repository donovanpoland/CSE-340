import db from './db.js';

// If database columns change update here to update all queries
const cId = "category_id";
const cName = "cat_name";
const cDesc = "cat_description";
const pId = "project_id"
const pTitle = "title";

// Gets every category with its details,
// ordered alphabetically by category name.
const getAllCategories = async() => {
    const query = `
        SELECT 
            cat.${cId},
            cat.${cName},
            cat.${cDesc}
        FROM public.categories cat
        ORDER BY cat.${cName} ASC; 
    `;

    // Runs the query and stores all category rows from the database.
    const result = await db.query(query);

    return result.rows;
};

// Gets the details for one category by category ID.
const getCategoryById = async(category_id) => {
    const query = `
    SELECT
        cat.${cId},
        cat.${cName},
        cat.${cDesc}
    FROM public.categories cat
    WHERE cat.${cId} = $1
    `;

    const queryParams = [category_id];
    // Runs the query and stores the matching category details row.
    const result = await db.query(query, queryParams);

    // return only the first row
    return result.rows[0];
};

// Gets all categories linked to a specific project,
// ordered alphabetically by category name.
const getCategoriesByProjectId = async(project_id) => {
    const query = `
        SELECT
            cat.${cId},
            cat.${cName},
            cat.${cDesc}
          FROM public.projects proj
          JOIN public.project_categories pc
          ON proj.${pId} = pc.${pId}
          JOIN public.categories cat
          ON pc.${cId} = cat.${cId}
          WHERE proj.${pId} = $1
          ORDER BY cat.${cName} ASC;
        `;

    const queryParams = [project_id];
    // Runs the query and stores all category rows linked to the selected project.
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Gets all projects associated with a specific category,
// ordered alphabetically by project title.
const getProjectsByCategoryId = async(category_id) => {
    const query = `
        SELECT
            proj.${pId},
            proj.${pTitle}
        FROM public.categories cat
        JOIN public.project_categories pc
        ON cat.${cId} = pc.${cId}
        JOIN public.projects proj
        ON pc.${pId} = proj.${pId}
        WHERE cat.${cId} = $1
        ORDER BY proj.${pTitle} ASC;
    `;

    const queryParams = [category_id];
    // Runs the query and stores all project rows linked to the selected category.
    const result = await db.query(query, queryParams);
     
    return result.rows;
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        // First, remove existing category assignments for the project
        await client.query(
            `DELETE FROM project_categories
            WHERE ${pId} = $1;`,[projectId]);
        // Next, add the new category assignments
        for (const categoryId of categoryIds) {
            await client.query(
                `INSERT INTO project_categories (${cId}, ${pId})
                VALUES ($1, $2);`,[categoryId, projectId]
            );
        }
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const createCategory = async (name, description) => {
    const query = `
    INSERT INTO categories (${cName}, ${cDesc})
    VALUES ($1, $2)
    RETURNING ${cId};
    `;
    const queryParams = [name, description];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
            throw new Error('Failed to create category');
        }
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new category with ID:', result.rows[0][cId]);
    }
    return result.rows[0][cId];
};

const updateCategory = async (categoryId, name, description) => {
    const query = `
        UPDATE categories
        SET ${cName} = $1, ${cDesc} = $2
        WHERE ${cId} = $3
        RETURNING ${cId};
    `;
    const queryParams = [name, description, categoryId];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
      throw new Error('Category not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log('Updated Category with ID:', categoryId);
    }
    return result.rows[0][cId];
};

export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};