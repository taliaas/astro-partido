<template>
      <!-- User Dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger class="focus:outline-none">
          <button class="flex items-center space-x-2 hover:bg-accent rounded-full p-1 bg-gray-100 hover:bg-gray-200">
            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center ">
              <span class="text-md font-medium text-muted-foreground">U</span>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56">
          <DropdownMenuItem @click="profileOpen" class="hover:bg-gray-200">
            <User class="mr-2 h-4 w-4" />
            <span>Mi Cuenta</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem @click="settingsOpen" class="hover:bg-gray-200">
            <Settings class="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem @click="helpOpen" class="hover:bg-gray-200">
            <HelpCircle class="mr-2 h-4 w-4" />
            <span>Ayuda</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator class="bg-gray-200 border"/>
          
          <DropdownMenuItem  @click="handleLogout"
          class="text-red-500 focus:text-red-500 hover:bg-gray-200 hover:text-red-700">
            <LogOut class="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div
        v-if="showSesionModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div class="bg-white rounded p-6 w-full max-w-md">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Cerrar Sesión</h3>
          <form @submit.prevent="handleSesion" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Está seguro que desea cerrar sesión?</label
              >
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="submit"
                class="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              
                <a
                  href="/"
                  class="px-4 py-2 mr-4 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
                  @click="out"
                >
                  OK
                </a>
            </div>
          </form>
        </div>
      </div>
  </template>
  
  <script setup lang="ts">
  import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
  } from '@/components/ui/dropdown-menu'
import { removeToken } from '@/lib/auth';
import { navigate } from 'astro:transitions/client';
  import {
    User,
    Settings,
    HelpCircle,
    LogOut
  } from 'lucide-vue-next'
  
  import { ref } from "vue";
  const showSesionModal = ref(false);
  
  const handleLogout = () => {
    showSesionModal.value = true;
  };
  const out = () => {
    removeToken();
  }
  
  const handleSesion = () => {
    showSesionModal.value = false;
  };
  
  const profileOpen = () => {
    navigate('/perfil')
  }
  const helpOpen = () => {
    navigate('/help')
  }
  const settingsOpen = () => {
    navigate('/settings')
  }

</script>
  
  