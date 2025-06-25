<script setup lang="ts">
import { usePermissions } from "@/utils/auth-client";
import { computed } from "vue";

const { path } = defineProps<{
  path: string;
}>();

const hasPermissions = usePermissions();

const navigationItems = computed(() => [
  {
    name: "Funcionamiento",
    href: "/minutes",
    hasPermission: hasPermissions("Documentos", "read"),
  },
  {
    name: "Procesos",
    href: "/process",
    hasPermission: hasPermissions("Procesos", "read"),
  },
  {
    name: "Cómputo",
    href: "/analisis_indicador",
    hasPermission: hasPermissions("Análisis", "read"),
  },
  {
    name: "Reportes",
    href: "/estadofunc",
    hasPermission: hasPermissions("Reportes", "read"),
  },
]);
</script>

<template>
  <nav
    class="flex items-center text-gray-500 dark:text-gray-300 text-md font-semibold space-x-6"
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
