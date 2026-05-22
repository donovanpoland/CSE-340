import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from "../models/projects.js";
import { getMetaData } from "../utils/meta.js";

const organizationsPage = async (req, res) => {
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

const organizationDetailsPage = async (req, res) => {
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


// Export any controller functions
export {organizationsPage, organizationDetailsPage};
