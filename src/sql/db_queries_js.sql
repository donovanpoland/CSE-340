---- project.js query ----
-- get all poroject data
SELECT
    proj.title,
    proj.proj_description,
    proj.event_location,
    proj.project_datetime,
    org.org_name AS organization_name
FROM public.projects proj
JOIN public.organization org 
ON proj.organization_id = org.organization_id
ORDER BY proj.project_datetime;

-- get upcomeing projects
SELECT
    proj.project_id,
    proj.title,
    proj.proj_description,
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

-- get project details
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
ORDER BY proj.project_datetime;

-- get projects by id
SELECT
    project_id,
    organization_id,
    title,
    proj_description,
    event_location,
    project_datetime
FROM projects
WHERE organization_id = $1
ORDER BY project_datetime;

---- organizations.js query ----
-- get all organization data
SELECT 
    organization_id, 
    org_name, 
    org_description, 
    contact_email, 
    logo_filename
FROM public.organization
ORDER BY org_name ASC;

-- get organization details
SELECT
    organization_id,
    org_name,
    org_description,
    contact_email,
    logo_filename
FROM public.organization
WHERE organization_id = $1;

-- categories.js query
SELECT
    category_id,
    cat_name,
    cat_description
FROM public.categories
ORDER BY cat_name ASC;
