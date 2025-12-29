import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const policyType = defineType({
    name: "policy",
    title: "Policies",
    type: "document",
    icon: DocumentTextIcon,
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "content",
            title: "Content",
            type: "array",
            of: [{ type: "block" }],
            validation: (Rule) => Rule.required(),
        }),
    ],
});
