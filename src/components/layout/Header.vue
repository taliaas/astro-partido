<template>
  <header class="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Welcome Message -->
        <div class="flex-1 text-center">
          <h1 class="text-lg font-semibold text-gray-900">PCC CUJAE</h1>
        </div>

        <!-- Search Bar -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              placeholder="Buscar documentos..."
              class="h-10 w-full rounded-full border-0 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Right Actions -->
        <div class="flex-1 flex items-center justify-end gap-2">
          <!-- Notifications -->
          <Button
            variant="ghost"
            class="relative p-2 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
          >
            <span class="sr-only">Ver notificaciones</span>
            <Bell class="h-5 w-5" />
            <span
              class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"
            ></span>
          </Button>

          <!-- Divider -->
          <div class="h-6 w-px bg-gray-200"></div>

          <!-- Language Selector -->
          <div class="relative">
            <Button
              variant="ghost"
              @click="toggleLanguageMenu"
              class="group inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Globe class="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              <span class="ml-1.5">{{ currentLang }}</span>
              <ChevronDown class="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
            </Button>
            <div
              v-if="showLanguageMenu"
              class="absolute right-0 mt-2 w-30 rounded shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            >
              <div
                class="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <a
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="changeLanguage('ES')"
                  >Español</a
                >
                <a
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="changeLanguage('EN')"
                  >English</a
                >
              </div>
            </div>
          </div>

          <div class="relative">
            <button
              @click="toggleProfileMenu"
              class="inline-flex items-center justify-center rounded text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              <User class="mr-2 h-4 w-4" />
              Perfil
              <ChevronDown class="ml-2 h-4 w-4" />
            </button>
            <div
              v-if="showProfileMenu"
              class="absolute right-0 mt-2 w-52 rounded shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            >
              <div
                class="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >Mi Perfil</a
                >
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >Configuración</a
                >
                <Separator class="bg-gray-200" />
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-red-600 hover:text-red-800"
                  @click="handleLogout"
                >
                  <LogOut class="mr-2 h-4 w-4 inline" />
                  Cerrar Sesión
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Separator } from "src/components/ui/separator";
import { Bell, ChevronDown, Globe, LogOut, Search, User } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const showProfileMenu = ref(false);
const currentLang = ref("ES");
const showLanguageMenu = ref(false);

const handleLogout = () => {
  console.log("Cerrando sesión...");
};
const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value;
};

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

const changeLanguage = (lang) => {
  currentLang.value = lang;
  showLanguageMenu.value = false;
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
