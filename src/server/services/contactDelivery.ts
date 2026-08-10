import "server-only";
import type { ContactInput } from "@/lib/validation/schemas";

/**
 * Inquiry delivery. With RESEND_API_KEY and CONTACT_TO_EMAIL configured the
 * inquiry is emailed via Resend; otherwise (demo/local mode) it is appended as
 * a JSON line to .demo-data/inquiries.json and logged, so nothing is lost while
 * the site runs without email credentials.
 */

export const INQUIRY_TYPE_LABELS: Record<ContactInput["inquiryType"], string> = {
  PERFORMANCE_BOOKING: "Performance booking",
  COACHING: "Coaching",
  WORKSHOP: "Workshop",
  PRESS_MEDIA: "Press & media",
  COLLABORATION_SESSION: "Collaboration & session",
  GENERAL: "General",
};

export async function deliverInquiry(input: ContactInput): Promise<void> {
  const label = INQUIRY_TYPE_LABELS[input.inquiryType];
  const lines = [
    `Inquiry type: ${label}`,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.organisation ? `Organisation: ${input.organisation}` : null,
    input.eventDate ? `Event date: ${input.eventDate}` : null,
    input.location ? `Location: ${input.location}` : null,
    "",
    "Message:",
    input.message,
  ].filter((l): l is string => l !== null);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (apiKey && to) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "website@osmanmeyredi.com",
        to,
        reply_to: input.email,
        subject: `Website inquiry — ${label} — ${input.name}`,
        text: lines.join("\n"),
      }),
    });
    if (!res.ok) {
      throw new Error(`Resend responded with ${res.status}`);
    }
    return;
  }

  // Demo/local fallback: append a JSON line, never crash the request over it.
  try {
    const { mkdir, appendFile } = await import("node:fs/promises");
    await mkdir(".demo-data", { recursive: true });
    await appendFile(
      ".demo-data/inquiries.json",
      JSON.stringify({ receivedAt: new Date().toISOString(), ...input }) + "\n",
      "utf8"
    );
  } catch {
    // Swallow filesystem errors — the console log below still records the inquiry.
  }
  console.log(`[contact] Inquiry (${label}) from ${input.name} <${input.email}>`);
}
