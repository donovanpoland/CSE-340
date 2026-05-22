import { getAllCategories } from "../models/categories.js";
import { getMetaData } from "../utils/meta.js";

const categoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const meta = getMetaData(
        "Service Project Categories",
        ["project categories", "service types", "volunteering"],
        "Browse service project categories to find the type of work you want to do."
    );
    res.render("categories", {
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc,
        categories: categories
    });
};

export {categoriesPage};
