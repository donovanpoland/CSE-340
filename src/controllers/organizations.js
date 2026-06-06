import { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from "../models/projects.js";
import { getMetaData } from "../utils/meta.js";

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
  processNewOrganization, processEditOrganization
};
