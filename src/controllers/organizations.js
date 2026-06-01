import { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from "../models/projects.js";
import { getMetaData } from "../utils/meta.js";
import { body, validationResult} from 'express-validator';

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
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
];

const organizationsPage = async (req, res) => {
  const organizations = await getAllOrganizations();
  const meta = getMetaData(
    "Partner Organizations",
    ["partner organizations", "community partners", "nonprofits"],
    "Learn about the organizations connected to service projects in this network."
  );
  res.render("organizations/organizations", {
    title: meta.title,
    keywords: meta.keywords,
    desc: meta.desc,
    organizations
  })
};

const organizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organization = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const meta = getMetaData(
      "Organization Details",
      ["organization details", "partner organization", "service projects", `${organization.org_name}`],
      `Learn about ${organization.org_name} and its related service projects.`
    );
    res.render("organizations/organization", {
      title: meta.title,
      keywords: meta.keywords,
      desc: meta.desc,
      organization,
      projects
    });
};

const newOrganizationForm = async (req, res) => {

    const meta = getMetaData(
      "New Organization Form",
      ["new member form", "partner organization"],
      "Enter your organization details here to be listed."
    );

    res.render('organizations/new-organization', { 
      title: meta.title,
      keywords: meta.keywords,
      desc: meta.desc
    });
}

const processNewOrganization = async (req, res) => {
  // check for validation errors
  const results = validationResult(req);
      if(!results.isEmpty()){
          // Loop through validation errors and flash them
          results.array().forEach((error) => {
              req.flash('error', error.msg);
          });
  // Redirect back to the new organization form
  return res.redirect('/new-organization');
  }
  // Extract form data from req.body
  const { name, description, contactEmail } = req.body;
  // catch errors or update successfull
  try {
      // Use the placeholder logo for all new organizations
      const logoFilename = 'placeholder-logo.png';
      // Create the new organization in the database - id is returned when createOrganization is used
      const newOrganizationId = await createOrganization(
        name, description, contactEmail, logoFilename);
      // Send messgae to user
      req.flash('success', 'Organization added successfully!')
      // Redirect
      res.redirect(`/organization/${newOrganizationId}`);
  } catch (error) {
      // Log error
      console.error('Error creating new organization:', error);
      // Send flash message to user
      req.flash('error', 'There was an error creating your organization.');
      // Redirect
      res.redirect('/new-organization');
  }
};

const editOrganizationForm = async (req, res) => {
      const organizationId = req.params.id;
      const organization = await getOrganizationDetails(organizationId);
      const meta = getMetaData(
        "Edit Organization Form",
        ["edit organization details", `${organization.org_name}`],
        "Edit your organization information here."
      );
  
      res.render('organizations/edit-organization', { 
        title: meta.title,
        keywords: meta.keywords,
        desc: meta.desc,
        organization
      });
};

const processEditOrganization = async (req, res) => {
    // Get id for current organization
    const organizationId = req.params.id;
    // check for validation errors
    const results = validationResult(req);
        if(!results.isEmpty()){
            // Loop through validation errors and flash them
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });
    // redirect back to the new organization form
    return res.redirect(`/edit-organization/${organizationId}`);
    }
    // Extract form data from req.body
    const {name, description, contactEmail} = req.body;
    // catch errors or update successfull
    try {
        // update the project in the database - id is returned when updateProject is used
        const updatedOrganizationId =  await updateOrganization(
        organizationId, name, description, contactEmail);
        // Send flash message to user
        req.flash('success', 'Organization updated successfully!');
        // Redirect
        res.redirect(`/organization/${updatedOrganizationId}`);
    } catch (error) {
        // Log error
        console.error('Error updating organization:', error);
        // Send flash message to user
        req.flash('error', 'There was an error updating your organization.');
        // Redirect
        res.redirect(`/edit-organization/${organizationId}`);
    }
};


// Export any controller functions
export {
  organizationsPage, organizationDetailsPage, newOrganizationForm, editOrganizationForm,
  processNewOrganization, organizationValidation, processEditOrganization
};
