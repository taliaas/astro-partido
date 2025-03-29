<template>
  <header
    class="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-800 border-b dark:border-gray-700"
  >
    <!-- Logo and Brand -->
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 rounded flex items-center justify-center">
        <span
          class="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent"
        >
          M
        </span>
      </div>
      <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
        Plataforma de Análisis de Indicadores
      </h1>
    </div>

    <!-- Navigation -->
    <slot name="navigation" />

    <!-- Right Section -->
    <div class="flex items-center space-x-4">
      <!-- Search -->
      <div>
        <div class="relative">
          <div
            class="flex items-center gap-2 border px-3 py-2 rounded-md w-full"
          >
            <SearchIcon class="h-4 w-4 text-gray-400" />
            <input
              v-model="searchQuery"
              class="flex-1 border-0 outline-none bg-transparent placeholder:text-gray-400"
              placeholder="Buscar..."
              @keyup.enter="search"
            />
            <button
              @click="toggleSearchPanel"
              class="h-7 w-7 inline-flex items-center justify-center rounded-md text-gray-400 hover:text-gray-500"
            >
              <FilterIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <TooltipProvider>
        <Tooltip class="hover:bg-muted dark:hover:bg-gray-700 rounded-full">
          <TooltipTrigger>
            <a href="/notification" class="p-2">
              <BellIcon
                class="h-5 w-5 text-muted-foreground dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              />
            </a>
          </TooltipTrigger>
          <TooltipContent
            align="center"
            side="left"
            align-offset=""
            avoid-collisions="avoid-collisions"
            collision-boundary=""
            collision-padding="collision-padding"
            arrow-padding=""
            sticky="always"
            hide-when-detached="hide-when-detached"
            position-strategy="absolute"
            update-position-strategy="always"
          >
            <p>Notificaciones</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <!-- Action Buttons -->
      <a
        href="/chat"
        class="p-2 hover:bg-muted dark:hover:bg-gray-700 rounded-full"
      >
        <MessageSquareIcon
          class="h-5 w-5 text-muted-foreground dark:text-gray-400 dark:hover:text-white"
        />
      </a>

      <!-- Theme Toggle -->
      <button
        @click="toggleTheme"
        class="p-2 hover:bg-accent dark:hover:bg-gray-700 rounded-full"
      >
        <SunIcon
          v-if="isDark"
          class="h-5 w-5 text-muted-foreground dark:text-gray-400 dark:hover:text-white"
        />
        <MoonIcon
          v-else
          class="h-5 w-5 text-muted-foreground dark:text-gray-400"
        />
      </button>

      <!-- User Menu -->
      <UserNav />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  BellIcon,
  MessageSquareIcon,
  SunIcon,
  MoonIcon,
  FilterIcon,
  SearchIcon,
} from "lucide-vue-next";
import UserNav from "../Otros/UserNav.vue";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSearchStore } from "@/utils/store.ts";

const isDark = ref(false);
const searchQuery = ref("");

const searchStore = useSearchStore();

const toggleSearchPanel = () => {
  console.log("Estado: ",searchStore.showSidePanel)
  searchStore.showSidePanel = !searchStore.showSidePanel;
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  isDark.value = savedTheme === "dark" || (!savedTheme && systemPrefersDark);

  if (isDark.value) {
    document.documentElement.classList.add("dark");
  }
});
</script>
