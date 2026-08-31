export const normalizePhone = (phone: string) => {
  const digits = String(phone ?? "").replace(/\D/g, "");
  return digits.startsWith("91") && digits.length > 10 ? digits : `91${digits}`;
};

/** wa.me deep link — works from any phone, no API approval needed */
export const waLink = (phone: string, text: string) =>
  `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;

/** Meta WhatsApp Cloud API — only used if token is configured */
export async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId) return false;
  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: normalizePhone(to),
        type: "text",
        text: { preview_url: false, body },
      }),
    });
    return res.ok;
  } catch (e) {
    console.error("[whatsapp]", e);
    return false;
  }
}

export function buildConfirmMessage(opts: { name: string; orderId: string; total: number; confirmUrl: string }) {
  return (
    `Hi ${opts.name}! 🌿 Thanks for your Upvan Nursery order ` +
    `#${opts.orderId.slice(-6).toUpperCase()} (₹${opts.total}).\n\n` +
    `Please confirm so we can pack & ship your plants:\n${opts.confirmUrl}\n\n— Team Upvan`
  );
}