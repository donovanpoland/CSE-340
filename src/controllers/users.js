import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';
import { getAllOrganizations } from "../models/organizations.js";
import { getMetaData } from "../utils/meta.js";
// import { body, validationResult} from 'express-validator';

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
    const { name, email, password, organizationId } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, passwordHash, organizationId);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

export { userRegistrationForm, processUserRegistration };