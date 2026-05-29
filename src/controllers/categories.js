import { getAllCategories, getCategoryById, getProjectsByCategoryId, updateCategoryAssignments, getCategoriesByProjectId} from "../models/categories.js";
import { getMetaData } from "../utils/meta.js";
import { getProjectDetails } from "../models/projects.js"

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
        categories
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
        category,
        projects
    });
};

const assignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const project = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const meta = getMetaData(
            ``,
            ["service project categories", "service projects"],
            `View details for the category and its related service projects.`
        );

    const title = 'Assign Categories to Project';

    res.render('assign-categories', 
        { 
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc, 
        projectId, 
        project, 
        categories, 
        assignedCategories });
};

const processAssignedCategories = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

export {categoriesPage, categoryDetailsPage, processAssignedCategories, assignCategoriesForm};
