import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    getCategoriesByProjectId,
    createCategory,
    updateCategory
} from "../models/categories.js";
import { getMetaData } from "../utils/meta.js";
import { getProjectDetails } from "../models/projects.js"
import { body, validationResult} from 'express-validator';

// Define validation and sanitization rules for category form
// Define validation rules for category form
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('category name is required')
        .isLength({ max: 100 })
        .withMessage('category name must be no more than 100 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('category description is required')
        .isLength({ max: 500 })
        .withMessage('category description cannot exceed 500 characters'),
];

const categoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const meta = getMetaData(
        "Service Project Categories",
        ["project categories", "service types", "volunteering"],
        "Browse service project categories to find the type of work you want to do."
    );
    res.render("categories/categories", {
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

    res.render("categories/category", {
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
            `Assign categories`,
            ["service project categories", "service categories"],
            `View details for the category and its related service projects.`
        );

    const title = 'Assign Categories to Project';

    res.render('categories/assign-categories', 
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

const newCategoryForm = async (req, res) => {

    const meta = getMetaData(
        `Create category`,
        ["New service project categories", "service categories"],
        `Create a new category of service.`
    );

    res.render('categories/new-category', {
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc
    });
};

const  processNewCategory = async (req, res) => {
    // check for validation errors
    const results = validationResult(req);
        if(!results.isEmpty()){
            // Loop through validation errors and flash them
            results.array().forEach((error) => {
                req.flash('error', error.msg);
        });
    // redirect back to the new category form
    return res.redirect('/new-category');
    }
    // Extract form data from req.body
    const {name, description} = req.body;
    try {
        // Create the new category in the database - id is returned when createCategory is used
        const newCategoryId = await createCategory(name, description);
        // Send message to user
        req.flash('success', 'Category added successfully!');
        // Redirect
        res.redirect(`/category/${newCategoryId}`);
    } catch (error) {
        // Log error
        console.error('Error creating new category:', error);
        // Send message to user
        req.flash('error', 'There was an error creating the category.');
        // Redirect
        res.redirect(`/new-category`);
    }
};

const editCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    const meta = getMetaData (
        `Edit Category`,
        [ "edit service project categories", "service categories"],
        `Edit ${category.cat_name} category details.`
    );

    res.render('categories/edit-category', {
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc,
        category
    });
};

const processEditCategory = async (req, res) => {
    // Get Id for current category
    const categoryId = req.params.id;
    // check for validation errors
    const results = validationResult(req);
        if(!results.isEmpty()){
            // Loop through validation errors and flash them
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });
    // redirect back to the new organization form
    return res.redirect(`/edit-category/${categoryId}`);
    }
    // Extract form data from req.body
    const {name, description} = req.body;
    // catch errors or update successfull
    try {
        // update the new category in the database - id is returned when createCategory is used
        const categoryID = await updateCategory(categoryId, name, description);
        // Send messgae to user
        req.flash('success', 'Category updated successfully!');
        // Redirect
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        // Log error
        console.error('Error creating new categroy:', error);
        // Send message to user
        req.flash('error', 'There was an error creating the category.');
        // Redirect
        res.redirect(`/edit-category/${categoryId}`);
    }
};

// Export any controller functions
export {
    categoriesPage, categoryDetailsPage, assignCategoriesForm, newCategoryForm, editCategoryForm,
    processNewCategory, processAssignedCategories, processEditCategory, categoryValidation
};
