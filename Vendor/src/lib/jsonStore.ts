import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "..", "data.json");

interface DataStore {
  vendors: any[];
  orders: any[];
}

const EMPTY_DATA: DataStore = { vendors: [], orders: [] };

function readData(): DataStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const text = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(text);
    }
  } catch (e) {
    console.error("Error reading data.json", e);
  }
  return EMPTY_DATA;
}

function writeData(data: DataStore) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing data.json", e);
  }
}

export function getOrders() {
  return readData().orders;
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

export function getVendors() {
  return readData().vendors;
}

export function getPatients() {
  const data = readData();
  const patientIds = new Set<string>();
  const patients: any[] = [];
  for (const order of data.orders) {
    if (order.patient && !patientIds.has(order.patient.id)) {
      patientIds.add(order.patient.id);
      patients.push(order.patient);
    }
  }
  return patients;
}
