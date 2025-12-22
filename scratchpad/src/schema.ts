import { index, pgEnum, pgTable } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['customer', 'admin', 'moderator']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']);

export const users = pgTable('users', (p) => ({
	id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
	email: p.varchar({ length: 255 }).notNull().unique(),
	fullName: p.text().notNull(),
	role: userRoleEnum().notNull().default('customer'),
	createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
}), (t) => [
	index('users_email_idx').on(t.email),
	index('users_role_idx').on(t.role),
]);

export const categories = pgTable('categories', (p) => ({
	id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
	name: p.text({
		enum: ['Dan', 'Alex'],
	}).notNull().unique(),
	description: p.text(),
	createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
}), (t) => [
	index('categories_name_idx').on(t.name),
]);

export const products = pgTable('products', (p) => ({
	id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
	name: p.text({ enum: ['hello', 'there'] }).notNull(),
	description: p.text(),
	price: p.numeric({ precision: 10, scale: 2 }).notNull(),
	rating: p.integer({ enum: [1, 2, 3, 4, 5] }),
	categoryId: p.integer().notNull().references(() => categories.id, { onDelete: 'cascade' }),
	createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
}), (t) => [
	index('products_category_idx').on(t.categoryId),
	index('products_name_idx').on(t.name),
]);

// const table = getColumnTable(products.stock);

// type Product = typeof products.$inferSelect;

export const orders = pgTable('orders', (p) => ({
	id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: p.integer().notNull().references(() => users.id),
	status: orderStatusEnum().notNull().default('pending'),
	totalAmount: p.numeric({ precision: 12, scale: 2 }).notNull(),
	shippingAddress: p.text().notNull(),
	createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
}), (t) => [
	index('orders_user_idx').on(t.userId),
	index('orders_status_idx').on(t.status),
]);

export const orderItems = pgTable('order_items', (p) => ({
	id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
	orderId: p.integer().notNull().references(() => orders.id, { onDelete: 'cascade' }),
	productId: p.integer().notNull().references(() => products.id),
	quantity: p.integer().notNull(),
	priceAtPurchase: p.numeric({ precision: 10, scale: 2 }).notNull(),
}), (t) => [
	index('order_items_order_idx').on(t.orderId),
	index('order_items_product_idx').on(t.productId),
]);

export const reviews = pgTable('reviews', (p) => ({
	id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
	text: p.text({ enum: ['hello', 'there'] }),
	varchar: p.varchar({ enum: ['1', '2', '3'] }),
	productId: p.integer().notNull().references(() => products.id, { onDelete: 'cascade' }),
	userId: p.integer().notNull().references(() => users.id),
	rating: p.integer().notNull(), // 1-5
	comment: p.text(),
	createdAt: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
}), (t) => [
	index('reviews_product_idx').on(t.productId),
	index('reviews_user_idx').on(t.userId),
]);
