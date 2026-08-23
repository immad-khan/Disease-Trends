import nodemailer from "nodemailer";
import type {
  MedicineOrderItemRow,
  MedicineOrderRow,
  MedicineVendorRow,
  PatientRow,
} from "@/db/schema";

export interface MailResult {
  ok: boolean;
  reason?: string;
}

export function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

let cachedTransport: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransport() {
  if (cachedTransport) return cachedTransport;
  cachedTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return cachedTransport;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<MailResult> {
  if (!smtpConfigured()) return { ok: false, reason: "smtp_not_configured" };
  try {
    await getTransport().sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : "send_failed" };
  }
}

function esc(s: string | null | undefined) {
  return (s ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function vendorOrderEmail(params: {
  order: MedicineOrderRow;
  patient: PatientRow;
  vendor: MedicineVendorRow;
  items: MedicineOrderItemRow[];
  responseUrl: string;
}) {
  const rows = params.items
    .map(
      (i, n) => `<tr>
        <td style="padding:10px;border-bottom:1px solid #e5eef2">${n + 1}</td>
        <td style="padding:10px;border-bottom:1px solid #e5eef2"><b>${esc(i.medicineName)}</b><br><span style="color:#64748b">Alternatives: ${esc((i.alternatives as string[]).join(", ") || "None")}</span></td>
        <td style="padding:10px;border-bottom:1px solid #e5eef2">${esc(i.strength)}</td>
        <td style="padding:10px;border-bottom:1px solid #e5eef2">${esc(i.dosage)} · ${esc(i.frequency)} · ${esc(i.duration)}</td>
        <td style="padding:10px;border-bottom:1px solid #e5eef2">${i.quantity}</td>
      </tr>`
    )
    .join("");

  const subject = `Medicine order ${params.order.orderNo} — ${params.patient.fullName}`;
  const text = `New medicine order ${params.order.orderNo}\nPatient: ${params.patient.fullName} (${params.patient.medicalRecordNo})\nDoctor: ${params.order.doctorName} (${params.order.doctorId})\nRespond with availability and bill: ${params.responseUrl}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:760px;margin:auto;color:#0f2a38">
      <div style="background:#147f9e;color:white;padding:20px;border-radius:14px 14px 0 0">
        <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase">OGDCL Medicine Order</div>
        <h2 style="margin:6px 0 0">${esc(params.order.orderNo)}</h2>
      </div>
      <div style="border:1px solid #d6f4f9;padding:20px">
        <table style="width:100%;font-size:13px;margin-bottom:18px">
          <tr><td><b>Patient</b><br>${esc(params.patient.fullName)}</td><td><b>Patient ID</b><br>${esc(params.patient.medicalRecordNo)}</td><td><b>Date of birth</b><br>${esc(params.patient.dateOfBirth)}</td></tr>
          <tr><td style="padding-top:12px"><b>Phone</b><br>${esc(params.patient.phone)}</td><td style="padding-top:12px"><b>Email</b><br>${esc(params.patient.email)}</td><td style="padding-top:12px"><b>City</b><br>${esc(params.patient.city)}</td></tr>
          <tr><td colspan="2" style="padding-top:12px"><b>Address</b><br>${esc(params.patient.address)}</td><td style="padding-top:12px;color:#b91c1c"><b>Allergies</b><br>${esc((params.patient.allergies as string[]).join(", ") || "None recorded")}</td></tr>
          <tr><td style="padding-top:12px"><b>Doctor</b><br>${esc(params.order.doctorName)}</td><td style="padding-top:12px"><b>Doctor ID</b><br>${esc(params.order.doctorId)}</td><td style="padding-top:12px"><b>Diagnosis</b><br>${esc(params.order.diagnosis)}</td></tr>
        </table>
        <table style="width:100%;border-collapse:collapse;font-size:12px"><thead style="background:#eefbfd"><tr><th>#</th><th>Medicine</th><th>Strength</th><th>Dosage</th><th>Qty</th></tr></thead><tbody>${rows}</tbody></table>
        <p style="font-size:12px;color:#64748b"><b>Clinical note:</b> ${esc(params.order.clinicalNotes)}</p>
        <a href="${params.responseUrl}" style="display:inline-block;margin-top:12px;background:#147f9e;color:white;text-decoration:none;padding:12px 20px;border-radius:24px;font-weight:bold">Confirm availability & submit bill</a>
      </div>
      <p style="font-size:10px;color:#94a3b8">Confidential clinical order. Access the response link only if you are the authorized vendor.</p>
    </div>`;
  return { subject, text, html };
}

export function patientVendorEmail(params: {
  order: MedicineOrderRow;
  patient: PatientRow;
  vendor: MedicineVendorRow;
  items: MedicineOrderItemRow[];
}) {
  const medicines = params.items.map((i) => `${i.medicineName} ${i.strength}`).join(", ");
  const subject = `Your medicine order ${params.order.orderNo} was sent to ${params.vendor.name}`;
  const text = `Hi ${params.patient.fullName},\nYour prescription (${medicines}) was sent to ${params.vendor.name}, ${params.vendor.branch}. Authorized person: ${params.vendor.authorizedPerson}. Phone: ${params.vendor.phone}. Address: ${params.vendor.address}. Map: ${params.vendor.mapsUrl ?? "N/A"}`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;background:#f6fbfc;padding:22px;border-radius:16px;color:#0f2a38">
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#147f9e;font-weight:bold">OGDCL Medicine Order</div>
      <h2 style="margin:8px 0">Your order has been sent</h2>
      <p style="font-size:13px;color:#64748b">Hi ${esc(params.patient.fullName)}, your doctor sent <b>${esc(medicines)}</b> to the approved vendor below.</p>
      <div style="background:white;border:1px solid #d6f4f9;border-radius:12px;padding:16px">
        <h3 style="margin:0 0 8px;color:#147f9e">${esc(params.vendor.name)} — ${esc(params.vendor.branch)}</h3>
        <p style="font-size:13px;margin:5px 0"><b>Authorized person:</b> ${esc(params.vendor.authorizedPerson)}</p>
        <p style="font-size:13px;margin:5px 0"><b>Phone:</b> ${esc(params.vendor.phone)}</p>
        <p style="font-size:13px;margin:5px 0"><b>License:</b> ${esc(params.vendor.licenseNo)}</p>
        <p style="font-size:13px;margin:5px 0"><b>Address:</b> ${esc(params.vendor.address)}</p>
        ${params.vendor.mapsUrl ? `<a href="${params.vendor.mapsUrl}" style="display:inline-block;margin-top:10px;color:#147f9e;font-weight:bold">Open vendor location →</a>` : ""}
      </div>
      <p style="font-size:11px;color:#94a3b8">The vendor will confirm available/unavailable medicines and submit the bill to the system.</p>
    </div>`;
  return { subject, text, html };
}
