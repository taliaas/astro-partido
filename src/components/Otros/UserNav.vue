<template>
  <!-- User Dropdown -->
  <DropdownMenu>
    <DropdownMenuTrigger class="focus:outline-none">
      <button @click="!openMenu"
        class="flex items-center space-x-2 border-2 shadow-md bg-gray-50 hover:bg-accent rounded-full hover:bg-gray-200">
        <div class="w-8 h-8 rounded-full flex items-center justify-center ">
          <span class="text-md font-bold text-blue-600">U</span>
        </div>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56 dark:bg-zinc-700 dark:text-white  dark:border-gray-400 rounded">
      <DropdownMenuItem @click="profileOpen" class="hover:bg-gray-200 dark:hover:bg-zinc-600">
        <User class="mr-2 h-4 w-4" />
        <span>Mi Cuenta</span>
      </DropdownMenuItem>

      <DropdownMenuItem @click="settingsOpen" class="hover:bg-gray-200 dark:hover:bg-zinc-600">
        <Settings class="mr-2 h-4 w-4" />
        <span>Configuración</span>
      </DropdownMenuItem>

      <DropdownMenuItem @click="helpOpen" class="hover:bg-gray-200 dark:hover:bg-zinc-600">
        <HelpCircle class="mr-2 h-4 w-4" />
        <span>Ayuda</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator class="bg-gray-200 border dark:border-gray-400" />

      <DropdownMenuItem @click="showSesionModal = true"
        class="text-red-500 focus:text-red-500 hover:bg-gray-200 hover:text-red-700 dark:hover:bg-zinc-600">
        <LogOut class="mr-2 h-4 w-4" />
        <span>Cerrar Sesión</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <Dialog v-bind:open="showSesionModal" @update:open="(value) => showSesionModal = value">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Cerrar Sesión
        </DialogTitle>
        <DialogDescription>
          ¿Estás seguro que desea cerrar sesión?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="flex justify-end space-x-3">
        <DialogClose>
          <Button variant="ghost">
            Cancel
          </Button>
        </DialogClose>
        <Button @click="out" variant="destructive" type="button">
          Aceptar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { navigate } from 'astro:transitions/client';
import {
  User,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-vue-next'

import { ref } from "vue";
import { signOut } from "auth-astro/client"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const showSesionModal = ref(false);
const openMenu = ref(false)

const out = async () => {
  await signOut()
}

const handleSesion = () => {
  showSesionModal.value = false;
};

const profileOpen = () => {
  navigate('/profile')
}
const helpOpen = () => {
  navigate('/help')
}
const settingsOpen = () => {
  navigate('/settings')
}

</script>