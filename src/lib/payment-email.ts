import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { sendTransactionalEmail } from "@/lib/email";
import { invoicePdf, paymentReceiptPdf } from "@/lib/pdf";
import { env } from "@/lib/env";

const safeFilename = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "-");

export async function sendPaymentSuccessEmail(paymentId: string) {
  const db = adminDb();
  const paymentDocument = await db.doc(`payments/${paymentId}`).get();
  if (!paymentDocument.exists) return { skipped: true, reason: "payment_missing" };
  const payment = paymentDocument.data()!;
  const invoiceDocument = await db.doc(`invoices/${payment.invoiceId}`).get();
  if (!invoiceDocument.exists) return { skipped: true, reason: "invoice_missing" };
  const invoice = invoiceDocument.data()!;
  const snapshot = invoice.snapshot as { tenant?: { email?: string; fullName?: string } } | undefined;
  let recipient = payment.tenantEmail || snapshot?.tenant?.email || "";
  if (!recipient && payment.tenantId) {
    const user = await db.doc(`users/${payment.tenantId}`).get();
    recipient = user.data()?.email || "";
  }
  if (!recipient) return { skipped: true, reason: "email_missing" };

  const [invoiceAttachment, receiptAttachment] = await Promise.all([
    invoicePdf({ ...invoice, status: "paid" }),
    paymentReceiptPdf(payment, invoice),
  ]);
  const invoiceNumber = String(invoice.invoiceNumber || payment.invoiceId);
  return sendTransactionalEmail({
    to: recipient,
    subject: `Pembayaran berhasil — ${invoiceNumber}`,
    title: "Pembayaran berhasil",
    message: `Pembayaran ${invoiceNumber} sudah terverifikasi. Invoice lunas dan struk pembayaran tersedia pada lampiran email ini.`,
    template: "payment_success",
    relatedId: paymentId,
    actionUrl: `${env.NEXT_PUBLIC_APP_URL}/tenant/tagihan/${payment.invoiceId}`,
    actionLabel: "Lihat detail pembayaran",
    attachments: [
      { filename: `invoice-${safeFilename(invoiceNumber)}.pdf`, content: invoiceAttachment, contentType: "application/pdf" },
      { filename: `struk-${safeFilename(invoiceNumber)}.pdf`, content: receiptAttachment, contentType: "application/pdf" },
    ],
  });
}
