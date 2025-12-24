"use server";

import { sendContactFormEmail } from "@/lib/email";

export async function submitContactForm(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
        return { success: false, error: "All fields are required" };
    }

    try {
        const result = await sendContactFormEmail({ name, email, message });
        if (result.success) {
            return { success: true };
        } else {
            return { success: false, error: "Failed to send email" };
        }
    } catch (error) {
        console.error("Contact form error:", error);
        return { success: false, error: "Something went wrong. Please try again." };
    }
}
