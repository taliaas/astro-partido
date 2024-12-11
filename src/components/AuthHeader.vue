<template>
  <header class="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Welcome Message -->
        <div class="flex-1 text-center">
          <h1 class="text-lg font-semibold text-gray-900">PCC CUJAE</h1>
        </div>
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
        <div>
          <a class="block px-4 py-2 text-md text-gray-700 hover:text-blue-600">Registrar</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown, Globe, Search, User } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const showLanguageMenu = ref(false);
const currentLang = ref("ES");

const changeLanguage = (lang) => {
  currentLang.value = lang;
  showLanguageMenu.value = false;
};

const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value;
};
</script>
