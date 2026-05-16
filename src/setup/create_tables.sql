CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    org_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- Create a table named "projects"
-- This table stores project records and connects each one to an organization
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
    description TEXT NOT NULL,

    -- Location where the project or related event happens
    event_location VARCHAR(255) NOT NULL,

    -- Date and Time of the project
    -- TIMESTAMPZ stores date and time with timezone awareness.
    project_datetime TIMESTAMPTZ NOT NULL,

    -- Name this foreign key(fk) constraint for clarity
    -- It requires organization_id here to match an existing
    -- organization_id in the organization table
    -- ON DELETE CASCADE means if an organization is deleted,
    -- all related projects will be deleted automatically
    CONSTRAINT fk_projects_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

-- Create an index on organization_id
-- This speeds up queries that search projects by organization
CREATE INDEX idx_projects_organization_id ON projects (organization_id);