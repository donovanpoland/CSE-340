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
    org.org_name AS organization_name,
    COUNT(pv.user_id) AS volunteer_count
FROM public.projects proj
JOIN public.organizations org
ON proj.organization_id = org.organization_id
LEFT JOIN public.project_volunteers pv
ON proj.project_id = pv.project_id
WHERE proj.project_id = $1
GROUP BY
    proj.project_id,
    proj.title,
    proj.proj_description,
    proj.project_datetime,
    proj.project_timezone,
    proj.event_location,
    proj.organization_id,
    org.org_name;

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

-- get volunteers by project id (getVolunteersByProjectId)
SELECT
    u.user_id,
    u.first_name,
    u.last_name,
    u.user_email
FROM project_volunteers pv
JOIN users u
ON pv.user_id = u.user_id
WHERE pv.project_id = $1
ORDER BY u.last_name ASC, u.first_name ASC;

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

-- on error:
ROLLBACK;

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

-- *** users.js queries *** --
-- create user (createUser)
INSERT INTO users (
    first_name,
    last_name,
    user_email,
    password_hash,
    role_id,
    organization_id
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    (SELECT role_id FROM roles WHERE role_name = $5),
    $6
)
RETURNING user_id;

-- find user by email (findUserByEmail)
SELECT
    u.user_id,
    u.first_name,
    u.last_name,
    u.user_email,
    u.password_hash,
    u.role_id,
    r.role_name,
    u.organization_id,
    o.org_name
FROM users u
JOIN roles r
ON u.role_id = r.role_id
LEFT JOIN organizations o
ON u.organization_id = o.organization_id
WHERE u.user_email = $1;

-- authenticate user (authenticateUser)
-- No separate SQL query.
-- This function calls findUserByEmail, then verifies the password in Node with bcrypt.

-- get all users (getAllUsers)
SELECT
    TRIM(CONCAT(u.first_name, ' ', u.last_name)) AS full_name,
    u.user_email,
    u.role_id,
    r.role_name,
    u.organization_id,
    o.org_name,
    COUNT(pv.project_id) AS volunteer_count
FROM users u
JOIN roles r
ON u.role_id = r.role_id
LEFT JOIN organizations o
ON u.organization_id = o.organization_id
LEFT JOIN project_volunteers pv
ON u.user_id = pv.user_id
GROUP BY
    u.user_id,
    u.first_name,
    u.last_name,
    u.user_email,
    u.role_id,
    r.role_name,
    u.organization_id,
    o.org_name
ORDER BY full_name ASC;

-- get user info (getUserInfo)
SELECT
    u.user_id,
    u.first_name,
    u.last_name,
    u.user_email,
    u.organization_id,
    o.org_name
FROM users u
LEFT JOIN organizations o
ON u.organization_id = o.organization_id
WHERE u.user_id = $1;

-- update user by id (updateUserById)
UPDATE users
SET first_name = $1,
    last_name = $2,
    user_email = $3,
    organization_id = $4
WHERE user_id = $5
RETURNING user_id;

-- get user session info by id (getUserSessionInfoById)
SELECT
    u.user_id,
    u.first_name,
    u.last_name,
    u.user_email,
    r.role_name,
    u.organization_id,
    o.org_name
FROM users u
JOIN roles r
ON u.role_id = r.role_id
LEFT JOIN organizations o
ON u.organization_id = o.organization_id
WHERE u.user_id = $1;

-- assign volunteer (assignVolunteer)
INSERT INTO project_volunteers (
    user_id,
    project_id
)
VALUES ($1, $2)
ON CONFLICT (project_id, user_id) DO NOTHING
RETURNING user_id, project_id;

-- unassign volunteer (unassignVolunteer)
DELETE FROM project_volunteers
WHERE user_id = $1
AND project_id = $2
RETURNING user_id, project_id;

-- get all volunteered projects (getAllVolunteeredProjects)
SELECT
    p.project_id,
    p.title,
    p.proj_description,
    p.event_location,
    p.project_datetime,
    p.project_timezone
FROM project_volunteers pv
JOIN projects p
ON pv.project_id = p.project_id
WHERE pv.user_id = $1
ORDER BY p.project_datetime ASC;

-- is volunteered (isVolunteered)
SELECT 1
FROM project_volunteers
WHERE user_id = $1
AND project_id = $2
LIMIT 1;
