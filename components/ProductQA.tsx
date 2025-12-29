"use client";

import React from "react";
import { MessageSquare, User, Calendar, CheckCircle2 } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";

interface Question {
    _id: string;
    name: string;
    question: string;
    answer?: string;
    _createdAt: string;
}

interface ProductQAProps {
    questions: Question[];
}

const ProductQA = ({ questions }: ProductQAProps) => {
    if (questions.length === 0) return null;

    return (
        <div className="mt-10 border-t pt-10 pb-10">
            <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-darkColor text-nowrap">Product Q&A</h2>
                <div className="h-px w-full bg-gray-200" />
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
                {questions.map((item, index) => (
                    <AccordionItem
                        key={item._id}
                        value={`item-${index}`}
                        className="border rounded-2xl px-6 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                    >
                        <AccordionTrigger className="hover:no-underline py-6">
                            <div className="flex flex-col items-start text-left gap-2 w-full pr-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-darkColor text-lg leading-tight">Q: {item.question}</span>
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                </div>
                                <div className="flex items-center gap-4 text-sm text-lightColor font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5" />
                                        {item.name}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-nowrap">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(item._createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6">
                            {item.answer ? (
                                <div className="bg-white rounded-xl p-5 border border-primary/10 relative shadow-sm">
                                    <div className="flex gap-3">
                                        <div className="bg-primary/10 p-2 rounded-lg h-fit">
                                            <span className="font-bold text-primary text-sm">A</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-darkColor leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-lightColor italic px-4">This question hasn&apos;t been answered yet.</p>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default ProductQA;
