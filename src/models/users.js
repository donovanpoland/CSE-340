import { query } from "express-validator";
import db from "./db.js";
import bcrypt from 'bcrypt';

//if database columns change update here to update all queries

const USER_ID = "user_id";
const FIRST_NAME = "first_name";
const LAST_NAME = "last_name";
const USER_EMAIL = "user_email";
const PASSWORD_HASH = "password_hash";
const ROLE_ID = "role_id";
const ROLE_NAME = "role_name"
const ORGANIZATION_ID = "organization_id";
const ORGANIZATION_NAME = "org_name";


const createUser = async (fname, lname, email, hashedPassword, orgId) => {
    const defaultRole = 'basic user';
    const roleStatement = `SELECT ${ROLE_ID} FROM roles WHERE ${ROLE_NAME} = $5`;
    const query = `
        INSERT INTO users (${FIRST_NAME}, ${LAST_NAME}, ${USER_EMAIL}, ${PASSWORD_HASH}, ${ROLE_ID}, ${ORGANIZATION_ID})
        VALUES ($1, $2, $3, $4, (${roleStatement}), $6)
        RETURNING ${USER_ID};
    `;
    const queryParams = [fname, lname, email, hashedPassword, defaultRole, orgId || null];
    const result = await db.query(query, queryParams);
    if(result.rows.length === 0) {
        throw new Error('Failed to create user');
    }
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0][USER_ID]);
    }
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT u.${USER_ID}, u.${FIRST_NAME}, u.${LAST_NAME}, u.${USER_EMAIL}, u.${PASSWORD_HASH}, u.${ROLE_ID}, r.${ROLE_NAME}, u.${ORGANIZATION_ID}, o.${ORGANIZATION_NAME}
        FROM users u
        JOIN roles r ON u.${ROLE_ID} = r.${ROLE_ID}
        LEFT JOIN organizations o ON u.${ORGANIZATION_ID} = o.${ORGANIZATION_ID}
        WHERE u.${USER_EMAIL} = $1
    `;
    const queryParams = [email];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
        return null; // User not found
    }
    return result.rows[0];
};

const getAllUsers = async () => {
    const fullNameStatment = `TRIM(CONCAT(u.${FIRST_NAME}, ' ', u.${LAST_NAME})) AS full_name`;
    const query = `
        SELECT ${fullNameStatment}, u.${USER_EMAIL}, u.${ROLE_ID}, r.${ROLE_NAME}, u.${ORGANIZATION_ID}, o.${ORGANIZATION_NAME}
        FROM users u
        JOIN roles r ON u.${ROLE_ID} = r.${ROLE_ID}
        LEFT JOIN organizations o ON u.${ORGANIZATION_ID} = o.${ORGANIZATION_ID}
        ORDER BY full_name ASC;
    `;
    // Runs the query
    const result = await db.query(query);
    return result.rows;
};

const verifyPassword = async (password, hashedpassword) => {
    return bcrypt.compare(password, hashedpassword);
};


const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        return null;
    }// User not found
    const passwordIsValid = await verifyPassword(password, user[PASSWORD_HASH]);
    if (!passwordIsValid) {
        return null;
    }
    // return explicate user data, do not include password hash
    return {
        user_id: user[USER_ID],
        first_name: user[FIRST_NAME],
        last_name: user[LAST_NAME],
        user_email: user[USER_EMAIL],
        role_name: user[ROLE_NAME],
        org_name: user[ORGANIZATION_NAME]
      };
};

const getUserInfo = async (userId) => {
    const query = `
        SELECT u.${USER_ID}, u.${FIRST_NAME}, u.${LAST_NAME}, u.${USER_EMAIL}, u.${ORGANIZATION_ID}, o.${ORGANIZATION_NAME}
        FROM users u
        LEFT JOIN organizations o ON u.${ORGANIZATION_ID} = o.${ORGANIZATION_ID}
        WHERE u.${USER_ID} = $1
    `;
    const queryParams = [userId];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
        return null; // User not found
    }
    return result.rows[0];
};

const updateUserById = async(firstName, lastName, userEmail, organizationsId, userId) => {
    const query = `
        UPDATE users
        SET ${FIRST_NAME} = $1,
            ${LAST_NAME} = $2,
            ${USER_EMAIL} = $3,
            ${ORGANIZATION_ID} = $4
        WHERE ${USER_ID} = $5
        RETURNING ${USER_ID};
    `;

    const queryParams = [firstName, lastName, userEmail, organizationsId || null, userId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('user not found');
    }
    
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated user with ID:', userId);
    }
    
    return result.rows[0][USER_ID];
    
};

// used to refresh session info
const getUserSessionInfoById = async (userId) => {
      const query = `
          SELECT
              u.${USER_ID},
              u.${FIRST_NAME},
              u.${LAST_NAME},
              u.${USER_EMAIL},
              r.${ROLE_NAME},
              o.${ORGANIZATION_NAME}
          FROM users u
          JOIN roles r ON u.${ROLE_ID} = r.${ROLE_ID}
          LEFT JOIN organizations o ON u.${ORGANIZATION_ID} = o.${ORGANIZATION_ID}
          WHERE u.${USER_ID} = $1;
      `;

      const queryParams = [userId];
      const result = await db.query(query, queryParams);

      if (result.rows.length === 0) {
          return null;
      }

      return {
          user_id: result.rows[0][USER_ID],
          first_name: result.rows[0][FIRST_NAME],
          last_name: result.rows[0][LAST_NAME],
          user_email: result.rows[0][USER_EMAIL],
          role_name: result.rows[0][ROLE_NAME],
          organization_name: result.rows[0][ORGANIZATION_NAME]
      };
  };

export {createUser, authenticateUser, getAllUsers, getUserInfo, updateUserById, getUserSessionInfoById};