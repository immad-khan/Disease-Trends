import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
  "sent",
  "acknowledged",
  "fulfilled",
  "collected",
  "cancelled",
]);

export const availabilityEnum = pgEnum("item_availability", [
  "pending",
  "in_stock",
  "partial",
  "out_of_stock",
  "substituted",
]);

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  age: integer("age"),
  gender: text("gender"),
  phone: text("phone"),
  allergies: text("allergies"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  branch: text("branch"),
  city: text("city"),
  authorizedPerson: text("authorized_person"),
  license: text("license"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patients.id),
  vendorId: integer("vendor_id")
    .notNull()
    .references(() => vendors.id),
  doctorName: text("doctor_name").notNull(),
  doctorId: text("doctor_id").notNull(),
  diagnosis: text("diagnosis"),
  clinicalNotes: text("clinical_notes"),
  status: orderStatusEnum("status").notNull().default("sent"),
  vendorToken: text("vendor_token").notNull().unique(),
  pickupCode: text("pickup_code").notNull(),
  paymentMethod: text("payment_method").notNull().default("cash"),
  paymentStatus: text("payment_status").notNull().default("unpaid"),
  invoiceNumber: text("invoice_number"),
  deliveryFee: numeric("delivery_fee").notNull().default("0"),
  vendorNotes: text("vendor_notes"),
  acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
  fulfilledAt: timestamp("fulfilled_at", { withTimezone: true }),
  collectedAt: timestamp("collected_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  position: integer("position").notNull().default(0),
  medicineName: text("medicine_name").notNull(),
  strength: text("strength"),
  dose: text("dose"),
  frequency: text("frequency"),
  duration: text("duration"),
  quantity: integer("quantity").notNull().default(1),
  instructions: text("instructions"),
  alternatives: text("alternatives"),
  availability: availabilityEnum("availability").notNull().default("pending"),
  qtySupplied: integer("qty_supplied").notNull().default(0),
  substitutedName: text("substituted_name"),
  unitPrice: numeric("unit_price"),
  discountPct: numeric("discount_pct").notNull().default("0"),
  batchNumber: text("batch_number"),
  expiryDate: text("expiry_date"),
  dispensed: boolean("dispensed").notNull().default(false),
  dispensedAt: timestamp("dispensed_at", { withTimezone: true }),
  vendorNote: text("vendor_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
