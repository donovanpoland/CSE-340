import db from './db.js';

// If database columns change update here to update all queries
const CATEGORY_ID = "category_id";
const CATEGORY_NAME = "cat_name";
const CATEGORY_DESCRIPTION = "cat_description";
const PROJECT_ID = "project_id";
const PROJECT_TITLE = "title";

// Gets every category with its details,
// ordered alphabetically by category name.
const getAllCategories = async() => {
    const query = `
        SELECT 
            cat.${CATEGORY_ID},
            cat.${CATEGORY_NAME},
            cat.${CATEGORY_DESCRIPTION}
        FROM public.categories cat
        ORDER BY cat.${CATEGORY_NAME} ASC; 
    `;

    // Runs the query and stores all category rows from the database.
    const result = await db.query(query);

    return result.rows;
};

// Gets the details for one category by category ID.
const getCategoryById = async(id) => {
    const query = `
    SELECT
        cat.${CATEGORY_ID},
        cat.${CATEGORY_NAME},
        cat.${CATEGORY_DESCRIPTION}
    FROM public.categories cat
    WHERE cat.${CATEGORY_ID} = $1
    `;

    const queryParams = [id];
    // Runs the query and stores the matching category details row.
    const result = await db.query(query, queryParams);

    // return only the first row
    return result.rows[0];
};

// Gets all categories linked to a specific project,
// ordered alphabetically by category name.
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            cat.${CATEGORY_ID},
            cat.${CATEGORY_NAME},
            cat.${CATEGORY_DESCRIPTION}
          FROM public.projects proj
          JOIN public.project_categories pc
          ON proj.${PROJECT_ID} = pc.${PROJECT_ID}
          JOIN public.categories cat
          ON pc.${CATEGORY_ID} = cat.${CATEGORY_ID}
          WHERE proj.${PROJECT_ID} = $1
          ORDER BY cat.${CATEGORY_NAME} ASC;
        `;

    const queryParams = [projectId];
    // Runs the query and stores all category rows linked to the selected project.
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Gets all projects associated with a specific category,
// ordered alphabetically by project title.
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            proj.${PROJECT_ID},
            proj.${PROJECT_TITLE}
        FROM public.categories cat
        JOIN public.project_categories pc
        ON cat.${CATEGORY_ID} = pc.${CATEGORY_ID}
        JOIN public.projects proj
        ON pc.${PROJECT_ID} = proj.${PROJECT_ID}
        WHERE cat.${CATEGORY_ID} = $1
        ORDER BY proj.${PROJECT_TITLE} ASC;
    `;

    const queryParams = [categoryId];
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
            WHERE ${PROJECT_ID} = $1;`, [projectId]);
        // Next, add the new category assignments
        for (const categoryId of categoryIds) {
            await client.query(
                `INSERT INTO project_categories (${CATEGORY_ID}, ${PROJECT_ID})
                VALUES ($1, $2);`, [categoryId, projectId]
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
    INSERT INTO categories (${CATEGORY_NAME}, ${CATEGORY_DESCRIPTION})
    VALUES ($1, $2)
    RETURNING ${CATEGORY_ID};
    `;
    const queryParams = [name, description];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
            throw new Error('Failed to create category');
        }
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new category with ID:', result.rows[0][CATEGORY_ID]);
    }
    return result.rows[0][CATEGORY_ID];
};

const updateCategory = async (id, name, description) => {
    const query = `
        UPDATE categories
        SET ${CATEGORY_NAME} = $1, ${CATEGORY_DESCRIPTION} = $2
        WHERE ${CATEGORY_ID} = $3
        RETURNING ${CATEGORY_ID};
    `;
    const queryParams = [name, description, id];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
      throw new Error('Category not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log('Updated Category with ID:', id);
    }
    return result.rows[0][CATEGORY_ID];
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
