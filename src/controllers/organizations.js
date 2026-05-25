import { getAllOrganizations, getOrganizationDetails, createOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from "../models/projects.js";
import { getMetaData } from "../utils/meta.js";

const organizationsPage = async (req, res, next) => {
  const organizations = await getAllOrganizations();
  const meta = getMetaData(
    "Our Partner Organizations",
    ["partner organizations", "community partners", "nonprofits"],
    "Learn about the organizations connected to service projects in this network."
  );
  res.render("organizations", {
    title: meta.title,
    keywords: meta.keywords,
    desc: meta.desc,
    organizations: organizations
  })
};

const organizationDetailsPage = async (req, res, next) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const meta = getMetaData(
      "Organization Details",
      ["organization details", "partner organization", "service projects", `${organizationDetails.org_name}`],
      `Learn about ${organizationDetails.org_name} and its related service projects.`
    );
    res.render("organization", {
      title: meta.title,
      keywords: meta.keywords,
      desc: meta.desc,
      organizationDetails: organizationDetails,
      projects: projects
    });
};

const newOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    const meta = getMetaData(
      "New Organization Form",
      ["", "partner organization", "service projects",],
      ""
    );

    res.render('new-organization', { 
      title: meta.title,
      keywords: meta.keywords,
      desc: meta.desc,

    });
}

const processNewOrganizationForm = async (req, res) => {
    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    res.redirect(`/organization/${organizationId}`);
};


// Export any controller functions
export {organizationsPage, organizationDetailsPage, newOrganizationForm, processNewOrganizationForm};
