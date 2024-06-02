import pool from "../database/postgresql";
import IUser from "../interfaces/user";
import CustomError from "../utils/customError";

const getAllUsers = async(): Promise<IUser[]> => {
    const query = "SELECT * FROM users";
    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(query);
        return rows;
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

const getUserByUsername = async (username: string): Promise<IUser> => {
    const query = "SELECT * FROM users WHERE username = $1";
    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(query, [username]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

const createUser = async (
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    password: string
): Promise<Partial<IUser>> => {
    const query = `INSERT INTO users (username, email, first_name, last_name, password) 
    VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, first_name, last_name`;
    let client;
    try {
        client = await pool.connect();
        const { rows } = await client.query(query, [
            username,
            email,
            first_name,
            last_name,
            password
        ]);
        return rows[0];
    } catch (e: any) {
        throw new CustomError(e.message, 500);
    } finally {
        if (client) {
            client.release();
        }
    }
};

const loginQuery = async (email: string): Promise<IUser[]> => {
    const client = await pool.connect();
    try {
        const query = "SELECT id, password FROM users WHERE email = $1";
        const result = await client.query(query, [email]);
        return result.rows;
    } catch (error: any) {
        throw error;
    } finally {
        client.release();
    }
};

export default {
    getAllUsers,
    getUserByUsername,
    createUser,
    loginQuery,
};
