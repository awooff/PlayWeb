<template>
  <div class="bg-zinc-300 border-b-2 border-black font-serif">
    <UContainer>
      <header class="flex items-center justify-between py-2.5 px-5 gap-5 md:flex-row flex-col md:items-center items-start">
        <NuxtLink to="/" class="text-2xl font-bold text-blue-600 no-underline hover:underline">
          PlayWeb
        </NuxtLink>

        <nav class="flex gap-1 flex-wrap items-center">
          <UButton 
            v-for="link in mainNavLinks" 
            :key="link.to"
            :to="link.to"
            variant="link"
            class="nav-link"
          >
            {{ link.label }}
          </UButton>
          
          <div v-if="user" class="flex items-center gap-2 ml-2">
            <UDropdownMenu
              :items="userMenuItems" :popper="{ placement: 'bottom-end' }"
              :ui="{ width: 'w-48', item: { active: 'bg-yellow-50 text-blue-600' } }"
            >
              <UButton variant="ghost" class="user-button">
                <UIcon name="i-lucide-user-circle" class="w-5 h-5 mr-1" />
                {{ user.username || user.email || 'User' }}
                <UIcon name="i-lucide-chevron-down" class="w-4 h-4 ml-1" />
              </UButton>
            </UDropdownMenu>
          </div>

          <template v-else>
            <UButton 
              to="/login"
              variant="link"
              class="nav-link"
            >
              Sign In
            </UButton>
            <UButton 
              to="/register"
              variant="link"
              class="nav-link"
            >
              Register
            </UButton>
          </template>
        </nav>
      </header>
    </UContainer>
  </div>
</template>

<script setup>
const { data: user } = await useFetch('/api/auth/session', {
  default: () => null,
  server: false
})

const mainNavLinks = [
  { to: '/games', label: 'Games' },
  { to: '/create', label: 'Create' },
  { to: '/community', label: 'Community' },
  { to: '/about', label: 'About' }
]

const userMenuItems = [
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      click: () => navigateTo('/profile')
    },
    {
      label: 'Dashboard',
      icon: 'i-lucide-home',
      click: () => navigateTo('/dashboard')
    },
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      click: () => navigateTo('/settings')
    }
  ],
  [
    {
      label: 'Sign Out',
      icon: 'i-lucide-log-out',
      click: async () => {
        await $fetch('/api/auth/logout', { method: 'POST' })
        await navigateTo('/login')
      }
    }
  ]
]

</script>

<style scoped>
:deep(.nav-link) {
  color: rgb(37 99 235); /* text-blue-600 */
  text-decoration: underline;
  background-color: transparent;
  border: 0;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
}

:deep(.nav-link:hover) {
  background-color: rgb(254 252 232); /* bg-yellow-50 */
}

:deep(.nav-link:visited) {
  color: rgb(126 34 206); /* text-purple-700 */
}

:deep(.user-button) {
  color: rgb(37 99 235); /* text-blue-600 */
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 0.875rem;
  border: 1px solid rgb(209 213 219); /* border-gray-300 */
  background-color: white;
}

:deep(.user-button:hover) {
  background-color: rgb(254 252 232); /* bg-yellow-50 */
}
</style>
