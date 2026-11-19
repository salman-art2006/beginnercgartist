import { z } from "zod";
import { sb } from "@/lib/db";

export const TOPICS = ["General question", "Custom project / quote", "Collaboration", "Blender help", "Kit or file request"];

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(200),
  subject: z.string().trim().max(200),
  message: z.string().trim().min(10, "Please write at least a few words").max(5000, "Message is too long"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const contactService = {
  async send(input: ContactInput): Promise<void> {
    const { error } = await sb.from("contact_messages").insert(input);
    if (error) throw new Error("Could not send your message. Please try again.");
  },
};
