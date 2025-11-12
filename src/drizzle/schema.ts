import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  imageUrl: text("image_url"),
  imageFilename: text("image_filename"),
  role: text("role").notNull().default("user"),
  // Profile fields
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  bio: text("bio"),
  // Address fields
  country: text("country"),
  cityState: text("city_state"),
  postalCode: text("postal_code"),
  taxId: text("tax_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: jsonb("title").notNull().$type<{ no: string; en: string }>(),
  slug: text("slug").notNull().unique(),
  description: jsonb("description")
    .notNull()
    .$type<{ no: string; en: string }>(),
  price: decimal("price", { precision: 10, scale: 2 }),
  location: text("location").notNull(),
  category: text("category"),
  active: boolean("active").notNull().default(true),
});

export const courseSessions = pgTable("course_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at").notNull(),
  seats: integer("seats").notNull().default(0),
});

export const registrations = pgTable("registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => courseSessions.id, { onDelete: "cascade" }),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const galleryItems = pgTable("gallery_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: jsonb("title").notNull().$type<{ no: string; en: string }>(),
  imageUrl: text("image_url").notNull(),
  description: jsonb("description").$type<{ no: string; en: string }>(),
  price: decimal("price", { precision: 10, scale: 2 }),
  category: text("category"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
