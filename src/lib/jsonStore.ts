import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data.json");

interface DataStore {
  vendors: any[];
  orders: any[];
  patients: any[];
}

const DEFAULT_DATA: DataStore = {
  vendors: [
    { id: "ven-1", name: "Al-Shifa Pharmacy", branch: "Main Branch", email: "contact@alshifa.com", phone: "042-31112222", authorizedPerson: "Dr. Usman", licenseNo: "LIC-8812", address: "123 Health Ave", city: "Lahore", latitude: 31.5204, longitude: 74.3587, mapsUrl: "", status: "active" },
    { id: "ven-2", name: "City Meds", branch: "DHA Phase 5", email: "dha@citymeds.pk", phone: "042-35556666", authorizedPerson: "Ali Raza", licenseNo: "LIC-9923", address: "45-A DHA Phase 5", city: "Lahore", latitude: 31.4646, longitude: 74.4098, mapsUrl: "", status: "active" },
  ],
  orders: [],
  patients: [
    { id: "pat-1", medicalRecordNo: "MR-001", fullName: "Ahmad Khan", city: "Lahore", email: "ahmad@example.com", phone: "0300-1234567", allergies: ["Penicillin"] },
    { id: "pat-2", medicalRecordNo: "MR-002", fullName: "Fatima Ali", city: "Karachi", email: "fatima@example.com", phone: "0321-7654321", allergies: [] },
    { id: "pat-3", medicalRecordNo: "MR-003", fullName: "Zainab Bibi", city: "Islamabad", email: "zainab@example.com", phone: "0333-9876543", allergies: ["Sulfa drugs"] },
  ]
};

function readData(): DataStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const text = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(text);
      if (!parsed.patients) parsed.patients = DEFAULT_DATA.patients;
      return parsed;
    }
  } catch (e) {
    console.error("Error reading data.json", e);
  }
  return DEFAULT_DATA;
}

function writeData(data: DataStore) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing data.json", e);
  }
}

export function getVendors() {
  return readData().vendors;
}

export function addVendor(vendor: any) {
  const data = readData();
  data.vendors.push(vendor);
  writeData(data);
}

export function updateVendor(id: string, patch: Record<string, unknown>): any | null {
  const data = readData();
  const idx = data.vendors.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  data.vendors[idx] = { ...data.vendors[idx], ...patch };
  writeData(data);
  return data.vendors[idx];
}

export function deleteVendor(id: string): boolean {
  const data = readData();
  const len = data.vendors.length;
  data.vendors = data.vendors.filter((v) => v.id !== id);
  if (data.vendors.length === len) return false;
  writeData(data);
  return true;
}

export function getOrders() {
  return readData().orders;
}

export function addOrder(order: any) {
  const data = readData();
  data.orders.unshift(order);
  writeData(data);
}
export function getOrder(token: string) {
  return readData().orders.find((o: any) => o.vendorAccessToken === token) ?? null;
}

export function updateOrder(token: string, patch: Record<string, unknown>) {
  const data = readData();
  const idx = data.orders.findIndex((o: any) => o.vendorAccessToken === token);
  if (idx === -1) return null;
  data.orders[idx] = { ...data.orders[idx], ...patch };
  writeData(data);
  return data.orders[idx];
}

export function updateOrderItem(orderId: string, itemId: string, patch: Record<string, unknown>) {
  const data = readData();
  const orderIdx = data.orders.findIndex((o: any) => o.id === orderId);
  if (orderIdx === -1) return false;
  const order = data.orders[orderIdx];
  if (!order.items) return false;
  const itemIdx = order.items.findIndex((i: any) => i.id === itemId);
  if (itemIdx === -1) return false;
  order.items[itemIdx] = { ...order.items[itemIdx], ...patch };
  writeData(data);
  return true;
}

export function getPatients() {
  return readData().patients;
}

export function addPatient(patient: any) {
  const data = readData();
  data.patients.push(patient);
  writeData(data);
}

export function updatePatient(id: string, patch: Record<string, unknown>): any | null {
  const data = readData();
  const idx = data.patients.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  data.patients[idx] = { ...data.patients[idx], ...patch };
  writeData(data);
  return data.patients[idx];
}

export function deletePatient(id: string): boolean {
  const data = readData();
  const len = data.patients.length;
  data.patients = data.patients.filter((p) => p.id !== id);
  if (data.patients.length === len) return false;
  writeData(data);
  return true;
}
