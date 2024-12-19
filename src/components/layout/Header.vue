<template>
  <header class="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-800 border-b dark:border-gray-700">
    <!-- Logo and Brand -->
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
          M
        </span>
      </div>
      <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
        Plataforma de Análisis de KPIs
      </h1>
    </div>

    <!-- Navigation -->
    <nav class="hidden md:flex items-center text-gray-500 dark:text-gray-300 text-md font-semibold space-x-6">
      <a 
        v-for="item in navigationItems" 
        :key="item.name"
        :href="item.href"
        class="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white transition-colors"
      >
        {{ item.name }}
      </a>
    </nav>

    <!-- Right Section -->
    <div class="flex items-center space-x-4">
      <!-- Search -->
      <div class="relative hidden sm:block">
        <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
        <input
          type="search"
          placeholder="Buscar..." 
          class="w-64 pl-10 pr-4 py-2 text-sm bg-muted dark:bg-zinc-700 rounded-full border dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400"
        />
      </div>

      <!-- Action Buttons -->
      <button class="p-2 hover:bg-muted dark:hover:bg-gray-700 rounded-full">
        <BellIcon class="h-5 w-5 text-muted-foreground dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" />
      </button>
      <button class="p-2 hover:bg-muted dark:hover:bg-gray-700 rounded-full">
        <MessageSquareIcon class="h-5 w-5 text-muted-foreground dark:text-gray-400 dark:hover:text-white"/>
      </button>
      
      <!-- Theme Toggle -->
      <button 
        @click="toggleTheme" 
        class="p-2 hover:bg-accent dark:hover:bg-gray-700 rounded-full"
      >
        <SunIcon v-if="isDark" class="h-5 w-5 text-muted-foreground dark:text-gray-400 dark:hover:text-white" />
        <MoonIcon v-else class="h-5 w-5 text-muted-foreground dark:text-gray-400 " />
      </button>

      <!-- User Menu -->
      <UserNav />
    </div>
  </header>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import {
  SearchIcon,
  BellIcon,
  MessageSquareIcon,
  SunIcon,
  MoonIcon
} from 'lucide-vue-next'
import UserNav from '../UserNav.vue';

const navigationItems = [
  { name: 'Inicio', href: '/home' },
  { name: 'Funcionamiento', href: '/asistencia' },
  { name: 'Análisis', href: '/cierrefunc' },
  { name: 'Reportes', href: '/estadofunc' }
]
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
