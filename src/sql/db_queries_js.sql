-- *** project.js query *** --
-- get all poroject data - PAUSED
-- SELECT
--     proj.title,
--     proj.proj_description,
--     proj.event_location,
--     proj.project_datetime,
--     org.org_name AS organization_name
-- FROM public.projects proj
-- JOIN public.organization org 
-- ON proj.organization_id = org.organization_id
-- ORDER BY proj.project_datetime;

-- get upcomeing projects (getUpcomingProjects)
SELECT
    proj.project_id,
    proj.title,
    -- proj.proj_description,
    proj.project_datetime,
    proj.event_location,
    proj.organization_id,
    org.org_name AS organization_name
FROM public.projects proj
JOIN public.organization org 
ON proj.organization_id = org.organization_id
WHERE proj.project_datetime >= CURRENT_DATE
ORDER BY proj.project_datetime ASC
LIMIT $1;

-- get project details (getProjectDetails)
SELECT
    proj.project_id,
    proj.title,
    proj.proj_description,
    proj.event_location,
    proj.project_datetime,
    proj.organization_id,
    org.org_name AS organization_name
FROM public.projects proj
JOIN public.organization org 
ON proj.organization_id = org.organization_id
WHERE proj.project_id = $1

-- get projects by id (getProjectsByOrganizationId)
SELECT
    proj.project_id,
    proj.organization_id,
    proj.title,
    proj.proj_description,
    proj.event_location,
    proj.project_datetime
FROM public.projects proj
WHERE proj.organization_id = $1
ORDER BY proj.project_datetime;



-- *** organizations.js query *** --
-- get all organization data (getAllOrganizations)
SELECT 
    org.organization_id, 
    org.org_name, 
    -- org_description, 
    org.contact_email, 
    org.logo_filename
FROM public.organization org
ORDER BY org.org_name ASC;

-- get organization details (getOrganizationDetails)
SELECT
    org.organization_id,
    org.org_name,
    org.org_description,
    org.contact_email,
    org.logo_filename
FROM public.organization org
WHERE org.organization_id = $1;


-- *** categories.js *** --
-- categories.js query (getAllCategories)
SELECT
    cat.category_id,
    cat.cat_name,
    cat.cat_description
FROM public.categories cat
ORDER BY cat.cat_name ASC;

-- get category by ID (getCategoryById)
SELECT
    cat.category_id,
    cat.cat_name,
    cat.cat_description
FROM public.categories cat
WHERE cat.$category_id = $1;

-- get projects by category Ids (getProjectsByCategoryId)
SELECT
    proj.project_id,
    proj.title
FROM public.categories cat
JOIN public.project_categories pc
ON cat.category_id = pc.category_id
JOIN public.projects proj
ON pc.project_id = proj.project_id
WHERE cat.category_id = $1
ORDER BY proj.title;