import { transporter, EMAIL_FROM } from "../config/email";
import { ENV } from "../config/env";
import type { IOrder } from "../models/Order";

function formatWhatsAppNumber(raw?: string): string {
  let digits = (raw || "").replace(/\D/g, "");
  if (digits.length === 10 && (digits.startsWith("98") || digits.startsWith("97"))) {
    digits = `977${digits}`;
  }
  return digits;
}

function formatRs(amount?: number | null): string {
  if (typeof amount === "number" && !isNaN(amount)) {
    return amount.toLocaleString("en-IN");
  }
  return "0";
}

function escapeHtml(str?: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendOrderConfirmationEmail(
  order: IOrder,
  toEmail: string,
) {
  try {
    const recipient = toEmail?.trim();
    if (!recipient) {
      console.warn(
        `Skipping order confirmation email for ${order?.orderNumber}: No recipient email provided.`,
      );
      return;
    }

    const orderNumber = order?.orderNumber || "Order";
    const subtotal =
      order?.subtotal ??
      (order?.total ? Math.max(0, order.total - (order.deliveryFee || 0)) : 0);
    const deliveryFee = order?.deliveryFee ?? 100;
    const total = order?.total ?? subtotal + deliveryFee;

    const whatsappNumber = formatWhatsAppNumber(ENV.WHATSAPP_NUMBER);
    const whatsappMessage = encodeURIComponent(
      `Hi, I've paid for order ${orderNumber} (Rs ${formatRs(total)}). Please confirm.`,
    );
    const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`;
    const orderUrl = order?._id
      ? `${ENV.CLIENT_URL}/orders/${order._id}`
      : `${ENV.CLIENT_URL}/account`;

    const items = Array.isArray(order?.items) ? order.items : [];

    const itemsHtml =
      items.length > 0
        ? items
            .map(
              (item) => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; font-size: 14px; color: #334155;">
                <div style="font-weight: 600; color: #0f172a;">${escapeHtml(item?.name || "Item")}</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Qty: ${item?.quantity || 1} × Rs ${formatRs(item?.price)}</div>
              </td>
              <td align="right" style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #0f172a; vertical-align: top;">
                Rs ${formatRs((item?.price || 0) * (item?.quantity || 1))}
              </td>
            </tr>`,
            )
            .join("")
        : `<tr><td colspan="2" style="padding: 12px 0; font-size: 14px; color: #64748b;">No items listed</td></tr>`;

    const itemsText =
      items.length > 0
        ? items
            .map(
              (item) =>
                `- ${item?.name || "Item"} × ${item?.quantity || 1}: Rs ${formatRs((item?.price || 0) * (item?.quantity || 1))}`,
            )
            .join("\n")
        : "- No items listed";

    const address = order?.address;
    const addressText = address
      ? `${address.label || "Address"} — ${address.area || ""}, ${address.city || ""}\n${address.landmark ? `Landmark: ${address.landmark}\n` : ""}Phone: ${address.phone || ""}`
      : "Standard Delivery";

    const addressHtml = address
      ? `<strong>${escapeHtml(address.label || "Address")}</strong> — ${escapeHtml(address.area || "")}, ${escapeHtml(address.city || "")}<br />
         ${address.landmark ? `<span style="color: #64748b;">Landmark: ${escapeHtml(address.landmark)}</span><br />` : ""}
         Phone: <strong>${escapeHtml(address.phone || "")}</strong>`
      : `<span style="color: #64748b;">Standard Delivery</span>`;

    const instructionsHtml = order?.deliveryInstructions
      ? `<div style="margin-top: 6px; font-style: italic; color: #64748b; font-size: 12px;">"${escapeHtml(order.deliveryInstructions)}"</div>`
      : "";

    const plainTextBody = `
Thank you for your order!

Order Number: #${orderNumber}
Total Amount: Rs ${formatRs(total)}

NEXT STEP: Confirm Payment via WhatsApp
Send your payment screenshot with order #${orderNumber} to WhatsApp: ${whatsappLink}

ORDER ITEMS:
${itemsText}

Subtotal: Rs ${formatRs(subtotal)}
Delivery Fee: Rs ${formatRs(deliveryFee)}
Total: Rs ${formatRs(total)}

DELIVERY ADDRESS:
${addressText}

Track Order: ${orderUrl}

© ${new Date().getFullYear()} PawMandu. All rights reserved.
    `.trim();

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation - ${orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 30px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 32px 24px; text-align: center;">
              <div style="font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 4px;">
                PawMandu
              </div>
              <div style="font-size: 13px; color: #ccfbf1; font-weight: 500;">
                Kathmandu's Favorite Pet Store
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 24px;">
              
              <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 700; color: #0f172a;">
                Thank you for your order!
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b; line-height: 1.5;">
                Your order <strong style="color: #0f172a;">#${orderNumber}</strong> has been received and is waiting for payment confirmation.
              </p>

              <!-- WhatsApp Action Banner -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <div style="font-size: 15px; font-weight: 700; color: #166534; margin-bottom: 6px;">
                      Next Step: Confirm via WhatsApp
                    </div>
                    <p style="margin: 0 0 16px 0; font-size: 13px; color: #15803d; line-height: 1.4;">
                      Please send your payment screenshot with order number <strong>#${orderNumber}</strong> to start delivery preparation.
                    </p>
                    <a href="${whatsappLink}" target="_blank" style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(37, 211, 102, 0.25);">
                      Confirm Order on WhatsApp &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Order Items Section -->
              <div style="font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
                Order Details
              </div>
              
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                  <tr style="border-bottom: 2px solid #f1f5f9;">
                    <th align="left" style="padding: 8px 0; font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Item</th>
                    <th align="right" style="padding: 8px 0; font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td style="padding: 12px 0 4px 0; font-size: 13px; color: #64748b;">Subtotal</td>
                    <td align="right" style="padding: 12px 0 4px 0; font-size: 13px; color: #0f172a; font-weight: 500;">Rs ${formatRs(subtotal)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-size: 13px; color: #64748b;">Delivery Fee</td>
                    <td align="right" style="padding: 4px 0; font-size: 13px; color: #0f172a; font-weight: 500;">Rs ${formatRs(deliveryFee)}</td>
                  </tr>
                  <tr style="border-top: 2px solid #e2e8f0;">
                    <td style="padding: 14px 0 4px 0; font-size: 15px; font-weight: 700; color: #0f172a;">Total Amount</td>
                    <td align="right" style="padding: 14px 0 4px 0; font-size: 18px; font-weight: 800; color: #0f766e;">Rs ${formatRs(total)}</td>
                  </tr>
                </tfoot>
              </table>

              <!-- Delivery Address -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #f1f5f9; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px;">
                    <div style="font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                      Delivery Address
                    </div>
                    <div style="font-size: 13px; color: #334155; line-height: 1.5;">
                      ${addressHtml}
                      ${instructionsHtml}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Account View CTA -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-top: 8px;">
                    <a href="${orderUrl}" target="_blank" style="display: inline-block; background-color: #0f766e; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 8px;">
                      View Order Online
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b;">
                Need help? Reply to this email or contact us directly on WhatsApp.
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} PawMandu. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await transporter.sendMail({
      from: EMAIL_FROM,
      to: recipient,
      subject: `Order confirmed — ${orderNumber}`,
      text: plainTextBody,
      html: emailHtml,
    });
  } catch (error) {
    console.error(
      `Failed to send order confirmation email for ${order?.orderNumber}:`,
      error,
    );
  }
}
