import db from './db.js';

//if database columns change update here to update all queries
const cId = "category_id";
const cName = "cat_name";
const cDesc = "cat_description";
const pId = "project_id"
const pTitle = "title";

const getAllCategories = async() => {
    const query = `
        SELECT 
            cat.${cId},
            cat.${cName},
            cat.${cDesc}
        FROM public.categories cat
        ORDER BY cat.${cName}; 
    `;

    const result = await db.query(query);

    return result.rows;
};

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
    const result = await db.query(query, queryParams);

    // return only the first row
    return result.rows[0];
};

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
        ORDER BY proj.${pTitle};
    `;

    const queryParams = [category_id];
    const result = await db.query(query, queryParams);
     
    return result.rows;
};

export {getAllCategories, getCategoryById, getProjectsByCategoryId};