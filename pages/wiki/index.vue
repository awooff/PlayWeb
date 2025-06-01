<script setup lang="ts">
const { data: posts } = await useAsyncData('wiki', () => {
  return queryCollection('wiki').all()
})
</script>

<template>
  <div>
    <h1>Blog</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <NuxtLink class="text-secondary underline" :to="post.path">{{ post.title }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

definePageMeta({
  layout: 'home'
})