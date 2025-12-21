import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

export const client = new Pool({ connectionString: process.env['DB_URL'] });

export const db = drizzle({
	client,
	schema,
});
