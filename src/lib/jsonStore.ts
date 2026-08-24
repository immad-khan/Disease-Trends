import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data.json");

interface DataStore {
  vendors: any[];
  orders: any[];
}

const DEFAULT_DATA: DataStore = {
  vendors: [
    { id: "ven-1", name: "Al-Shifa Pharmacy", branch: "Main Branch", email: "contact@alshifa.com", phone: "042-31112222", authorizedPerson: "Dr. Usman", licenseNo: "LIC-8812", address: "123 Health Ave", city: "Lahore", latitude: 31.5204, longitude: 74.3587, mapsUrl: "", status: "active" },
    { id: "ven-2", name: "City Meds", branch: "DHA Phase 5", email: "dha@citymeds.pk", phone: "042-35556666", authorizedPerson: "Ali Raza", licenseNo: "LIC-9923", address: "45-A DHA Phase 5", city: "Lahore", latitude: 31.4646, longitude: 74.4098, mapsUrl: "", status: "active" },
  ],
  orders: []
};

function readData(): DataStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const text = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(text);
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

export function getOrders() {
  return readData().orders;
}

export function addOrder(order: any) {
  const data = readData();
  data.orders.unshift(order);
  writeData(data);
}
