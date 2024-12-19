<template>
  <header class="flex items-center justify-between px-4 py-3 bg-white border-b">
    <!-- Logo and Brand -->
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <span class="text-lg font-bold text-primary-foreground">M</span>
      </div>
      <h1 class="text-lg font-semibold text-foreground">
        Plataforma de Análisis de KPIs
      </h1>
    </div>

    <!-- Navigation -->
    <nav class="hidden md:flex items-center text-gray-500 text-md font-semibold space-x-6">
      <a 
        v-for="item in navigationItems" 
        :key="item.name"
        :href="item.href"
        class="text-muted-foreground hover:text-foreground transition-colors"
      >
        {{ item.name }}
      </a>
    </nav>

    <!-- Right Section -->
    <div class="flex items-center space-x-4">
      <!-- Search -->
      <div class="relative hidden sm:block">
        <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Buscar..." 
          class="w-64 pl-10 pr-4 py-2 text-sm bg-muted rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Action Buttons -->
      <button class="p-2 hover:bg-muted rounded-full hover:bg-gray-200">
        <BellIcon class="h-5 w-5 text-muted-foreground hover:text-gray-900" />
      </button>
      <button class="p-2 hover:bg-muted rounded-full hover:bg-gray-200">
        <MessageSquareIcon class="h-5 w-5 text-muted-foreground" />
      </button>
      
      <!-- Theme Toggle -->
      <button 
        @click="toggleTheme" 
        class="p-2 hover:bg-accent rounded-full hover:bg-gray-200"
      >
        <SunIcon v-if="isDark" class="h-5 w-5 text-muted-foreground" />
        <MoonIcon v-else class="h-5 w-5 text-muted-foreground" />
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
    //document.documentElement.classList.toggle('dark')
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
