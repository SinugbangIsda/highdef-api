import { config } from 'dotenv';
config();

export const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
export const MONGO_HOST = process.env.MONGO_HOST || '';
export const SERVER_PORT = process.env.SERVER_PORT || '';
export const SECRET_TOKEN = process.env.SECRET_TOKEN || '';
