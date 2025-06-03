<script setup lang="ts">
type WikiPage = {
	title: string;
	date: string;
	description: string;
	image: string;
	alt: string;
	tags: string[];
	published: boolean;
};

const { path } = useRoute();

const { data: articles, error } = useAsyncData(path, () =>
	queryCollection("wiki").path(path).first(),
);

const data = computed<WikiPage>(() => {
	const meta = articles?.value?.meta as unknown as WikiPage;
	return {
		title: articles.value?.title || "no-title available",
		description: articles.value?.description || "no-description available",
		image: articles.value?.image || "/not-found.jpg",
		alt: meta?.alt || "no alter data available",
		date: meta?.date || "not-date-available",
		tags: meta?.tags || [],
		published: meta?.published || false,
	};
});
</script>

<template>
  <article class="prose">
    <h1 class="text-6xl">{{data.title}}</h1>
    <small>{{data.date}}</small>

    <NuxtImg
      :src="data.image"
      :lazy-src="data.image"
    />

    <section>
      <ContentRenderer v-if="articles" :value="articles || {}"/>
    </section>
  </article>
</template>
