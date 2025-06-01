<template>
  <AppNavbar/>
  <div class="font-serif min-h-screen">
    <UContainer class="bg-white py-5">
      <div class="flex gap-5 max-w-6xl mx-auto lg:flex-row flex-col">
        <main class="flex-1 flex flex-col gap-5">
          <slot/>
        </main>
        <AppSidebar class="lg:order-none order-first lg:w-auto w-full" />
      </div>
    </UContainer>
  </div>
</template>
