import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers, getUserInfo, updateUserById, getUserSessionInfoById, assignVolunteer, unassignVolunteer, getAllVolunteeredProjects } from '../models/users.js';
import { getAllOrganizations } from "../models/organizations.js";
import { getMetaData } from "../utils/meta.js";
import { formatProjectDateTime } from '../utils/datetime.js';


const userRegistrationForm = async (req, res) => {

    const organizations = await getAllOrganizations();
    const meta = getMetaData(
        "Registration",
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

const requireSelf = (req, res, next) => {
    if (!req.session?.user) {
        req.flash('error', 'You must be logged in.');
        return res.redirect('/login');
    }
    if (req.session.user.user_id !== Number(req.params.id)) {
        req.flash('error', 'You can only edit your own account.');
        return res.redirect('/dashboard');
    }
    next();
};

const showDashboard =  async (req, res) => {
    const user = req.session.user;
    const projects = (await getAllVolunteeredProjects(user.user_id))
    .map((project) => ({
            ...project, //all object data
            //format data data
            project_datetime: formatProjectDateTime(project.project_datetime, project.project_timezone)
        }));

    const meta = getMetaData(
        `Dashboard`,
        ["dashboard", "user interface"],
        `Your user information is displayed here.`
    );

    res.render('users/dashboard', { 
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc,
        user,
        projects,
    });
};

const showAllUsers = async (req, res) => {
    const users = await getAllUsers();

    const meta = getMetaData(
        `All users`,
        ["all users", "user list"],
        `List of all users for Admin use only.`
    );

    res.render('users/users', { 
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc,
        users
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

const showEditUserForm = async (req, res) => {
    const userId = req.params.id;
    const organizations = await getAllOrganizations();
    const user = await getUserInfo(userId);
    
    const meta = getMetaData(
        `Edit Your Information`,
        ["edit user", "change user info"],
        `Edit your user information is here.`
    );
    
    res.render('users/edit-user', { 
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc,
        user,
        organizations
    });

};

const processEditUser = async (req, res) => {
    const userId = req.params.id;
    // Extract form data from req.body
    const {firstName, lastName, userEmail, organizationId} = req.body;
    // catch errors or update successfull
    try {
        // update the user in the database - id is returned when updateUserById is used
        await updateUserById(firstName, lastName, userEmail, organizationId, userId);
        // update user info in session
        req.session.user = await getUserSessionInfoById(userId);
        // Send flash message to user
        req.flash('success', `${firstName} ${lastName} your info has been updated successfully!`)
        // Redirect
        res.redirect(`/dashboard`);
    } catch (error) {
        console.error('Error updating user info:', error);
        // Send flash message to user
        req.flash('error', 'There was an error updating the your info.');
        // Redirect
        res.redirect(`/edit-user/${userId}`);
    }
};

// add volunteer status
const processVolunteer = async(req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    try {
        // update the user as volunteered for a project in the database
        await assignVolunteer(userId, projectId);
        // update user info in session
        req.session.user = await getUserSessionInfoById(userId);
        // Send flash message to user
        req.flash('success', 'You have signed up for this project');
        // Redirect
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating user info with volunteer status:', error);
        // Send flash message to user
        req.flash('error', 'There was an error when volunteering.');
        // Redirect
        res.redirect(`/project/${projectId}`);
    }
};

// remove volunteer status
const processUnvolunteer = async(req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    const redirectTo = req.body.redirectTo;
    try {
        // update the user as volunteered for a project in the database
        await unassignVolunteer(userId, projectId);
        // update user info in session
        req.session.user = await getUserSessionInfoById(userId);
        // Send flash message to user
        req.flash('success', 'You have removed this project');
        // Redirect
        if (redirectTo === 'dashboard') {
            // early redirect if on dashboard
            return res.redirect('/dashboard');
        }
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating user info with volunteer status:', error);
        // Send flash message to user
        req.flash('error', 'There was an error when updating volunteer status.');
        // Redirect
        if (redirectTo === 'dashboard') {
            // early redirect if on dashboard
            return res.redirect('/dashboard');
        }
        // if not on dash board continue here
        res.redirect(`/project/${projectId}`);
    }
};

export {
    //pages
    userRegistrationForm, loginForm, showDashboard, showAllUsers, showEditUserForm,
    //processing
    processUserRegistration, processLogin, processLogout, processEditUser, processVolunteer, processUnvolunteer,
    //required
    requireLogin, requireRole, requireSelf
};