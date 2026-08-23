import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { medicineVendors, patients } from "./schema";

config();

const demoPatients = [
  { id: "pat-001", medicalRecordNo: "OGD-P-10021", fullName: "Ali Raza Khan", email: "ali.raza@example.com", phone: "+92 300 1234567", dateOfBirth: "1988-04-17", city: "Islamabad", address: "G-10/2, Islamabad", allergies: ["Penicillin"] },
  { id: "pat-002", medicalRecordNo: "OGD-P-10034", fullName: "Sana Ahmed", email: "sana.ahmed@example.com", phone: "+92 321 4455667", dateOfBirth: "1995-09-02", city: "Rawalpindi", address: "Satellite Town, Rawalpindi", allergies: [] },
  { id: "pat-003", medicalRecordNo: "OGD-P-10058", fullName: "Muhammad Usman", email: "usman@example.com", phone: "+92 333 7654321", dateOfBirth: "1974-01-26", city: "Karachi", address: "Gulshan-e-Iqbal, Karachi", allergies: ["Sulfonamides"] },
  { id: "pat-004", medicalRecordNo: "OGD-P-10071", fullName: "Ayesha Malik", email: "ayesha.malik@example.com", phone: "+92 301 9988776", dateOfBirth: "1982-11-13", city: "Lahore", address: "Model Town, Lahore", allergies: [] },
  { id: "pat-005", medicalRecordNo: "OGD-P-10089", fullName: "Hassan Shah", email: "hassan.shah@example.com", phone: "+92 312 2468135", dateOfBirth: "1966-06-21", city: "Quetta", address: "Jinnah Town, Quetta", allergies: ["Aspirin"] },
];

const demoVendors = [
  { id: "ven-shaheen-blue", name: "Shaheen Chemist", branch: "Blue Area", email: "orders.bluearea@shaheenchemist.example", phone: "+92 51 2345678", authorizedPerson: "Mr. Kamran Siddiqui", licenseNo: "ICT-PH-4421", address: "Jinnah Avenue, Blue Area, Islamabad", city: "Islamabad", latitude: "33.7145", longitude: "73.0583", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Shaheen+Chemist+Blue+Area+Islamabad", status: "active" },
  { id: "ven-shaheen-g10", name: "Shaheen Chemist", branch: "G-10 Markaz", email: "orders.g10@shaheenchemist.example", phone: "+92 51 2109876", authorizedPerson: "Ms. Rabia Nisar", licenseNo: "ICT-PH-4590", address: "G-10 Markaz, Islamabad", city: "Islamabad", latitude: "33.6766", longitude: "73.0124", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Shaheen+Chemist+G-10+Islamabad", status: "active" },
  { id: "ven-dwatson-saddar", name: "D. Watson Chemist", branch: "Saddar", email: "orders.saddar@dwatson.example", phone: "+92 51 5566778", authorizedPerson: "Mr. Imran Qureshi", licenseNo: "RWP-PH-2218", address: "Bank Road, Saddar, Rawalpindi", city: "Rawalpindi", latitude: "33.5973", longitude: "73.0491", mapsUrl: "https://www.google.com/maps/search/?api=1&query=D+Watson+Saddar+Rawalpindi", status: "active" },
  { id: "ven-servaid-lahore", name: "Servaid Pharmacy", branch: "Model Town", email: "orders.modeltown@servaid.example", phone: "+92 42 35881234", authorizedPerson: "Ms. Hira Salman", licenseNo: "LHR-PH-8732", address: "Model Town Link Road, Lahore", city: "Lahore", latitude: "31.4794", longitude: "74.3239", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Servaid+Model+Town+Lahore", status: "active" },
  { id: "ven-fazaldin-karachi", name: "Fazal Din's Pharma Plus", branch: "Gulshan", email: "orders.gulshan@fazaldin.example", phone: "+92 21 34981234", authorizedPerson: "Mr. Danish Ali", licenseNo: "KHI-PH-6109", address: "University Road, Gulshan-e-Iqbal, Karachi", city: "Karachi", latitude: "24.9207", longitude: "67.0897", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Fazal+Din+Pharma+Plus+Gulshan+Karachi", status: "active" },
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  await db.insert(patients).values(demoPatients).onConflictDoNothing();
  await db.insert(medicineVendors).values(demoVendors).onConflictDoNothing();
  console.log(`Seeded ${demoPatients.length} patients and ${demoVendors.length} vendors.`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
