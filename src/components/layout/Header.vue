<template>
  <header class="flex items-center justify-between px-4 py-3 bg-background border-b">
    <!-- Logo and Brand -->
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <span class="text-lg font-bold text-primary-foreground">N</span>
      </div>
      <h1 class="text-lg font-semibold text-foreground">
        Plataforma de Análisis de KPIs
      </h1>
    </div>

    <!-- Navigation -->
    <nav class="hidden md:flex items-center space-x-6">
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
          class="w-64 pl-10 pr-4 py-2 text-sm bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <!-- Action Buttons -->
      <button class="p-2 hover:bg-muted rounded-full">
        <BellIcon class="h-5 w-5 text-muted-foreground" />
      </button>
      <button class="p-2 hover:bg-muted rounded-full">
        <MessageSquareIcon class="h-5 w-5 text-muted-foreground" />
      </button>
      
      <!-- Theme Toggle -->
      <button 
        @click="toggleTheme"
        class="p-2 hover:bg-muted rounded-full"
      >
        <SunIcon v-if="isDark" class="h-5 w-5 text-muted-foreground" />
        <MoonIcon v-else class="h-5 w-5 text-muted-foreground" />
      </button>

      <!-- User Menu -->
      <button class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span class="text-sm font-medium text-primary-foreground">U</span>
        </div>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import {
  SearchIcon,
  BellIcon,
  MessageSquareIcon,
  SunIcon,
  MoonIcon
} from 'lucide-vue-next'

const navigationItems = [
  { name: 'Inicio', href: '#' },
  { name: 'Funcionamiento', href: '#' },
  { name: 'Análisis', href: '#' },
  { name: 'Reportes', href: '#' }
]

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
}
</script>