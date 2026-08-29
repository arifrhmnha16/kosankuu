import "server-only";
import { Resend } from "resend";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";

type EmailAttachment = { filename: string; content: Buffer | string; contentType?: string };
type EmailInput = { to: string; subject: string; title: string; message: string; template: string; relatedId: string; actionUrl?: string; actionLabel?: string; attachments?: EmailAttachment[] };

export async function sendTransactionalEmail(input: EmailInput) {
  const key = `${input.template}_${input.relatedId}_${input.to.toLowerCase()}`;
  const reference = adminDb().doc(`emailEvents/${key.replace(/[^a-zA-Z0-9_-]/g, "_")}`);
  const apiKey = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Resend belum dikonfigurasi.");
  const claimed = await adminDb().runTransaction(async (transaction) => {
    const previous = await transaction.get(reference), data = previous.data();
    if (data?.status === "sent") return false;
    if (data?.status === "processing" && data.leaseUntil?.toMillis?.() > Date.now()) return false;
    transaction.set(reference, { idempotencyKey: key, template: input.template, recipientMasked: mask(input.to), subject: input.subject, status: "processing", relatedId: input.relatedId, attachmentNames: input.attachments?.map((item) => item.filename) || [], createdAt: data?.createdAt || FieldValue.serverTimestamp(), leaseUntil: Timestamp.fromMillis(Date.now() + 5 * 60_000), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return true;
  });
  if (!claimed) return { skipped: true };
  try {
    const result = await new Resend(apiKey).emails.send({ from: `${process.env.RESEND_FROM_NAME || "Manzsa Residence"} <${from}>`, to: input.to, subject: input.subject, html: emailHtml(input), attachments: input.attachments });
    await reference.set({ resendEmailId: result.data?.id || null, status: "sent", leaseUntil: null, sentAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return result;
  } catch (error) {
    await reference.set({ status: "failed", leaseUntil: null, errorMessage: (error instanceof Error ? error.message : "unknown").slice(0, 500), failedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    throw error;
  }
}

function emailHtml(input: EmailInput) {
  const action = input.actionUrl ? `<a href="${escapeHtml(input.actionUrl)}" style="display:inline-block;background:#c6f564;color:#111827;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:999px;margin:10px 0 22px">${escapeHtml(input.actionLabel || "Lanjutkan")}</a>` : "";
  return `<!doctype html><html><body style="margin:0;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827"><div style="padding:32px 16px"><main style="max-width:560px;margin:auto;overflow:hidden;border-radius:24px;background:#fff;box-shadow:0 18px 50px #11182718"><header style="padding:28px 32px;background:#1da1f2;color:#fff"><strong style="font-size:20px">⌂ Manzsa Residence</strong></header><section style="padding:34px 32px"><p style="margin:0 0 10px;color:#1da1f2;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">${escapeHtml(input.template.replace(/_/g, " "))}</p><h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:38px;line-height:1.08">${escapeHtml(input.title)}</h1><p style="color:#6b7280;line-height:1.7;margin-bottom:22px">${escapeHtml(input.message)}</p>${action}<p style="font-size:12px;color:#9ca3af;line-height:1.6">Jika Anda tidak merasa membuat permintaan ini, abaikan email ini. Jangan membagikan tautan kepada siapa pun.</p></section></main></div></body></html>`;
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
const mask = (email: string) => { const [name, domain] = email.split("@"); return `${name.slice(0, 2)}***@${domain}`; };
