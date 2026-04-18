import pg from 'pg';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: 20985,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_SSL_CA ,
    },
};

export const client = new pg.Client(config);

export async function startDB() {
  try {
    await client.connect();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export async function initializeSchema() {
  try {
    const initSQL = await readFile(path.join(__dirname, '../../sql/init.sql'), 'utf-8');
    await client.query(initSQL);
    console.log('Database schema initialized');
  } catch (error) {
    console.error('Failed to initialize schema:', error);
    throw error;
  }
}
