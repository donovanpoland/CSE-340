import { query } from "express-validator";
import db from "./db.js";

//if database columns change update here to update all queries

const userId = "user_id";
const firstName = "first_name";
const lastName = "last_name";
const userEmail = "user_email";
const passwordHash = "password_hash";
const roleId = "role_id";
const roleName = "role_name"
const organizationId = "organization_id";


const createUser = async (fname, lname, email, hashedPassword, orgId) => {
    const defaultRole = 'user';
    const roleStatement = `SELECT ${roleId} FROM roles WHERE ${roleName} = $5`;
    const query = `
        INSERT INTO users (${firstName}, ${lastName}, ${userEmail}, ${passwordHash}, ${roleId}, ${organizationId})
        VALUES ($1, $2, $3, $4, (${roleStatement}), $6)
        RETURNING ${userId};
    `;

    const queryParams = [fname, lname, email, hashedPassword, defaultRole, orgId || null];
    const result = await db.query(query, queryParams);

    if(result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0][userId]);
    }
};

export {createUser};