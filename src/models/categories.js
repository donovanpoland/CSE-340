import db from './db.js';

// If database columns change update here to update all queries
const categoryId = "category_id";
const categoryName = "cat_name";
const categoryDescription = "cat_description";
const projectId = "project_id"
const projectTitle = "title";

// Gets every category with its details,
// ordered alphabetically by category name.
const getAllCategories = async() => {
    const query = `
        SELECT 
            cat.${categoryId},
            cat.${categoryName},
            cat.${categoryDescription}
        FROM public.categories cat
        ORDER BY cat.${categoryName} ASC; 
    `;

    // Runs the query and stores all category rows from the database.
    const result = await db.query(query);

    return result.rows;
};

// Gets the details for one category by category ID.
const getCategoryById = async(category_id) => {
    const query = `
    SELECT
        cat.${categoryId},
        cat.${categoryName},
        cat.${categoryDescription}
    FROM public.categories cat
    WHERE cat.${categoryId} = $1
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
            cat.${categoryId},
            cat.${categoryName},
            cat.${categoryDescription}
          FROM public.projects proj
          JOIN public.project_categories pc
          ON proj.${projectId} = pc.${projectId}
          JOIN public.categories cat
          ON pc.${categoryId} = cat.${categoryId}
          WHERE proj.${projectId} = $1
          ORDER BY cat.${categoryName} ASC;
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
            proj.${projectId},
            proj.${projectTitle}
        FROM public.categories cat
        JOIN public.project_categories pc
        ON cat.${categoryId} = pc.${categoryId}
        JOIN public.projects proj
        ON pc.${projectId} = proj.${projectId}
        WHERE cat.${categoryId} = $1
        ORDER BY proj.${projectTitle} ASC;
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
            WHERE ${projectId} = $1;`,[projectId]);
        // Next, add the new category assignments
        for (const categoryId of categoryIds) {
            await client.query(
                `INSERT INTO project_categories (${categoryId}, ${projectId})
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
    INSERT INTO categories (${categoryName}, ${categoryDescription})
    VALUES ($1, $2)
    RETURNING ${categoryId};
    `;
    const queryParams = [name, description];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
            throw new Error('Failed to create category');
        }
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new category with ID:', result.rows[0][categoryId]);
    }
    return result.rows[0][categoryId];
};

const updateCategory = async (categoryId, name, description) => {
    const query = `
        UPDATE categories
        SET ${categoryName} = $1, ${categoryDescription} = $2
        WHERE ${categoryId} = $3
        RETURNING ${categoryId};
    `;
    const queryParams = [name, description, categoryId];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
      throw new Error('Category not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log('Updated Category with ID:', categoryId);
    }
    return result.rows[0][categoryId];
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