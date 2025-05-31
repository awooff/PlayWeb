<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: 'Benjamin',
      avatar: {
        src: 'https://github.com/benjamincanac.png'
      },
      type: 'label'
    }
  ],
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user'
    },
    {
      label: 'Billing',
      icon: 'i-lucide-credit-card'
    },
    {
      label: 'Settings',
      icon: 'i-lucide-cog',
      kbds: [',']
    },
    {
      label: 'Keyboard shortcuts',
      icon: 'i-lucide-monitor'
    }
  ],
  [
    {
      label: 'Team',
      icon: 'i-lucide-users'
    },
    {
      label: 'Invite users',
      icon: 'i-lucide-user-plus',
      children: [
        [
          {
            label: 'Email',
            icon: 'i-lucide-mail'
          },
          {
            label: 'Message',
            icon: 'i-lucide-message-square'
          }
        ],
        [
          {
            label: 'More',
            icon: 'i-lucide-circle-plus'
          }
        ]
      ]
    },
    {
      label: 'New team',
      icon: 'i-lucide-plus',
      kbds: ['meta', 'n']
    }
  ],
  [
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      to: 'https://github.com/nuxt/ui',
      target: '_blank'
    },
    {
      label: 'Support',
      icon: 'i-lucide-life-buoy',
      to: '/components/dropdown-menu'
    },
    {
      label: 'API',
      icon: 'i-lucide-cloud',
      disabled: true
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      kbds: ['shift', 'meta', 'q']
    }
  ]
])
</script>

<template>
  <header class="flex min-w-container space-evenly gap-4 py-8 border-b-white border-b-2">
    <nav class="inline-flex gap-4 justify-center items-center m-0">
      <UDropdownMenu
        :items="items"
        :ui="{
          content: 'w-48'
        }"
      >
        <UButton icon="i-lucide-menu" color="neutral" variant="outline" />
      </UDropdownMenu>
      <NuxtLink to="/" class="text-xl uppercase">PlayWeb</NuxtLink>
    </nav>
    <nav class="inline-flex gap-4 justify-center items-center m-0">
      <NuxtLink to="/app">APP</NuxtLink>
      <NuxtLink to="/about">ABOUT</NuxtLink>
      <NuxtLink to="/contact">CONTACT</NuxtLink>
      <NuxtLink to="/blog">BLOG</NuxtLink>
    </nav>
  </header>
</template>
