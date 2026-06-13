# CSE-340

Service project and community organization web app for CSE 340 coursework. The application uses Node.js, Express, EJS, PostgreSQL, and server-side sessions to manage organizations, projects, categories, and user accounts.

## Features

- Browse partner organizations and view a single organization with its related projects.
- Browse service projects and view a single project with its assigned categories.
- Browse service categories and view the projects assigned to each category.
- Register a user account and log in with a session-based authentication flow.
- View a dashboard with account details and current volunteer signups.
- Edit your own account information after logging in.
- Sign up to volunteer for service projects and remove volunteer signups later.
- Track volunteered projects on the user dashboard.
- Let admins review the full user list, including volunteer counts.
- Restrict create and edit actions to users with the `admin` role.
- Assign categories to projects through a protected admin workflow.
- Show development-only SQL logging and error stack traces when enabled.

## Tech Stack

- Node.js
- Express
- EJS
- PostgreSQL
- `pg`
- `express-session`
- `express-validator`
- `bcrypt`
- `nodemon` for development

## Project Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment variables

This project expects a `.env` file in the project root. These variables are currently used by the app:

Start by copying the example file:

```bash
cp .env.example .env
```

```env
PORT=3000
NODE_ENV=development
IP=127.0.0.1
DB_URL=postgresql://username:password@host:port/database
ENABLE_SQL_LOGGING=true
SESSION_SECRET=replace-with-a-long-random-secret
```

Variable notes:

- `PORT`: Port the Express server listens on.
- `NODE_ENV`: Controls development behavior such as request logging and detailed error output.
- `IP`: Address displayed in the startup log output.
- `DB_URL`: PostgreSQL connection string.
- `ENABLE_SQL_LOGGING`: When set to `true` in development, SQL queries are logged.
- `SESSION_SECRET`: Secret used by `express-session`.

### 3. Create and seed the database

Run [src/setup.sql](src/setup.sql) against your PostgreSQL database.

- This file creates the schema.
- This file inserts seed data.
- This file also inserts the application roles used for authorization.

The setup script is intended to be run as a complete script.

### 4. Start the application

Development:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

## Application Behavior

### Authentication and Roles

- New users register through the app and are assigned the default non-admin role from the application logic.
- Logged-in user data is stored in the session.
- Admin-only routes are protected on the server with role-checking middleware.
- The UI also hides admin-only actions unless the logged-in user has the `admin` role.
- Volunteer signup and removal routes are protected with login middleware.

### Volunteering

- Logged-in users can volunteer for projects from the project details page.
- The project details page toggles between volunteer and leave-project actions based on the current user's signup status.
- The dashboard shows all projects the current user has volunteered for and allows them to remove themselves from those projects.

### Main Pages

- `/`
- `/organizations`
- `/organization/:id`
- `/projects`
- `/project/:id`
- `/categories`
- `/category/:id`
- `/register`
- `/login`

### Logged-In Only Pages and Actions

- `/dashboard`
- `/edit-user/:id`
- `POST /project/:id/volunteer`
- `POST /project/:id/unvolunteer`
- `/logout`

### Admin-Only Pages and Actions

- `/users`
- `/new-organization`
- `/edit-organization/:id`
- `/new-project`
- `/edit-project/:id`
- `/assign-categories/:projectId`
- `/new-category`
- `/edit-category/:id`

## SQL Reference Files

- [src/setup.sql](src/setup.sql): Full schema creation and seed data.
- [src/sql/db_queries_js.sql](src/sql/db_queries_js.sql): Reference queries used by the JavaScript model files.
- [src/sql/queries.sql](src/sql/queries.sql): Extra manual queries for development and testing.

## Insert Templates

The files in [src/sql/templates](src/sql/templates) are single-record reference templates for manual inserts after the initial setup:

- [src/sql/templates/insert_single_organization_templates.sql](src/sql/templates/insert_single_organization_templates.sql)
- [src/sql/templates/insert_single_project_templates.sql](src/sql/templates/insert_single_project_templates.sql)
- [src/sql/templates/insert_single_project_volunteer_templates.sql](src/sql/templates/insert_single_project_volunteer_templates.sql)
- [src/sql/templates/insert_single_category_templates.sql](src/sql/templates/insert_single_category_templates.sql)
- [src/sql/templates/insert_single_project_categories_templates.sql](src/sql/templates/insert_single_project_categories_templates.sql)
- [src/sql/templates/insert_single_role_templates.sql](src/sql/templates/insert_single_role_templates.sql)
- [src/sql/templates/insert_single_user_templates.sql](src/sql/templates/insert_single_user_templates.sql)

## Project Structure

```text
server.js
src/
  routes.js
  controllers/
  middleware/
  models/
  sql/
  utils/
  views/
```

## Development Notes

- In development mode, the app logs incoming requests.
- SQL logging can be enabled with `ENABLE_SQL_LOGGING=true`.
- The development error page includes stack traces.
- Session cookies currently expire after one hour of inactivity.

## License

[MIT](LICENSE)
