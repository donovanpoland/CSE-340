# SET UP INSTRUCTIONS

## Create tables
- Create tables for the database via [Create Tables](create_tables.sql) these queries can be run as a whole docment and are in a specific order
    - organizations table
    - projects table
    - categories table
    - project categories junction table

## Insert data
- Mass insert data via multiple insert data files. These are separated for easier maintenance and for easy data point changes. Execute these queries in this order or you will get errors.
    - [Organizations](insert_organization_sample_data.sql)
    - [Projects](insert_project_sample_data.sql)
    - [Categories](insert_categories_sample_data.sql)
    - [Project Categories](insert_project_categories_sample_data.sql)

- Insert single data objects via templates
    - [Single Organizations Templates](insert_single_organization_templates.sql)
    - [Single Project Templates](insert_single_project_templates.sql)
    - [Single Categories Templates](insert_single_category_templates.sql)
    - [Single Project to Categories Templates](insert_single_project_categories_templates.sql)

# NOTES
- [Data base queries](db_queries_js.sql) contains the queries used inside the model files for bringing information from the database to the webpage via JavaScript.
- [Queries](queries.sql) are just queries used throughout the project for easy access and are not needed for set up.
