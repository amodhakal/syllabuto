import { pgTable, serial, text, uuid, bytea } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const syllabus = pgTable("syllabus", {
  id: uuid("id").notNull().defaultRandom(),
  name: text("name").notNull(),
  file: serial("file").notNull(),
  userId: text("id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
