-- Associate each seeded project with one or more service categories.
-- Uses project titles and category names so the seed data stays stable
-- even if generated IDs change across database rebuilds.
INSERT INTO project_categories (project_id, category_id)
SELECT
  proj.project_id,
  cat.category_id
FROM projects proj
JOIN categories cat
  ON cat.cat_name = CASE proj.title
    WHEN 'Neighborhood Park Pavilion Build' THEN 'Construction and Repair'
    WHEN 'Affordable Housing Repair Weekend' THEN 'Construction and Repair'
    WHEN 'Community Playground Renovation' THEN 'Construction and Repair'
    WHEN 'Senior Center Accessibility Upgrade' THEN 'Accessibility'
    WHEN 'Riverwalk Bench Installation' THEN 'Construction and Repair'
    WHEN 'Downtown Rooftop Garden Setup' THEN 'Gardening and Agriculture'
    WHEN 'Schoolyard Vegetable Planting Day' THEN 'Education'
    WHEN 'Neighborhood Compost Workshop' THEN 'Education'
    WHEN 'Urban Orchard Expansion Project' THEN 'Gardening and Agriculture'
    WHEN 'Harvest and Food Donation Drive' THEN 'Food Support'
    WHEN 'Charity Supply Sorting Event' THEN 'Community Service'
    WHEN 'Community Clean-Up Campaign' THEN 'Environmental Cleanup'
    WHEN 'Local Shelter Meal Service Night' THEN 'Food Support'
    WHEN 'Back-to-School Backpack Drive' THEN 'Education'
    WHEN 'Holiday Volunteer Planning Fair' THEN 'Volunteer Coordination'
  END
UNION ALL
SELECT
  proj.project_id,
  cat.category_id
FROM projects proj
JOIN categories cat
  ON (
    (proj.title = 'Affordable Housing Repair Weekend' AND cat.cat_name = 'Accessibility') OR
    (proj.title = 'Community Playground Renovation' AND cat.cat_name = 'Community Service') OR
    (proj.title = 'Senior Center Accessibility Upgrade' AND cat.cat_name = 'Construction and Repair') OR
    (proj.title = 'Downtown Rooftop Garden Setup' AND cat.cat_name = 'Construction and Repair') OR
    (proj.title = 'Schoolyard Vegetable Planting Day' AND cat.cat_name = 'Gardening and Agriculture') OR
    (proj.title = 'Urban Orchard Expansion Project' AND cat.cat_name = 'Community Service') OR
    (proj.title = 'Harvest and Food Donation Drive' AND cat.cat_name = 'Community Service') OR
    (proj.title = 'Charity Supply Sorting Event' AND cat.cat_name = 'Volunteer Coordination') OR
    (proj.title = 'Community Clean-Up Campaign' AND cat.cat_name = 'Community Service') OR
    (proj.title = 'Local Shelter Meal Service Night' AND cat.cat_name = 'Community Service') OR
    (proj.title = 'Back-to-School Backpack Drive' AND cat.cat_name = 'Community Service') OR
    (proj.title = 'Holiday Volunteer Planning Fair' AND cat.cat_name = 'Community Service')
  );
