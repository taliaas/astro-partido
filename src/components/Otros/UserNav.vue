<template>
  <!-- User Dropdown -->
  <DropdownMenu>
    <DropdownMenuTrigger class="focus:outline-none">
      <button
        @click="!openMenu"
        class="flex items-center space-x-2 border-2 shadow-md bg-gray-50 rounded-full hover:bg-gray-200"
      >
        <div class="w-8 h-8 rounded-full flex items-center justify-center">
          <span class="text-md font-bold text-blue-600">{{ getInitial }}</span>
        </div>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-56 dark:bg-zinc-700 dark:text-white dark:border-gray-400 rounded"
    >
      <DropdownMenuItem
        @click="profileOpen"
        class="hover:bg-gray-200 dark:hover:bg-zinc-600"
      >
        <User class="mr-2 h-4 w-4" />
        <span>Mi Cuenta</span>
      </DropdownMenuItem>

      <DropdownMenuItem
        @click="settingsOpen"
        v-if="session?.role.name === roleEnum.Admin"
        class="hover:bg-gray-200 dark:hover:bg-zinc-600"
      >
        <Settings class="mr-2 h-4 w-4" />
        <span>Configuración</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator class="bg-gray-200 border dark:border-gray-400" />

      <DropdownMenuItem
        @click="showSesionModal = true"
        class="text-red-500 focus:text-red-500 hover:bg-gray-200 hover:text-red-700 dark:hover:bg-zinc-600"
      >
        <LogOut class="mr-2 h-4 w-4 text-red-500" />
        <span>Cerrar Sesión</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <AlertDialog
    v-bind:open="showSesionModal"
    @update:open="(value) => (showSesionModal = value)"
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle> Cerrar Sesión </AlertDialogTitle>
        <AlertDialogDescription>
          ¿Estás seguro que desea cerrar sesión?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter class="flex justify-end space-x-3">
        <AlertDialogCancel> Cancelar </AlertDialogCancel>
        <Button @click="out" variant="destructive">Aceptar</Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { navigate } from "astro:transitions/client";
import { User, Settings, HelpCircle, LogOut } from "lucide-vue-next";
import { ref } from "vue";
import { signOut } from "auth-astro/client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "@/utils/auth-client";
import { roleEnum } from "@/enum/roleEnum";
import { computed } from "vue";

const showSesionModal = ref(false);
const openMenu = ref(false);
const session = useSession();

const out = async () => {
  await signOut();
};

const handleSesion = () => {
  showSesionModal.value = false;
};

const getInitial = computed(() => {
  console.log(session.value);
  
  const initialFirstname = session.value?.name?.at(0) ?? "U";
  return initialFirstname;
});

const profileOpen = () => {
  navigate("/profile");
};
const helpOpen = () => {
  navigate("/help");
};
const settingsOpen = () => {
  navigate("/settings");
};
</script>
