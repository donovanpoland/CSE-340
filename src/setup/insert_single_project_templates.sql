--- NOTE ---
--- THESE INSERT STATEMENTS ARE PLACE HOLDERS ONLY ---

-- Insert by id a single project
INSERT INTO projects (
  organization_id,
  title,
  proj_description,
  event_location,
  project_datetime
)
VALUES (
  1, -- org id - change this number
  '', -- title
  '', -- desc
  '', -- location
  --yyyy-dd-mm hh:mm:ss-tz - don't forget to update below placeholder
   '0000-00-00 00:00:00-00'::timestamptz
);

-- Insert by name a single project
INSERT INTO projects (
  organization_id,
  title,
  proj_description,
  event_location,
  project_datetime
  )
SELECT
  organization_id,
  '', -- title
  '', -- desc
  '', -- location
 --yyyy-dd-mm hh:mm:ss-tz - don't forget to update below placeholder
  '0000-00-00 00:00:00-00'::timestamptz
FROM organization
WHERE org_name = ''; -- project name (must be exact)