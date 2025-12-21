import { execSync } from 'child_process';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { client, db } from './db.js';

/**
 * Generate migrations using drizzle-kit CLI and apply them to the database
 */
export async function generateAndRunMigrations(connectionString: string) {
	console.log('\n📝 Generating migrations from schema...');

	try {
		// Step 1: Generate migration using drizzle-kit CLI
		execSync('npx drizzle-kit generate', {
			cwd: process.cwd(),
			stdio: 'inherit',
			env: {
				...process.env,
				DB_URL: connectionString,
			},
		});
		console.log('✅ Migration files generated!');
	} catch (error) {
		console.error('❌ Failed to generate migration:', error);
		throw error;
	}

	console.log('\n🚀 Running migrations...');

	try {
		await migrate(db, {
			migrationsFolder: './drizzle',
		});

		console.log('✅ Migrations applied successfully!');
	} catch (error) {
		console.error('❌ Failed to apply migrations:', error);
		throw error;
	} finally {
		await client.end();
	}
}

const connectionString = process.env['DB_URL']!;

console.log(`\n📊 Database: ${connectionString}\n`);

await generateAndRunMigrations(connectionString);

console.log('\n✨ All done!\n');
process.exit(0);
