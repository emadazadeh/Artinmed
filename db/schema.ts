import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";
export const appointments = sqliteTable("appointments", {
  id: text("id").primaryKey(), requestId: text("request_id").notNull().unique(), reference: text("reference").notNull().unique(),
  name: text("name").notNull(), phone: text("phone").notNull(), service: text("service").notNull(),
  city: text("city"),
  preferredDate: text("preferred_date").notNull(), preferredTime: text("preferred_time").notNull(),
  status: text("status").notNull().default("pending"), createdAt: integer("created_at").notNull(), consentAt: integer("consent_at").notNull(),
}, table => [index("appointments_phone_created_idx").on(table.phone, table.createdAt)]);
