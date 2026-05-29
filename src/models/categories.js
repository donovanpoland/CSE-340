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

const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (${cId}, ${pId})
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE ${pId} = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

export {getAllCategories, getCategoryById, getCategoriesByProjectId, getProjectsByCategoryId, updateCategoryAssignments};