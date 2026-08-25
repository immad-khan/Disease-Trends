import { db } from "@/db";
import { orderItems, orders, patients, vendors } from "@/db/schema";

export const DEMO_VENDOR_TOKEN = "vf_demo_alshifa_01";

let seeding: Promise<void> | null = null;

export function ensureSeed(): Promise<void> {
  if (!seeding) {
    seeding = run().catch((err) => {
      seeding = null; // allow retry on next call (e.g. schema pushed after boot)
      console.warn("[seed] skipped:", (err as Error)?.message);
      return undefined;
    });
  }
  return seeding;
}

async function run() {
  const existing = await db.select({ id: patients.id }).from(patients).limit(1);
  if (existing.length > 0) return;

  const patientRows = await db
    .insert(patients)
    .values([
      {
        code: "PT-1042",
        name: "Muhammad Bilal",
        age: 34,
        gender: "Male",
        phone: "0301-4482910",
        allergies: "Penicillin (mild rash)",
      },
      {
        code: "PT-1077",
        name: "Ayesha Khan",
        age: 27,
        gender: "Female",
        phone: "0322-7710345",
        allergies: "None known",
      },
      {
        code: "PT-1103",
        name: "Rashid Mehmood",
        age: 61,
        gender: "Male",
        phone: "0345-2208871",
        allergies: "Sulfa drugs",
      },
      {
        code: "PT-1128",
        name: "Fatima Noor",
        age: 8,
        gender: "Female",
        phone: "0300-9912204 (guardian)",
        allergies: "None known",
      },
    ])
    .returning();
  const p1 = patientRows[0];

  const vendorRows = await db
    .insert(vendors)
    .values([
      {
        name: "Al-Shifa Pharmacy",
        branch: "Main Branch",
        city: "Lahore",
        authorizedPerson: "Dr. Usman",
        license: "LIC-8812",
        email: "contact@alshifa.com",
        phone: "042-31112222",
        address: "123 Health Ave",
      },
      {
        name: "MediCare Dispensary",
        branch: "Gulberg",
        city: "Lahore",
        authorizedPerson: "Mrs. Hina Tariq",
        license: "LIC-5540",
        email: "orders@medicarepk.com",
        phone: "042-35771188",
        address: "41 MM Alam Road",
      },
      {
        name: "City Health Pharmacy",
        branch: "DHA Phase 5",
        city: "Lahore",
        authorizedPerson: "Mr. Kamran Shah",
        license: "LIC-9931",
        email: "hello@cityhealth.pk",
        phone: "042-36110099",
        address: "12 Khayaban-e-Jinnah",
      },
    ])
    .returning();
  const v1 = vendorRows[0];

  // A live demo order already routed to Al-Shifa so the vendor console can be opened immediately.
  const [demoOrder] = await db
    .insert(orders)
    .values({
      code: "RX-2481",
      patientId: p1.id,
      vendorId: v1.id,
      doctorName: "Dr. Sarah Ahmed",
      doctorId: "OGD-D-1024",
      diagnosis: "Acute bacterial sinusitis",
      clinicalNotes:
        "Patient advised warm saline gargles. Review in 5 days if fever persists. Dispense full course even if symptoms improve.",
      status: "sent",
      vendorToken: DEMO_VENDOR_TOKEN,
      pickupCode: "4821",
    })
    .returning();

  await db.insert(orderItems).values([
    {
      orderId: demoOrder.id,
      position: 0,
      medicineName: "Amoxicillin",
      strength: "500 mg",
      dose: "1 capsule",
      frequency: "Thrice daily",
      duration: "7 days",
      quantity: 21,
      instructions: "After food",
      alternatives: "Amoxiclav 625 mg, Cefixime 400 mg",
    },
    {
      orderId: demoOrder.id,
      position: 1,
      medicineName: "Cetirizine",
      strength: "10 mg",
      dose: "1 tablet",
      frequency: "At night",
      duration: "5 days",
      quantity: 5,
      instructions: "At bedtime",
      alternatives: "Loratadine 10 mg",
    },
    {
      orderId: demoOrder.id,
      position: 2,
      medicineName: "Paracetamol",
      strength: "500 mg",
      dose: "1 tablet",
      frequency: "As needed",
      duration: "3 days",
      quantity: 6,
      instructions: "After food",
      alternatives: "Ibuprofen 400 mg",
    },
  ]);
}
