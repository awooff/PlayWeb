<script setup lang="ts">
    type WikiPage = {
      title         : string
      date          : string
      description   : string
      image         : string
      alt           : string
      tags          : string[]
      published     : boolean
    }
    
    const { path } = useRoute()

    const { data: articleContent, error } = await useAsyncData(
      `wiki-${path}`, // Unique key for caching
      () => queryContent('wiki').where({ _path: path }).findOne() // Or use .find() if expecting multiple, but .findOne() is typical for a slug page
    );

    if (error.value || !articleContent.value) {
      throw createError({ statusCode: 404, statusMessage: 'Wiki page not found' });
    }

    const data = computed<WikiPage>(() => {
        const meta = articleContent?.value?.meta as unknown as WikiPage
        return {
            title: articleContent.value?.title || 'no-title available',
            description: articleContent.value?.description || 'no-description available',
            image: articleContent.value?.image || '/not-found.jpg',
            alt: meta?.alt || 'no alter data available',
            date: meta?.date || 'not-date-available',
            tags: meta?.tags || [],
            published: meta?.published || false,
        }
    })
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

definePageMeta({
  layout: 'home',
  auth: false
})
