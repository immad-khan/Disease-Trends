import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_HOST_PASSWORD,
  },
});

export async function sendVendorEmail(vendorEmail: string, order: any, formLink: string) {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_HOST_USER}>`,
    to: vendorEmail,
    subject: `New Medicine Order: ${order.orderNo}`,
    html: `
      <h2>New Prescription Order</h2>
      <p>Dear Vendor,</p>
      <p>You have received a new medicine order (Order No: <strong>${order.orderNo}</strong>).</p>
      <p>Please click the link below to fulfill the prescription:</p>
      <a href="${formLink}">${formLink}</a>
      <br/><br/>
      <p>Patient ID: ${order.patientId}</p>
      <p>Doctor: ${order.doctorName}</p>
      <br/>
      <p>Thank you.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendPatientEmail(patientEmail: string, order: any) {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_HOST_USER}>`,
    to: patientEmail,
    subject: `Your Prescription Details: ${order.orderNo}`,
    html: `
      <h2>Prescription Details</h2>
      <p>Dear Patient,</p>
      <p>Your prescription (Order No: <strong>${order.orderNo}</strong>) has been successfully sent to the vendor.</p>
      <h3>Medicines:</h3>
      <ul>
        ${order.items.map((item: any) => `<li>${item.medicineName} - ${item.quantity} units (Dosage: ${item.dosage})</li>`).join('')}
      </ul>
      <p>Diagnosis: ${order.diagnosis || 'N/A'}</p>
      <br/>
      <p>Thank you.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
