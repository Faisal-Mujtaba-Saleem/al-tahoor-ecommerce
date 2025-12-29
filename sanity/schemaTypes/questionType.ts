import { defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons";

export const questionType = defineType({
    name: "question",
    title: "Product Questions",
    type: "document",
    icon: HelpCircleIcon,
    fields: [
        defineField({
            name: "product",
            title: "Product",
            type: "reference",
            to: [{ type: "product" }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "name",
            title: "User Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "email",
            title: "User Email",
            type: "string",
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: "question",
            title: "Question",
            type: "text",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Pending", value: "pending" },
                    { title: "Answered", value: "answered" },
                    { title: "Hidden", value: "hidden" },
                ],
            },
            initialValue: "pending",
        }),
        defineField({
            name: "answer",
            title: "Answer",
            type: "text",
        }),
    ],
});
