<template>
  <aside class="sidebar">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">PlayEngine Documentation</h3>
      </div>
      <nav class="nav">
        <a v-for="link in docLinks" :key="link.to" :href="link.to">
          {{ link.label }}
        </a>
      </nav>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Quick Links</h3>
      </div>
      <nav class="nav">
        <a v-for="link in quickLinks" :key="link.to" :href="link.to" :target="link.target">
          {{ link.label }}
        </a>
      </nav>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Community</h3>
      </div>
      <nav class="nav">
        <a v-for="link in communityLinks" :key="link.to" :href="link.to" :target="link.target">
          {{ link.label }}
        </a>
      </nav>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Tools & Resources</h3>
      </div>
      <nav class="nav">
        <a v-for="link in resourceLinks" :key="link.to" :href="link.to">
          {{ link.label }}
        </a>
      </nav>
    </div>
  </aside>
</template>

<script setup>
const docLinks = [
  { label: 'Getting Started', to: '/wiki/getting-started' },
  { label: 'API Reference', to: '/wiki/api-reference' },
  { label: 'Tutorials', to: '/wiki/tutorials' },
  { label: 'Code Examples', to: '/wiki/examples' }
]

const quickLinks = [
  { label: 'Installation Guide', to: '/wiki/installation' },
  { label: 'Component Library', to: '/wiki/components' },
  { label: 'Scripting Guide', to: '/wiki/scripting' },
  { label: 'Deployment', to: '/wiki/deployment' }
]

const communityLinks = [
  { label: 'GitHub', to: 'https://github.com/playweb', target: '_blank' },
  { label: 'Discord Server', to: '/discord' },
  { label: 'Community Forum', to: '/forum' },
  { label: 'User Showcase', to: '/showcase' }
]

const resourceLinks = [
  { label: 'Sprite Editor', to: '/tools/sprite-editor' },
  { label: 'Sound Library', to: '/tools/sound-library' },
  { label: 'Asset Store', to: '/tools/asset-store' },
  { label: 'Game Templates', to: '/templates' }
]
</script>

<style scoped>
.sidebar {
  width: 17.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card {
  background-color: rgb(249 250 251);
  border: 2px solid rgb(209 213 219);
  border-radius: 0;
  box-shadow: none;
  border-style: inset;
  padding: 1rem;
}

.card-header {
  background-color: rgb(229 231 235);
  border-bottom: 1px solid rgb(209 213 219);
  padding: 0.5rem;
  margin: -1rem -1rem 1rem -1rem;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #000000;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  margin: 0;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav a {
  color: rgb(29 78 216);
  text-decoration: underline;
  font-size: 0.75rem;
  padding: 0.125rem 0.25rem;
  border-radius: 0;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  display: block;
}

.nav a:visited {
  color: rgb(91 33 182);
}

.nav a:hover {
  background-color: rgb(254 249 195);
  text-decoration: underline;
}</style>
