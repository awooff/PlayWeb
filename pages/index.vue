<template>
  <div class="
    bg-[url('~/assets/img/background.png')]
    z-0 min-h-screen
  ">
    <div class="
      flex flex-col h-screen m-0 justify-center items-center
    ">
      <NuxtLink
        class="text-4xl text-yellow"
        to="/home">
        Click To Enter...
      </NuxtLink>
    </div>

  </div>
</template>

<script>
definePageMeta({
	auth: false,
});
</script>
