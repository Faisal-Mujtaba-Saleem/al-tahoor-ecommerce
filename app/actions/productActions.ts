"use server";

import { client } from "@/sanity/lib/client";

const token = process.env.SANITY_API_TOKEN;

export async function submitQuestion(formData: {
    productId: string;
    name: string;
    email: string;
    question: string;
}) {
    if (!token) {
        return { success: false, error: "Sanity API token is not configured" };
    }

    const writeClient = client.withConfig({
        token,
        useCdn: false,
    });

    try {
        await writeClient.create({
            _type: "question",
            product: {
                _type: "reference",
                _ref: formData.productId,
            },
            name: formData.name,
            email: formData.email,
            question: formData.question,
            status: "pending",
        });

        return { success: true };
    } catch (error) {
        console.error("Error submitting question:", error);
        return { success: false, error: "Failed to submit question" };
    }
}

export async function getPolicyBySlug(slug: string) {
    try {
        const policy = await client.fetch(
            `*[_type == "policy" && slug.current == $slug][0]`,
            { slug }
        );
        return policy;
    } catch (error) {
        console.error("Error fetching policy:", error);
        return null;
    }
}

export async function getQuestionsByProductId(productId: string) {
    try {
        const questions = await client.fetch(
            `*[_type == "question" && product._ref == $productId && status == "answered"] | order(_createdAt desc)`,
            { productId }
        );
        return questions;
    } catch (error) {
        console.error("Error fetching questions:", error);
        return [];
    }
}
