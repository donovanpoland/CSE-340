// Import any needed model functions (none are needed for the home page, so this is empty)

// Define any controller functions
const homePage = async (req, res) => {
    //page title
    const title = 'Home';
    //page keywords for SEO
    const keywords = '';
    //page description
    const desc = '';
    res.render('home', { title, keywords, desc });
};

// Export any controller functions
export { homePage };