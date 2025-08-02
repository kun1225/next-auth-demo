import knex from 'knex';
import dbConfig from '../../knexfile';

const env = process.env.NODE_ENV || 'development';
export const db = knex(dbConfig[env]);
