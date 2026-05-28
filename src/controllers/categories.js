import { getAllCategories, getCategoryById, getProjectsByCategoryId} from "../models/categories.js";
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

const categoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    const meta = getMetaData(
        `${category.cat_name}`,
        [category.cat_name, "service project categories", "service projects"],
        `View details for the ${category.cat_name} category and its related service projects.`
    );

    res.render("category", {
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc,
        category: category,
        projects: projects
    });
};

export {categoriesPage, categoryDetailsPage};
