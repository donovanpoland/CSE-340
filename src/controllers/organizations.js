import { getAllOrganizations } from '../models/organizations.js';

const organizationsPage = async (req, res) => {
  const organizations = await getAllOrganizations();
  // console.log(organizations);
  //page title
  const title = 'Our Partner Organizations';
  //page keywords for SEO
  const keywords = '';
  //page description
  const desc = '';
  res.render('organizations', { title, keywords, desc, organizations })
};


// Export any controller functions
export {organizationsPage};
