"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { contactInput } from "@/lib/validation/schemas";
import { rateLimit } from "@/lib/rateLimit";
import { deliverInquiry } from "@/server/services/contactDelivery";

export type ContactFormState = {
  ok: boolean;
  /** General (non-field) message: rate limit, delivery failure, validation hint. */
  message?: string;
  /** Field-level errors keyed by input name. */
  errors?: Partial<Record<string, string[]>>;
};

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot: real visitors never see or fill this field. Pretend success so
  // bots get no signal, and deliver nothing.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { ok: true };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return {
      ok: false,
      message:
        "You've sent a few messages in quick succession — please wait ten minutes and try again, or email Osman directly.",
    };
  }

  const parsed = contactInput.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    organisation: formData.get("organisation") ?? "",
    inquiryType: formData.get("inquiryType") ?? "",
    eventDate: formData.get("eventDate") ?? "",
    location: formData.get("location") ?? "",
    message: formData.get("message") ?? "",
    website: "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields below.",
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await deliverInquiry(parsed.data);
  } catch {
    return {
      ok: false,
      message:
        "Something went wrong sending your message. Please try again in a moment, or email Osman directly.",
    };
  }

  return { ok: true };
}
