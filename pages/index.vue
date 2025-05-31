<script setup lang="ts">
  async function navButton(){
    await navigateTo({path: 'app'})
  }
</script>
<template>
  <h1 class="text-8xl uppercase">An MMO web experience for the 2020s.</h1>
  <h2 class="text-xl">It's <em>Playtime.</em></h2>
  <hr/>
  <UButton
    color="primary"
    :onclick="navButton"
    class="max-w-xs text-center inline-flex">stuff</UButton>
</template>
