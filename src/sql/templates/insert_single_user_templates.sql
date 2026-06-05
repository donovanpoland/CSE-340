--- NOTE ---
--- THESE INSERT STATEMENTS ARE PLACE HOLDERS ONLY ---

-- Insert a single user
INSERT INTO users (
  first_name,
  last_name,
  user_email,
  password_hash,
  role_id,
  organization_id
)
VALUES (
  '', -- first name
  '', -- last name
  '', -- user email
  '', -- password hash
  1,  -- role id - change this number
  NULL -- organization id, or replace with a valid organization id
);

-- Insert a single user by role name
INSERT INTO users (
  first_name,
  last_name,
  user_email,
  password_hash,
  role_id,
  organization_id
)
VALUES (
  '', -- first name
  '', -- last name
  '', -- user email
  '', -- password hash
  (SELECT role_id FROM roles WHERE role_name = ''), -- role name must be exact
  NULL -- organization id, or replace with a valid organization id
);
