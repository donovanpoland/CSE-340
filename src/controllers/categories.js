import { getAllCategories } from "../models/categories.js";

const categoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    //page title
    const title = "Service Project Categories";
    //page keywords for SEO
    const keywords = '';
    //page description
    const desc = '';
    res.render('categories', { title, keywords, desc, categories });
};

export {categoriesPage};
