// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
	ssr: true,
	compatibilityDate: "2025-05-15",
	devtools: { enabled: true },
	css: ["~/assets/css/main.css", "~/assets/css/colours.css"],
	components: [
		{
			path: "~/components",
			pathPrefix: false,
		},
	],
	image: {
		domains: ["nataziel.nexus"],
	},
	nitro: {
		experimental: {
			wasm: true,
			tasks: true,
		},
	},
	vite: {
		optimizeDeps: {
			include: ["drizzle-orm"],
		},
	},
	build: {
		transpile: ["drizzle-orm", "drizzle-kit"],
	},
	modules: [
		"@nuxt/content",
		"@nuxt/fonts",
		"@nuxt/icon",
		"@nuxt/image",
		"@nuxt/scripts",
		"@nuxt/ui",
		"@nuxt/test-utils",
		"@vee-validate/nuxt",
		"@pinia/nuxt",
	],
});
