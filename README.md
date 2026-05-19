# CSE-340

Project folder for CSE 340 coursework.

## Database Setup

Use [src/setup.sql](src/setup.sql) to build and seed the database.

- `src/setup.sql` is intended to be run as one complete script in the PostgreSQL query tool of your choice.
- The file already includes the schema creation and the sample seed data in the correct order.
- No other setup SQL files are required for the initial database setup.

## SQL Reference Files

- [db_queries_js.sql](src/sql/db_queries_js.sql) contains the queries used by the JavaScript model files.
- [queries.sql](src/sql/queries.sql) contains extra reference queries for development and testing. It is not part of the setup process and should be run only as needed.

## Insert Templates

The files in [src/sql/templates](src/sql/templates) are placeholder templates for inserting single records after the initial setup.

- [insert_single_organization_templates.sql](src/sql/templates/insert_single_organization_templates.sql)
- [insert_single_project_templates.sql](src/sql/templates/insert_single_project_templates.sql)
- [insert_single_category_templates.sql](src/sql/templates/insert_single_category_templates.sql)
- [insert_single_project_categories_templates.sql](src/sql/templates/insert_single_project_categories_templates.sql)

## License

[LICENSE](LICENSE)
