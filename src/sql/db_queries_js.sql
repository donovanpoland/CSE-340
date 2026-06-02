-- *** projects.js queries *** --
-- get all project data - PAUSED
-- SELECT
--     proj.title,
--     proj.proj_description,
--     proj.event_location,
--     proj.project_datetime,
--     proj.project_timezone,
--     org.org_name AS organization_name
-- FROM public.projects proj
-- JOIN public.organizations org
-- ON proj.organization_id = org.organization_id
-- ORDER BY proj.project_datetime;

-- get upcoming projects (getUpcomingProjects)
SELECT
    proj.project_id,
    proj.title,
    proj.project_datetime,
    proj.project_timezone,
    proj.event_location,
    proj.organization_id,
    org.org_name AS organization_name
FROM public.projects proj
JOIN public.organizations org
ON proj.organization_id = org.organization_id
WHERE proj.project_datetime >= CURRENT_DATE
ORDER BY proj.project_datetime ASC
LIMIT $1;

-- get project details (getProjectDetails)
SELECT
    proj.project_id,
    proj.title,
    proj.proj_description,
    proj.project_datetime,
    proj.project_timezone,
    proj.event_location,
    proj.organization_id,
    org.org_name AS organization_name
FROM public.projects proj
JOIN public.organizations org
ON proj.organization_id = org.organization_id
WHERE proj.project_id = $1

-- get projects by id (getProjectsByOrganizationId)
SELECT
    proj.project_id,
    proj.organization_id,
    proj.title,
    proj.proj_description,
    proj.event_location,
    proj.project_datetime,
    proj.project_timezone
FROM public.projects proj
WHERE proj.organization_id = $1
ORDER BY proj.project_datetime;

-- create project (createProject)
INSERT INTO projects (
    title,
    proj_description,
    event_location,
    project_datetime,
    project_timezone,
    organization_id
)
VALUES (
    $1,
    $2,
    $3,
    $4::timestamp AT TIME ZONE $5,
    $5,
    $6
)
RETURNING project_id;

-- update project (updateProject)
UPDATE projects
SET title = $1,
    proj_description = $2,
    project_datetime = $3::timestamp AT TIME ZONE $4,
    project_timezone = $4,
    event_location = $5,
    organization_id = $6
WHERE project_id = $7
RETURNING project_id;

-- *** organizations.js queries *** --
-- get all organization data (getAllOrganizations)
SELECT 
    org.organization_id, 
    org.org_name, 
    org.contact_email, 
    org.logo_filename
FROM public.organizations org
ORDER BY org.org_name ASC;

-- get organization details (getOrganizationDetails)
SELECT
    org.organization_id,
    org.org_name,
    org.org_description,
    org.contact_email,
    org.logo_filename
FROM public.organizations org
WHERE org.organization_id = $1;

-- create organization (createOrganization)
INSERT INTO organizations (
    org_name,
    org_description,
    contact_email,
    logo_filename
)
VALUES ($1, $2, $3, $4)
RETURNING organization_id;

-- update organization (updateOrganization)
UPDATE organizations
SET org_name = $1,
    org_description = $2,
    contact_email = $3
WHERE organization_id = $4
RETURNING organization_id;

-- *** categories.js queries *** --
-- get all categories (getAllCategories)
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
WHERE cat.category_id = $1;

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

-- get categories by project id (getCategoriesByProjectId,)
SELECT
    cat.category_id,
    cat.cat_name,
    cat.cat_description
FROM public.projects proj
JOIN public.project_categories pc
ON proj.project_id = pc.project_id
JOIN public.categories cat
ON pc.category_id = cat.category_id
WHERE proj.project_id = $1
ORDER BY cat.cat_name;

-- update category assignments (updateCategoryAssignments)
BEGIN;

DELETE FROM project_categories
WHERE project_id = $1;

INSERT INTO project_categories (
    category_id,
    project_id
)
VALUES ($1, $2);

COMMIT;

-- create category (createCategory)
INSERT INTO categories (
    cat_name,
    cat_description
)
VALUES ($1, $2)
RETURNING category_id;

-- update category (updateCategory)
UPDATE categories
SET cat_name = $1,
    cat_description = $2
WHERE category_id = $3
RETURNING category_id;

-- *** db.js query *** --
-- test database connection (testConnection)
SELECT NOW() AS current_time;
