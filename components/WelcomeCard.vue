<template>
  <UCard class="card bg-white text-black">
    <template #header>
      <div>
        <h1 class="text-3xl font-serif text-black mb-1 border-b border-gray-300 pb-1">
          Welcome to PlayWeb
        </h1>
        <p class="italic text-gray-600 text-base mt-0">
          The Interactive Game Development Platform
        </p>
      </div>
    </template>
    
    <div class="font-serif">
      <section class="mb-8">
        <h2 class="text-xl text-black mt-5 mb-2.5 border-b border-gray-300 pb-0.5 font-serif">
          What is PlayWeb?
        </h2>
        <p class="leading-relaxed my-2.5 text-justify">
          PlayWeb is a revolutionary platform that combines the power of modern web technologies 
          with the simplicity of visual game development. Built on top of the PlayEngine, 
          it enables developers and creators to build interactive games and experiences 
          directly in the browser.
        </p>
        
        <h3 class="text-base text-black mt-4 mb-2 font-serif">Features</h3>
        <ul class="my-2.5 pl-8">
          <li class="my-1 leading-snug font-serif">
            <strong>Visual Editor:</strong> Drag-and-drop interface for rapid prototyping
          </li>
          <li class="my-1 leading-snug font-serif">
            <strong>PlayEngine Integration:</strong> Powered by our custom game engine
          </li>
          <li class="my-1 leading-snug font-serif">
            <strong>Web-First:</strong> Deploy games instantly to any device
          </li>
          <li class="my-1 leading-snug font-serif">
            <strong>Community Driven:</strong> Share and collaborate with other developers
          </li>
        </ul>
        
        <h3 class="text-base text-black mt-4 mb-2 font-serif">Getting Started</h3>
        <p class="leading-relaxed my-2.5 text-justify">
          Ready to create your first game? Check out our documentation in the sidebar 
          or jump straight into the Game Creator.
        </p>
        
        <div class="mt-5 mb-0 flex gap-4">
          <UButton 
            to="/create" 
            class="cta-primary"
            size="lg"
          >
            Start Creating
          </UButton>
          <UButton 
            to="/games" 
            class="cta-secondary"
            size="lg"
            variant="outline"
          >
            Browse Games
          </UButton>
        </div>
      </section>
    </div>
  </UCard>
</template>

<style scoped>
@reference "~/assets/css/main.css";
:deep(.card) {
  @apply bg-white border-2 border-gray-300 rounded-none shadow-none;
  border-style: inset;
}

:deep(.card .card-header) {
  @apply  border-b border-gray-300 p-4 -m-4 mb-4;
}

:deep(.cta-primary) {
  @apply text-black font-bold font-serif rounded-none;
  border: 2px outset #cccccc;
}

:deep(.cta-primary:hover) {
  @apply bg-gray-300;
}

:deep(.cta-secondary) {
  @apply bg-gray-100 text-black font-bold font-serif rounded-none;
  border: 2px outset #cccccc;
}
</style>
