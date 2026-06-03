import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';
import { getAllOrganizations, getOrganizationDetails } from "../models/organizations.js";
import { getMetaData } from "../utils/meta.js";
import { body, validationResult} from 'express-validator';

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
        .isLength({min: 8, max: 72})
        .withMessage('Password must be between 8 and 72 characters long'),
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
];



const userRegistrationForm = async (req, res) => {

    const organizations = await getAllOrganizations();
    const meta = getMetaData(
        "Registation",
        ["Create New user", "New to Service Network", "Join"],
        `Enter user details to register for an account.`
    );

    res.render('users/register', { 
       title: meta.title, 
       keywords: meta.keywords,
       desc: meta.desc,
       organizations
    });
};

const processUserRegistration = async (req, res) => {
    // check for validation errors
    const results = validationResult(req);
      if (!results.isEmpty()) {
          results.array().forEach((error) => {
              req.flash('error', error.msg);
          });
          return res.redirect('/register');
      }

    const { fname, lname, email, password, organizationId } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        await createUser(fname, lname, email, passwordHash, organizationId);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        if (error.code === '23505' && error.constraint === 'users_user_email_key') {
                  req.flash('error', 'That email is already registered. Please log in or use a different email.');
                  return res.redirect('/register');
              }
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

export { userRegistrationForm, processUserRegistration, userValidation };