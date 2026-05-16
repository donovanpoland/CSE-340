-- project.js query
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

-- organizations.js query
SELECT 
    organization_id, 
    org_name, 
    org_description, 
    contact_email, 
    logo_filename
FROM public.organization
ORDER BY org_name ASC;

-- categories.js query
SELECT
    category_id,
    cat_name,
    cat_description
FROM public.categories
ORDER BY cat_name ASC;
