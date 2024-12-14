<template>
  <div class="w-64 border-l bg-white p-4 hidden xl:block">
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar for desktop -->
      <aside
        :class="[
          'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-blue-600 text-white lg:translate-x-0',
          { '-translate-x-full': !isOpen },
        ]"
      >
        <div class="flex items-center justify-between p-4">
          <a href="/" class="flex items-center space-x-2">
            <HomeIcon class="w-8 h-8 text-blue-300" />
            <span class="text-xl font-bold">Nombre</span>
          </a>
        </div>
        <nav class="p-4 space-y-2">
          <!-- Actas Item -->
          <a
            href="/actas"
            class="flex items-center px-4 py-3 rounded-lg hover:bg-blue-500/20 transition-all duration-200 cursor-pointer group"
          >
            <FileTextIcon
              class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform"
            />
            <span class="font-medium">Actas</span>
          </a>

          <!-- Funcionamiento Dropdown -->
          <div class="space-y-1">
            <button
              @click="toggleDropdown"
              class="w-full flex items-center justify-between px-4 py-3 rounded hover:bg-blue-500/20 transition-all duration-200 group"
              :class="{ 'bg-blue-500/30': isOpen }"
            >
              <div class="flex items-center">
                <SettingsIcon
                  class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform"
                />
                <span class="font-medium">Funcionamiento</span>
              </div>
              <ChevronDownIcon
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }"
              />
            </button>

            <!-- Dropdown Items -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div v-if="isOpen" class="pl-4 space-y-1">
                <template v-for="(item, index) in menuItems" :key="index">
                  <a
                    :href="item.path"
                    class="flex items-center px-4 py-2.5 rounded hover:bg-blue-500/20 transition-all duration-200 cursor-pointer group"
                    :class="{ 'bg-blue-500/10': item.active }"
                    @mouseenter="item.active = true"
                    @mouseleave="item.active = false"
                  >
                    <component
                      :is="item.icon"
                      class="w-4 h-4 mr-3 group-hover:scale-110 transition-transform"
                    />
                    <span class="text-sm">{{ item.name }}</span>
                  </a>
                </template>
              </div>
            </transition>
          </div>
        </nav>
      </aside>

      <!-- Main content -->
      <div class="flex-1 lg:ml-44">
        <!-- Top bar for mobile -->
        <header
          class="bg-white shadow-md p-4 flex items-center justify-between lg:hidden"
        >
          <Button variant="ghost" size="icon" @click="toggleSidebar">
            <Menu class="h-6 w-6" />
          </Button>
        </header>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";

import { ref } from "vue";
import {
  FileTextIcon,
  SettingsIcon,
  ChevronDownIcon,
  UserCheck,
  CalculatorIcon,
  BuildingIcon,
  Calculator,
  ActivitySquare,
  HomeIcon,
} from "lucide-vue-next";

const isOpen = ref(false);
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};
const menuItems = ref([
  {
    name: "Asistencia",
    icon: UserCheck,
    path: "/asistencia",
    active: false,
  },
  {
    name: "Computo",
    icon: Calculator,
    path: "/cierrefunc",
    active: false,
  },
  {
    name: "Parte Municipio",
    icon: BuildingIcon,
    path: "/parte",
    active: false,
  },
  {
    name: "Estado",
    icon: ActivitySquare,
    path: "/estadofunc",
    active: false,
  },
]);
</script>
