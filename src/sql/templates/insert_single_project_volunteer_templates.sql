--- NOTE ---
--- THESE INSERT STATEMENTS ARE PLACE HOLDERS ONLY ---

-- Insert a single project volunteer signup by id
INSERT INTO project_volunteers (
  project_id,
  user_id
)
VALUES (
  1, -- project id - change this number
  1  -- user id - change this number
);

-- Insert a single project volunteer signup by user email and project title
INSERT INTO project_volunteers (
  project_id,
  user_id
)
SELECT
  p.project_id,
  u.user_id
FROM projects p
JOIN users u
  ON u.user_email = '' -- user email (must be exact)
WHERE p.title = ''; -- project title (must be exact)
