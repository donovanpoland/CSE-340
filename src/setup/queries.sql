-- these are just basic quaries used throught the project 
-- and should not be run as a single file only individually and as needed.


SELECT * FROM organization;

SELECT * FROM projects;

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

--updated name after tabe was created
ALTER TABLE organization
  RENAME COLUMN name TO org_name;

-- organizations.js query
SELECT 
	organization_id, 
	org_name, 
	description, 
	contact_email, 
	logo_filename
FROM public.organization;