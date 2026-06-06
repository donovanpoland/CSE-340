import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';
import { getAllOrganizations } from "../models/organizations.js";
import { getMetaData } from "../utils/meta.js";


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

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has required role, continue
        next();
    };
};

export {
    //pages
    userRegistrationForm, loginForm, showDashboard,
    //proccessing
    processUserRegistration, processLogin, processLogout,
    //required
    requireLogin, requireRole 
};