# SET UP INSTRUCTIONS

## Crate tables
- Create tables for database via create_tables.sql

## Insert data
- Mass insert data via multiple insert data files
    - [Organizations](insert_organization_sample_data.sql)
    - insert_project_sample_data.sql
    - insert_categories_sameple_data.sql
    - insert_project_categories_sample_data.sql

- Instert single data objects via placeholders
    - insert_single_project_placeholders.sql

# NOTES

- db_queries_js.sql are queries used inside of the model files for bringing the information from the database to the webpage via JS
- queries.sql are just queries used throughout the project for easy access and are not needed for set up.