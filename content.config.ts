import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
	collections: {
		blog: defineCollection({
			source: "blog/*.md",
			type: "page",
			// Define custom schema for docs collection
			schema: z.object({
				title: z.string(),
				description: z.string(),
				tags: z.array(z.string()),
				image: z.string(),
				date: z.date(),
			}),
		}),
		wiki: defineCollection({
			source: "wiki/*.md",
			type: "page",
			// Define custom schema for docs collection
			schema: z.object({
				title: z.string(),
				description: z.string(),
				tags: z.array(z.string()),
				image: z.string(),
				date: z.date(),
			}),
		}),
	},
});
