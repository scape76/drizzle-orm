import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url:
			process.env['DB_URL']
			|| 'postgresql://postgres:postgres@localhost:5433/drizzle_beta_test',
	},
});
