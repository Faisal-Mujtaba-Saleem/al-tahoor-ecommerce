"use client";

import React, { useState } from "react";
import { Product } from "@/sanity.types";
import { FaRegQuestionCircle } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitQuestion } from "@/app/actions/productActions";
import toast from "react-hot-toast";
import { z } from "zod";

const questionSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    question: z.string().min(10, "Question must be at least 10 characters"),
});

interface AskQuestionButtonProps {
    product: Product;
}

const AskQuestionButton: React.FC<AskQuestionButtonProps> = ({ product }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            question: formData.get("question") as string,
        };

        const result = questionSchema.safeParse(data);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            setLoading(false);
            return;
        }

        try {
            const response = await submitQuestion({
                productId: product._id,
                ...data,
            });

            if (response.success) {
                toast.success("Question submitted successfully!");
                setOpen(false);
            } else {
                toast.error(response.error || "Failed to submit question");
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
                    <FaRegQuestionCircle className="text-lg" />
                    <p>Ask a question</p>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ask a Question about {product.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col gap-1">
                        <Input
                            name="name"
                            placeholder="Your Name"
                            disabled={loading}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Input
                            name="email"
                            type="email"
                            placeholder="Your Email"
                            disabled={loading}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Textarea
                            name="question"
                            placeholder="Your Question"
                            disabled={loading}
                            className={errors.question ? "border-red-500" : ""}
                        />
                        {errors.question && (
                            <p className="text-xs text-red-500">{errors.question}</p>
                        )}
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Submitting..." : "Submit Question"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AskQuestionButton;
