# SET UP INSTRUCTIONS

## Create tables
- Create tables for the database via [Create Tables](create_tables.sql)

## Insert data
- Mass insert data via multiple insert data files. These are separated for easier maintenance. Execute these queries in this order or you will get errors.
    - [Organizations](insert_organization_sample_data.sql)
    - [Projects](insert_project_sample_data.sql)
    - [Categories](insert_categories_sample_data.sql)
    - [Project Categories](insert_project_categories_sample_data.sql)

- Insert single data objects via placeholders
    - [Single Project Placeholders](insert_single_project_placeholders.sql)

# NOTES

- db_queries_js.sql contains the queries used inside the model files for bringing information from the database to the webpage via JavaScript.
- queries.sql are just queries used throughout the project for easy access and are not needed for set up.
