// TEMPORARY DIAGNOSTIC ROUTE — delete after debugging
export const dynamic = "force-dynamic";

export async function GET() {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_HOST_USER;
  const pass = process.env.EMAIL_HOST_PASSWORD;
  const fromName = process.env.EMAIL_FROM_NAME;
  const vendorUrl = process.env.VENDOR_FORM_URL;

  // Try sending a real test email
  let sendResult: string = "not_attempted";
  if (host && user && pass) {
    try {
      const nodemailer = await import("nodemailer");
      const cleanPass = pass.replace(/\s/g, "");
      const transport = nodemailer.default.createTransport({
        host,
        port: Number(port ?? 465),
        secure: (port ?? "465") === "465",
        family: 4,
        tls: { rejectUnauthorized: false },
        auth: { user, pass: cleanPass },
      });
      // Verify connection first
      await transport.verify();
      // Send test email
      await transport.sendMail({
        from: `"${fromName ?? "MMS OGDCL"}" <${user}>`,
        to: user, // send to self as test
        subject: "✅ OGDCL Email Test — Connection OK",
        text: "If you received this, SMTP is working correctly.",
        html: "<p>If you received this, <b>SMTP is working correctly</b>.</p>",
      });
      sendResult = "sent_ok";
    } catch (e: any) {
      sendResult = `error: ${e?.message ?? String(e)}`;
    }
  }

  return Response.json({
    env: {
      EMAIL_HOST: host ?? "MISSING",
      EMAIL_PORT: port ?? "MISSING",
      EMAIL_HOST_USER: user ?? "MISSING",
      EMAIL_HOST_PASSWORD: pass ? `SET (${pass.length} chars, cleaned: ${pass.replace(/\s/g, "").length} chars)` : "MISSING",
      EMAIL_FROM_NAME: fromName ?? "MISSING",
      VENDOR_FORM_URL: vendorUrl ?? "MISSING",
    },
    sendResult,
  });
}
