import { boolean, index, text } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { id, pgTable, timestamps } from "./common";

/**
 * Example posts table demonstrating schema patterns.
 * Uses pgTable wrapper from common.ts which prepends TABLE_PREFIX.
 */
export const post = pgTable(
  "post",
  {
    id: id(),
    title: text("title").notNull(),
    content: text("content"),
    published: boolean("published").notNull().default(false),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps(),
  },
  (table) => [index("post_user_id_idx").on(table.userId)],
);
