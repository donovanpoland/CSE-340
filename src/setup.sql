-- create a table named organization
-- this table stores organizations and info about them
--1:N
CREATE TABLE organization (
    organization_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    org_name VARCHAR(150) NOT NULL,
    org_description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- Create a table named "projects"
-- This table stores project records and connects each one to an organization
-- 1:N
CREATE TABLE projects (
    -- Primary key for the table
    -- GENERATED ALWAYS AS IDENTITY tells PostgreSQL to auto-create
    -- a new numeric ID for each inserted row
    project_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Foreign key column that links each project to one organization
    -- NOT NULL means every project must belong to an organization
    organization_id INTEGER NOT NULL,

    -- Short title of the project
    -- VARCHAR(150) limits the title to 150 characters
    title VARCHAR(150) NOT NULL,

    -- Longer text field for project details
    -- TEXT is used when you do not want a strict length limit
    proj_description TEXT NOT NULL,

    -- Location where the project or related event happens
    event_location VARCHAR(255) NOT NULL,

    -- Date and Time of the project
    -- TIMESTAMPZ stores date and time with timezone awareness.
    project_datetime TIMESTAMPTZ NOT NULL,

    -- Name this foreign key(fk) constraint for clarity
    CONSTRAINT fk_projects_organization
        -- It requires organization_id here to match an existing
        -- organization_id in the organization table
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        -- ON DELETE CASCADE means if an organization is deleted,
        -- all related projects will be deleted automatically
        ON DELETE CASCADE
);

-- Create an index on organization_id
-- This speeds up queries that search projects by organization
CREATE INDEX idx_projects_organization_id ON projects (organization_id);

-- Create a table named categories
-- this table stores the categories related to the types of available projects
CREATE TABLE categories (
    -- Primary key for the table
    -- GENERATED ALWAYS AS IDENTITY tells PostgreSQL to auto-create
    -- a new numeric ID for each inserted row
    category_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cat_name VARCHAR(100) NOT NULL UNIQUE,
    cat_description TEXT NOT NULL
);

-- Create a junction table for projects and categories
-- This implements the many-to-many relationship
CREATE TABLE project_categories(
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project_categories_project
        FOREIGN KEY (project_id) 
        REFERENCES projects(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_project_categories_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

--Mass insert into organization
INSERT INTO organization (
    -- no organization ID needed as it is auto generated
    org_name, 
    org_description,
    contact_email, 
    logo_filename
    )
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


--Mass insert into projects
INSERT INTO projects (
    -- no project ID needed as it is auto generated
    organization_id,
    title,
    proj_description,
    event_location,
    project_datetime
)
SELECT
    org.organization_id,
    proj.title,
    proj.proj_description,
    proj.event_location,
    proj.project_datetime
FROM organization org
JOIN (
    VALUES
    -- BrightFuture Builders
    ('BrightFuture Builders', 'Neighborhood Park Pavilion Build', 'Constructing a shaded pavilion and seating area for a community park.', 'Boise, Idaho', '2026-06-10 09:00:00-06'::timestamptz),
    ('BrightFuture Builders', 'Affordable Housing Repair Weekend', 'Volunteers will repair roofing, siding, and accessibility ramps for local housing units.', 'Meridian, Idaho', '2026-06-22 08:30:00-06'::timestamptz),
    ('BrightFuture Builders', 'Community Playground Renovation', 'Replacing damaged playground structures and installing safer ground covering.', 'Nampa, Idaho', '2026-07-05 10:00:00-06'::timestamptz),
    ('BrightFuture Builders', 'Senior Center Accessibility Upgrade', 'Improving entryways, handrails, and restroom access at the senior center.', 'Caldwell, Idaho', '2026-07-18 09:30:00-06'::timestamptz),
    ('BrightFuture Builders', 'Riverwalk Bench Installation', 'Building and installing durable benches along the public riverwalk trail.', 'Eagle, Idaho', '2026-08-02 07:45:00-06'::timestamptz),

    -- GreenHarvest Growers
    ('GreenHarvest Growers', 'Downtown Rooftop Garden Setup', 'Installing raised beds, irrigation lines, and compost stations on a rooftop garden.', 'Boise, Idaho', '2026-06-12 08:00:00-06'::timestamptz),
    ('GreenHarvest Growers', 'Schoolyard Vegetable Planting Day', 'Teaching students how to plant and maintain seasonal vegetables in a school garden.', 'Meridian, Idaho', '2026-06-25 09:15:00-06'::timestamptz),
    ('GreenHarvest Growers', 'Neighborhood Compost Workshop', 'Hosting a hands-on composting workshop for residents and community gardeners.', 'Nampa, Idaho', '2026-07-08 18:00:00-06'::timestamptz),
    ('GreenHarvest Growers', 'Urban Orchard Expansion Project', 'Planting additional fruit trees and improving irrigation in the community orchard.', 'Caldwell, Idaho', '2026-07-20 07:30:00-06'::timestamptz),
    ('GreenHarvest Growers', 'Harvest and Food Donation Drive', 'Collecting fresh produce for distribution to local food banks and shelters.', 'Eagle, Idaho', '2026-08-06 06:45:00-06'::timestamptz),

    -- UnityServe Volunteers
    ('UnityServe Volunteers', 'Charity Supply Sorting Event', 'Organizing donated clothing, books, and hygiene supplies for partner charities.', 'Boise, Idaho', '2026-06-14 11:00:00-06'::timestamptz),
    ('UnityServe Volunteers', 'Community Clean-Up Campaign', 'Coordinating volunteers to clean streets, parks, and public gathering spaces.', 'Meridian, Idaho', '2026-06-28 08:00:00-06'::timestamptz),
    ('UnityServe Volunteers', 'Local Shelter Meal Service Night', 'Preparing and serving meals for guests at a local emergency shelter.', 'Nampa, Idaho', '2026-07-11 17:30:00-06'::timestamptz),
    ('UnityServe Volunteers', 'Back-to-School Backpack Drive', 'Assembling backpacks with school supplies for students in need.', 'Caldwell, Idaho', '2026-07-24 13:00:00-06'::timestamptz),
    ('UnityServe Volunteers', 'Holiday Volunteer Planning Fair', 'Recruiting and organizing volunteers for upcoming seasonal service projects.', 'Eagle, Idaho', '2026-08-09 15:00:00-06'::timestamptz)
) AS proj(org_name, title, proj_description, event_location, project_datetime)
  ON org.org_name = proj.org_name;



--Mass insert into projects
INSERT INTO categories (
    -- no category ID needed as it is auto generated
    cat_name,
    cat_description
)
VALUES
('Construction and Repair', 'Projects involving building, repairing, renovating, or improving physical spaces and structures.'),
('Accessibility', 'Projects focused on improving access, safety, and usability for people with mobility or other support needs.'),
('Gardening and Agriculture', 'Projects centered on planting, growing, harvesting, or maintaining gardens, orchards, and other community agriculture spaces.'),
('Education', 'Projects that teach skills, provide learning opportunities, or support students and community knowledge-building.'),
('Food Support', 'Projects that provide meals, produce, or other food resources to people and organizations in need.'),
('Community Service', 'General service projects that support local residents, charities, shelters, and public community needs.'),
('Environmental Cleanup', 'Projects aimed at cleaning, restoring, or maintaining outdoor and shared public environments.'),
('Volunteer Coordination', 'Projects focused on recruiting, organizing, and preparing volunteers for service activities and events.');



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