import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';
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

const loginForm = (req, res) => {

    const meta = getMetaData(
        `You have been logged out`,
        ["loggged out"],
        `You have been logged out, to gain access to your account again please login.`
    );

    res.render('users/login', { 
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc,
    });
};

const processLogin = async (req, res) => {
    // check for validation errors
    const results = validationResult(req);
        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
          });
        return res.redirect('/register');
        }

    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            // Store user info in session
            req.session.user = user;
            req.flash('success', `Welcome ${user.first_name} ${user.last_name}, you have been successfuly logged in!`);

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            res.redirect('/');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const showDashboard = (req, res) => {
    const user = req.session.user;

    const meta = getMetaData(
        `Dashboard`,
        ["dashboard", "user interface"],
        `Your user information is displayed here.`
    );

    res.render('users/dashboard', { 
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc,
        user
    });
};

// module.exports = {
//     // ... other exports
//     requireLogin
// };

export { userRegistrationForm, processUserRegistration, userValidation, processLogin, processLogout, loginForm, requireLogin, showDashboard, loginValidation };