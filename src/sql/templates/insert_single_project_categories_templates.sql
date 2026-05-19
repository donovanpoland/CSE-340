--- NOTE ---
--- THESE INSERT STATEMENTS ARE PLACE HOLDERS ONLY ---

-- Insert by id a single project-category association
INSERT INTO project_categories (
  project_id,
  category_id
)
VALUES (
  1, -- project id - change this number
  1  -- category id - change this number
);

-- Insert by name a single project-category association
INSERT INTO project_categories (
  project_id,
  category_id
)
SELECT
  proj.project_id,
  cat.category_id
FROM projects proj
JOIN categories cat
  ON cat.cat_name = ''; -- category name (must be exact)
WHERE proj.title = ''; -- project title (must be exact)
