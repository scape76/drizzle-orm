import { gt, sql } from 'drizzle-orm';
import { client, db } from './db';
import * as schema from './schema';

(async () => {
	const categories = await db.select().from(schema.categories).where(
		gt(
			sql`length(${schema.categories.name})`,
			'Kells - Cluck'.length,
		),
	);

	console.log({
		categories,
	});
})().then(() => process.exit(0)).catch(console.error);
