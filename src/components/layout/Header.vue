<template>
  <header class="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-800 border-b dark:border-gray-700">
    <!-- Logo and Brand -->
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 rounded flex items-center justify-center">
        <span
          class="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
          M
        </span>
      </div>
      <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
        Plataforma de Análisis de Indicadores
      </h1>
    </div>

    <!-- Navigation -->
    <slot name="navigation"/>

    <!-- Right Section -->
    <div class="flex items-center space-x-4">
      <!-- Search -->
      <div class="relative hidden sm:block">
        <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
        <input type="search" placeholder="Buscar..."
          class="w-64 pl-10 pr-4 py-2 text-sm bg-muted dark:bg-zinc-700 rounded-full border dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400" />
      </div>

      <!-- Action Buttons -->
      <a href="/notification" class="p-2 hover:bg-muted dark:hover:bg-gray-700 rounded-full">
        <BellIcon class="h-5 w-5 text-muted-foreground dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" />
      </a>
      <a href="/chat" class="p-2 hover:bg-muted dark:hover:bg-gray-700 rounded-full">
        <MessageSquareIcon class="h-5 w-5 text-muted-foreground dark:text-gray-400 dark:hover:text-white" />
      </a>

      <!-- Theme Toggle -->
      <button @click="toggleTheme" class="p-2 hover:bg-accent dark:hover:bg-gray-700 rounded-full">
        <SunIcon v-if="isDark" class="h-5 w-5 text-muted-foreground dark:text-gray-400 dark:hover:text-white" />
        <MoonIcon v-else class="h-5 w-5 text-muted-foreground dark:text-gray-400 " />
      </button>

      <!-- User Menu -->
      <UserNav />
    </div>
  </header>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  SearchIcon,
  BellIcon,
  MessageSquareIcon,
  SunIcon,
  MoonIcon
} from 'lucide-vue-next'
import UserNav from '../Otros/UserNav.vue';

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  isDark.value = savedTheme === 'dark' || (!savedTheme && systemPrefersDark)

  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
})

</script>
