import { integer, jsonb, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const diseases = pgTable("diseases", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  tagline: text("tagline").notNull(),
  category: text("category").notNull(),
  icd: text("icd").notNull(),
  icon: text("icon").notNull(),
  hue: text("hue").notNull(),
  severity: integer("severity").notNull().default(5),
  payload: jsonb("payload").notNull(),
});

export const regionalStats = pgTable(
  "regional_stats",
  {
    diseaseSlug: text("disease_slug").notNull(),
    year: integer("year").notNull(),
    region: text("region").notNull(),
    regionName: text("region_name").notNull(),
    cases: integer("cases").notNull().default(0),
    deaths: integer("deaths").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.diseaseSlug, t.year, t.region] })]
);

/** Replace with the host website's patient table / API adapter when embedded. */
export const patients = pgTable("patients", {
  id: text("id").primaryKey(),
  medicalRecordNo: text("medical_record_no").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  dateOfBirth: text("date_of_birth"),
  city: text("city"),
  address: text("address"),
  allergies: jsonb("allergies").notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const medicineVendors = pgTable("medicine_vendors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  branch: text("branch").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  authorizedPerson: text("authorized_person").notNull(),
  licenseNo: text("license_no"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  mapsUrl: text("maps_url"),
  status: text("status").notNull().default("active"),
});

export const medicineOrders = pgTable("medicine_orders", {
  id: text("id").primaryKey(),
  orderNo: text("order_no").notNull().unique(),
  patientId: text("patient_id").notNull(),
  vendorId: text("vendor_id").notNull(),
  doctorName: text("doctor_name").notNull(),
  doctorId: text("doctor_id").notNull(),
  diagnosis: text("diagnosis"),
  clinicalNotes: text("clinical_notes"),
  status: text("status").notNull().default("sent"),
  vendorAccessToken: text("vendor_access_token").notNull().unique(),
  patientEmailStatus: text("patient_email_status").notNull().default("pending"),
  vendorEmailStatus: text("vendor_email_status").notNull().default("pending"),
  billReference: text("bill_reference"),
  billAmountPaisa: integer("bill_amount_paisa"),
  billDocumentUrl: text("bill_document_url"),
  vendorNote: text("vendor_note"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
});

export const medicineOrderItems = pgTable("medicine_order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull(),
  medicineName: text("medicine_name").notNull(),
  matchedSlug: text("matched_slug"),
  strength: text("strength").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  duration: text("duration").notNull(),
  instructions: text("instructions"),
  quantity: integer("quantity").notNull().default(1),
  alternatives: jsonb("alternatives").notNull().default([]),
  availability: text("availability").notNull().default("pending"),
  suppliedMedicine: text("supplied_medicine"),
  suppliedQuantity: integer("supplied_quantity"),
  unitPricePaisa: integer("unit_price_paisa"),
  vendorItemNote: text("vendor_item_note"),
});

export type DiseaseRow = typeof diseases.$inferSelect;
export type RegionStatRow = typeof regionalStats.$inferSelect;
export type PatientRow = typeof patients.$inferSelect;
export type MedicineVendorRow = typeof medicineVendors.$inferSelect;
export type MedicineOrderRow = typeof medicineOrders.$inferSelect;
export type MedicineOrderItemRow = typeof medicineOrderItems.$inferSelect;
