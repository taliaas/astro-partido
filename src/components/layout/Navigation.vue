<script setup lang="ts">
const { path } = defineProps<{
  path: string;
}>();

const navigationItems = [
  { name: "Funcionamiento", href: "/minutes" },
  { name: "Procesos", href: "/process" },
  { name: "Análisis", href: "/analisis_indicador" },
  { name: "Reportes", href: "/estadofunc" },
];
</script>

<template>
  <nav
    class="hidden md:flex items-center text-gray-500 dark:text-gray-300 text-md font-semibold space-x-6"
  >
    <a
      v-for="item in navigationItems"
      :key="item.name"
      :href="item.href"
      :class="[
        'dark:text-gray-400 hover:text-foreground dark:hover:text-white transition-colors',
        { 'text-blue-600': path === item.href },
      ]"
    >
      {{ item.name }}
    </a>
  </nav>
</template>
