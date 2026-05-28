import { getMetaData } from "../utils/meta.js";

// Define any controller functions
const homePage = async (req, res) => {
    const meta = getMetaData(
        "Home",
        ["home", "community service", "volunteering"],
        "Browse local service projects and community organizations."
    );
    res.render('home', meta);
};

// Export any controller functions
export { homePage };
