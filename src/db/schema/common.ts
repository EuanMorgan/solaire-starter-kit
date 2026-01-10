import { pgTableCreator, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { env } from "@/env";

/**
 * pgTable wrapper that prepends TABLE_PREFIX from env to all table names.
 * Use this instead of importing pgTable from drizzle-orm/pg-core directly.
 */
export const pgTable = pgTableCreator((name) => `${env.TABLE_PREFIX}${name}`);

/**
 * Common id column using nanoid for primary key.
 * Generates a 21-character URL-safe unique ID.
 */
export const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => nanoid());

/**
 * Common timestamp columns for createdAt/updatedAt.
 * createdAt: defaults to now, never updated
 * updatedAt: defaults to now, should be updated on modifications
 */
export const timestamps = () => ({
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
