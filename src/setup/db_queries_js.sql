-- project.js query
SELECT
    proj.title,
    proj.description,
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
    description, 
    contact_email, 
    logo_filename
    FROM public.organization;

SELECT
    category_id,
    cat_name;