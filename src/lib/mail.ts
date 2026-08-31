import nodemailer from "nodemailer";

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST, port: Number(SMTP_PORT ?? 587), secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendOrderEmail(opts: { order: any; to: string; confirmUrl: string }) {
  const t = getTransporter();
  if (!t) { console.log("[mail] SMTP not configured — skipping", opts.order._id); return; }
  const o = opts.order;
  const rows = o.items.map((i: any) => `<tr>
    <td style="padding:10px 14px;border-bottom:1px solid #eee">${i.name}
      <span style="color:#888;font-size:12px"> · ${i.sizeLabel}, ${i.potLabel} × ${i.qty}</span></td>
    <td align="right" style="padding:10px 14px;border-bottom:1px solid #eee">₹${i.unitPrice * i.qty}</td></tr>`).join("");

  await t.sendMail({
    from: process.env.MAIL_FROM ?? "Upvan Nursery <orders@upvan.store>",
    to: opts.to,
    subject: `Confirm your order 🌿 #${String(o._id).slice(-6).toUpperCase()}`,
    html: `<div style="font-family:Georgia,serif;max-width:560px;margin:auto;background:#faf8f0;padding:32px;border-radius:16px">
      <h1 style="color:#153624;margin:0">🌿 Upvan Nursery</h1>
      <p>Order <b>#${String(o._id).slice(-6).toUpperCase()}</b> — please confirm so we can start packing:</p>
      <a href="${opts.confirmUrl}" style="display:inline-block;background:#c86f4a;color:#fff;padding:14px 32px;border-radius:999px;font-weight:bold;text-decoration:none">✅ Confirm my order</a>
      <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:12px;margin-top:24px">${rows}
        <tr><td style="padding:10px 14px;font-weight:bold">Total paid</td>
        <td align="right" style="padding:10px 14px;font-weight:bold">₹${o.total}</td></tr></table>
      <p style="font-size:13px;color:#666">Shipping to: ${o.shippingAddress.line1}, ${o.shippingAddress.city} — ${o.shippingAddress.pincode}</p>
    </div>`,
  });
}

export async function notifyAdminEmail(order: any) {
  const t = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!t || !adminEmail) return;
  await t.sendMail({
    from: process.env.MAIL_FROM ?? "Upvan Nursery <orders@upvan.store>",
    to: adminEmail,
    subject: `🔔 New order #${String(order._id).slice(-6).toUpperCase()} — ₹${order.total} (${order.shippingAddress.city})`,
    html: `<p><b>${order.shippingAddress.fullName}</b> ordered ${order.items.length} item(s) for ₹${order.total}.</p>
      <p>${order.items.map((i: any) => `${i.name} ×${i.qty}`).join("<br/>")}</p>
      <p>Confirmation: <b>${order.confirmation}</b></p>`,
  });
}