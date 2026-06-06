import { body, validationResult} from 'express-validator';
import { getOrganizationDetails } from "../models/organizations.js";

// validation error handling middleware factory
const handleValidationErrors = (redirectTo) => {
    return (req, res, next) => {
        const results = validationResult(req);
        if (results.isEmpty()) {
            return next();
        }
        results.array().forEach((error) => {
        req.flash('error', error.msg);
    });
    const destination = typeof redirectTo === 'function' ? redirectTo(req) : redirectTo;
    return res.redirect(destination);
    };
};

// Define validation and sanitization rules for category form
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
];// end category validation

// Define validation and sanitization rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ max: 150 })
        .withMessage('Organization name must be no more than 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isLength({ max: 255 })
        .withMessage('Organization email cannot exceed 255 characters')
        .isEmail()
        .withMessage('Please provide a valid email address')
];// end organization validation

// Define validation and sanitization rules for project form
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 150 }).withMessage('Title must be no more than 150 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .custom((value) => {
              if (/^\d+$/.test(value.trim())) {
                throw new Error("Location cannot be only numbers");
              }
              return true;
            })
        .isLength({ min: 3, max: 255 }).withMessage('Location must be between 3 and 255 characters'),
    body('dateTime')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('timezone')
        .notEmpty().withMessage('Timezone is required')
        .isIn(Intl.supportedValuesOf("timeZone")).withMessage('Timezone must be a valid supported timezone'), 
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];// end project validation

const userValidation = [
    body('fname')
        .trim()
        .notEmpty()
        .withMessage('First Name required')
        .isLength({max: 100})
        .withMessage('First name must be no more than 100 characters'),
    body('lname')
        .trim()
        .notEmpty()
        .withMessage('Last Name required')
        .isLength({max: 100})
        .withMessage('Last name must be no more than 100 characters'),
    body('email')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({ max: 255 })
        .withMessage('Email cannot exceed 255 characters')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({min: 6, max: 72})
        .withMessage('Password must be between 6 and 72 characters long'),
    body('confirmPassword')
        .notEmpty()
        .withMessage('Please confirm password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    body('organizationId')
        .optional({ values: 'falsy' })
        .isInt({ min: 1 })
        .withMessage('Organization must be a valid selection')
        .custom(async (organizationId) => {
            const organization = await getOrganizationDetails(organizationId);
            if (!organization) {
                throw new Error('Organization must be a valid selection');
            }
            return true;
        })
];// end user validation

const loginValidation = [
    body('email')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];// end login validation

export {
    handleValidationErrors,
    loginValidation, userValidation, 
    projectValidation,
    organizationValidation,
    categoryValidation
};