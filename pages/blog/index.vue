<script setup lang="ts">
const { data: posts } = await useAsyncData('blog', () => {
  return queryCollection('blog').all()
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
