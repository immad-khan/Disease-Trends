import nodemailer from 'nodemailer';

// Lazy transporter: created on first send so env vars are always resolved.
let _transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (_transporter) return _transporter;
  const pass = (process.env.EMAIL_HOST_PASSWORD ?? "").replace(/\s/g, ""); // strip spaces from app password
  _transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT ?? 465),
    secure: (process.env.EMAIL_PORT ?? "465") === "465", // true for 465 (SSL), false for 587 (STARTTLS)
    // Force IPv4 — Gmail DNS returns IPv6 first which fails on many networks (ENETUNREACH)
    family: 4,
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  } as any);
  return _transporter;
}

export async function sendVendorEmail(vendorEmail: string, order: any, formLink: string) {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME ?? 'MMS OGDCL'}" <${process.env.EMAIL_HOST_USER}>`,
    to: vendorEmail,
    subject: `New Medicine Order: ${order.orderNo}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#0f2a38">
        <div style="background:#147f9e;color:white;padding:20px;border-radius:12px 12px 0 0">
          <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase">OGDCL Medicine Order</div>
          <h2 style="margin:6px 0 0">${order.orderNo}</h2>
        </div>
        <div style="border:1px solid #d6f4f9;padding:20px;border-radius:0 0 12px 12px">
          <p>Dear Vendor,</p>
          <p>You have received a new medicine order (<strong>${order.orderNo}</strong>).</p>
          <p><strong>Patient ID:</strong> ${order.patientId ?? '—'}</p>
          <p><strong>Doctor:</strong> ${order.doctorName}</p>
          <p style="margin-top:20px">Please click the button below to confirm availability and submit the bill:</p>
          <a href="${formLink}" style="display:inline-block;background:#147f9e;color:white;text-decoration:none;padding:12px 24px;border-radius:24px;font-weight:bold;margin-top:8px">Open Vendor Portal</a>
          <p style="margin-top:16px;font-size:12px;color:#64748b">If the button does not work, copy this link: ${formLink}</p>
          <hr style="margin:20px 0;border:none;border-top:1px solid #e5eef2"/>
          <p style="font-size:11px;color:#94a3b8">Confidential clinical order. Access only if you are the authorized vendor.</p>
        </div>
      </div>
    `,
  };

  return getTransporter().sendMail(mailOptions);
}

export async function sendPatientEmail(patientEmail: string, order: any) {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME ?? 'MMS OGDCL'}" <${process.env.EMAIL_HOST_USER}>`,
    to: patientEmail,
    subject: `Your Prescription Details: ${order.orderNo}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;background:#f6fbfc;padding:22px;border-radius:16px;color:#0f2a38">
        <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#147f9e;font-weight:bold">OGDCL Medicine Order</div>
        <h2 style="margin:8px 0">Your prescription has been sent</h2>
        <p style="font-size:13px;color:#64748b">Your prescription (<strong>${order.orderNo}</strong>) has been sent to the approved vendor.</p>
        <h3>Medicines prescribed:</h3>
        <ul>
          ${(order.items ?? []).map((item: any) => `<li>${item.medicineName} — ${item.quantity} units (${item.dosage ?? ''})</li>`).join('')}
        </ul>
        <p><strong>Diagnosis:</strong> ${order.diagnosis || 'N/A'}</p>
        <p style="font-size:11px;color:#94a3b8;margin-top:20px">The vendor will confirm availability and submit the bill to the system.</p>
      </div>
    `,
  };

  return getTransporter().sendMail(mailOptions);
}
