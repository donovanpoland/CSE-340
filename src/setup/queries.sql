-- These are just basic quaries used throught the project 
-- and should not be run as a single file only individually and as needed.


SELECT * FROM organization;

SELECT * FROM projects;

SELECT * FROM categories;



------ ALTER Tables ------
-- Do not run these as part of setup

--updated name after tabe was created
ALTER TABLE organization
  RENAME COLUMN name TO org_name;

-- update organization_id to drop to or remove the default behaviors of SERIAL
ALTER TABLE organization
	  ALTER COLUMN organization_id DROP DEFAULT;

-- udpate organization_id to ADD GENERATED ALWAYS AS IDENTITY
-- to match the rest of the schema
ALTER TABLE organization
	  ALTER COLUMN organization_id
	  ADD GENERATED ALWAYS AS IDENTITY;

-- confirm identiy update worked
SELECT column_name, is_identity, identity_generation
  FROM information_schema.columns
  WHERE table_name = 'organization'
	AND column_name = 'organization_id';

-- add description column to categories table
ALTER TABLE categories
  ADD COLUMN cat_description TEXT;