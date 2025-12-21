import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { seed } from '../../drizzle-seed/dist/index.mjs';
import * as schema from './schema.js';

export async function seedDatabaseCustom(connectionString: string) {
	console.log('\n🌱 Seeding database with custom data...');

	const client = new Client({ connectionString });
	await client.connect();

	const db = drizzle({ client, schema });

	try {
		// Seed with custom counts and refinements
		await seed(db, schema, { count: 50 }).refine((funcs) => ({
			users: {
				count: 20,
				columns: {
					email: funcs.email(),
					fullName: funcs.fullName(),
				},
			},
			categories: {
				count: 10,
				columns: {
					name: funcs.companyName(), // Use company names for category names
				},
			},
			products: {
				count: 100,
				columns: {
					name: funcs.companyName(), // Use company names for product names
					price: funcs.number({ minValue: 9.99, maxValue: 999.99, precision: 2 }),
					stock: funcs.int({ minValue: 0, maxValue: 1000 }),
				},
			},
			orders: {
				count: 50,
			},
			orderItems: {
				count: 150, // Multiple items per order on average
			},
			reviews: {
				count: 200,
				columns: {
					rating: funcs.int({ minValue: 1, maxValue: 5 }),
					comment: funcs.loremIpsum(),
				},
			},
		}));

		console.log('✅ Database seeded with custom data:');
		console.log('   - 20 users');
		console.log('   - 10 categories');
		console.log('   - 100 products');
		console.log('   - 50 orders');
		console.log('   - 150 order items');
		console.log('   - 200 reviews');
	} catch (error) {
		console.error('❌ Failed to seed database:', error);
		throw error;
	} finally {
		await client.end();
	}
}

const connectionString = process.env['DB_URL']!;

await seedDatabaseCustom(connectionString);

console.log('\n✨ All done!\n');
process.exit(0);
