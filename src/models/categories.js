import db from './db.js';

const getAllCategories = async() => {
    const query = `
        SELECT 
            category_id,
            cat_name,
            cat_description
        FROM public.categories
        ORDER BY cat_name; 
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllCategories};