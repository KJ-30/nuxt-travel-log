import { int, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const locations = sqliteTable("locations", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  latitude: real(),
  longitude: real(),
  slug: text().notNull().unique(),
  userId: text().notNull(),
  createdAt: int({ mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: int({ mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const logs = sqliteTable("logs", {
  id: int().primaryKey({ autoIncrement: true }),
  locationId: int().notNull().references(() => locations.id, { onDelete: "cascade" }),
  title: text().notNull(),
  description: text(),
  startDate: int({ mode: "timestamp" }).notNull(),
  endDate: int({ mode: "timestamp" }).notNull(),
  userId: text().notNull(),
  createdAt: int({ mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: int({ mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const images = sqliteTable("images", {
  id: int().primaryKey({ autoIncrement: true }),
  logId: int().notNull().references(() => logs.id, { onDelete: "cascade" }),
  url: text().notNull(),
  userId: text().notNull(),
  createdAt: int({ mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
