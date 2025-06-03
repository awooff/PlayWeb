<template>
  <div :class="boxClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface Props {
	w: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
	h?: "1" | "2" | "3" | "4";
	gradient?: string;
	border?:
		| "lime"
		| "cyan"
		| "magenta"
		| "orange"
		| "red"
		| "purple"
		| "blue"
		| "yellow"
		| "pink"
		| "green";
	class?: string;
}

const props = withDefaults(defineProps<Props>(), {
	h: "1",
	gradient: "from-gray-800/50 to-gray-700/50",
	border: "lime",
});

const boxClasses = computed(() => {
	const baseClasses = [
		"p-6 transition-all duration-300 group cursor-pointer",
		"hover:scale-105 hover:z-10 relative",
		`col-span-${props.w}`,
		`row-span-${props.h}`,
		`bg-gradient-to-br ${props.gradient}`,
	];

	const borderClasses = {
		lime: "border-lime-400 hover:border-lime-300",
		cyan: "border-cyan-400 hover:border-cyan-300",
		magenta: "border-magenta-400 hover:border-magenta-300",
		orange: "border-orange-400 hover:border-orange-300",
		red: "border-red-400 hover:border-red-300",
		purple: "border-purple-400 hover:border-purple-300",
		blue: "border-blue-400 hover:border-blue-300",
		yellow: "border-yellow-400 hover:border-yellow-300",
		pink: "border-pink-400 hover:border-pink-300",
		green: "border-green-400 hover:border-green-300",
	};

	return twMerge(clsx(baseClasses, borderClasses[props.border], props.class));
});
</script>
