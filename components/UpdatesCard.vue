<template>
  <aside class="sidebar">
    <UCard class="card">
      <template #header>
        <h3 class="card-title">PlayEngine Documentation</h3>
      </template>
      <UVerticalNavigation 
        :links="docLinks" 
        class="nav"
      />
    </UCard>
    
    <UCard class="card">
      <template #header>
        <h3 class="card-title">Quick Links</h3>
      </template>
      <UVerticalNavigation 
        :links="quickLinks" 
        class="nav"
      />
    </UCard>
    
    <UCard class="card">
      <template #header>
        <h3 class="card-title">Community</h3>
      </template>
      <UVerticalNavigation 
        :links="communityLinks" 
        class="nav"
      />
    </UCard>
    
    <UCard class="card">
      <template #header>
        <h3 class="card-title">Tools & Resources</h3>
      </template>
      <UVerticalNavigation 
        :links="resourceLinks" 
        class="nav"
      />
    </UCard>
  </aside>
</template>

<script setup>
const docLinks = [
	{ label: "Getting Started", to: "/docs/getting-started" },
	{ label: "API Reference", to: "/docs/api-reference" },
	{ label: "Tutorials", to: "/docs/tutorials" },
	{ label: "Code Examples", to: "/docs/examples" },
];

const quickLinks = [
	{ label: "Installation Guide", to: "/docs/installation" },
	{ label: "Component Library", to: "/docs/components" },
	{ label: "Scripting Guide", to: "/docs/scripting" },
	{ label: "Deployment", to: "/docs/deployment" },
];

const communityLinks = [
	{ label: "GitHub", to: "https://github.com/playweb", target: "_blank" },
	{ label: "Discord Server", to: "/discord" },
	{ label: "Community Forum", to: "/forum" },
	{ label: "User Showcase", to: "/showcase" },
];

const resourceLinks = [
	{ label: "Sprite Editor", to: "/tools/sprite-editor" },
	{ label: "Sound Library", to: "/tools/sound-library" },
	{ label: "Asset Store", to: "/tools/asset-store" },
	{ label: "Game Templates", to: "/templates" },
];
</script>

<style scoped>
.sidebar {
  width: 17.5rem; /* w-70 */
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #000000;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}

:deep(.card) {
  background-color: rgb(250 250 250); /* bg-zinc-50 */
  border: 2px solid rgb(212 212 216); /* border-zinc-300 */
  border-radius: 0;
  box-shadow: none;
  border-style: inset;
}

:deep(.card .card-header) {
  background-color: rgb(228 228 231); /* bg-zinc-200 */
  border-bottom: 1px solid rgb(212 212 216); /* border-zinc-300 */
  padding: 0.5rem;
  margin: -1rem -1rem 1rem -1rem;
}

:deep(.nav a) {
  color: rgb(37 99 235); /* text-blue-600 */
  text-decoration: underline;
  font-size: 0.75rem;
  padding: 0.125rem 0.25rem;
  border-radius: 0;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}

:deep(.nav a:visited) {
  color: rgb(126 34 206); /* text-purple-700 */
}

:deep(.nav a:hover) {
  background-color: rgb(254 252 232); /* bg-yellow-50 */
  text-decoration: underline;
}
</style>
