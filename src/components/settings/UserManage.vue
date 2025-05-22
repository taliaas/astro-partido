<template>
  <div class="rounded-lg border bg-card shadow-sm">
    <div class="p-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4"
      >
        <div class="relative flex-1">
          <div
            class="flex items-center gap-2 border px-3 py-2 rounded-md w-full"
          >
            <SearchIcon class="h-4 w-4 text-gray-400" />
            <input
              v-model="searchQuery"
              class="w-full flex-1 border-0 outline-none bg-transparent placeholder:text-gray-400"
              placeholder="Buscar usuarios..."
              @keyup.enter="search"
              type="search"
            />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <select
            v-model="selectCore"
            class="rounded-md border px-3 py-2 mx-1.5 text-sm w-full"
          >
            <option v-for="nucleo in nucleos" :key="nucleo" :value="nucleo">
              {{ nucleo }}
            </option>
          </select>
          <button
            @click="createUser = true"
            class="rounded-md bg-button px-3 py-2 text-sm font-medium text-primary-foreground flex items-center gap-1"
          >
            <span>Añadir</span>
          </button>
        </div>
      </div>

      <!--Tabla -->
      <div class="rounded-md border">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-muted/50">
              <th class="h-10 px-4 text-left">Nombre</th>
              <th class="h-10 px-4 text-left">Email</th>
              <th class="h-10 px-4 text-left">Rol</th>
              <th class="h-10 px-4 text-left">Estado</th>
              <th class="h-10 px-4 text-left">Último Acceso</th>
              <th class="h-10 px-4 text-left w-[50px]"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="text-center py-6 text-muted-foreground">
                No se encontraron usuarios que coincidan con su criterio de
                búsqueda
              </td>
            </tr>
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="border-b transition-colors hover:bg-muted/50"
            >
              <td class="p-4">{{ user.name }}</td>
              <td class="p-4">{{ user.email }}</td>
              <td class="p-4">{{ user.role?.name }}</td>
              <td class="p-4">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    user.status === 'ACTIVO'
                      ? 'bg-green-100 text-green-800'
                      : user.status === 'INACTIVO'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-amber-100 text-amber-800',
                  ]"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="p-4 text-center">
                <span v-if="user.lastLogin === null"> Nunca </span>
                <span v-else>{{ user.lastLogin }}</span>
              </td>
              <td class="p-4">
                <div class="relative">
                  <button
                    @click="toggleDropdown(user)"
                    class="rounded-md p-1 hover:bg-muted"
                  >
                    <MoreVerticalIcon class="h-4 w-4" />
                  </button>
                  <div
                    v-if="activeDropdown?.id === user.id"
                    class="absolute right-0 z-10 mt-2 w-40 rounded-md border bg-background shadow-lg"
                  >
                    <div
                      class="py-2 px-3 text-sm font-medium text-muted-foreground border-b bg-muted"
                    >
                      Acciones
                    </div>
                    <div class="py-1">
                      <button class="px-4 py-2 text-sm hover:bg-muted w-full">
                        Editar usuario
                      </button>
                      <div class="border-t my-1"></div>
                      <button
                        @click="showSesionModal = true"
                        class="block px-4 py-2 text-sm text-red-600 hover:bg-muted w-full"
                      >
                        Desactivar usuario
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between mt-4">
        <div class="text-xs text-muted-foreground">
          Mostrando {{ filteredUsers.length }} de {{ users.data.length }} usuarios
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-md border px-3 py-1 text-sm"
            @click="currentPage--"
          >
            Anterior
          </button>
          <button
            class="rounded-md border px-3 py-1 text-sm"
            @click="currentPage++"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
    <!-- Create Dialog -->
    <Dialog :open="createUser" @update:open="createUser = $event">
      <DialogContent class="font-medium">
        <DialogHeader>
          <DialogTitle class="text-xl">Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Complete los datos del usuario para crear una nueva cuenta.
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label class="text-right">Nombre</Label>
            <Input
              id="name"
              v-model="user.name"
              class="col-span-3"
              placeholder="Nombre"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label class="text-right"> Email </Label>
            <Input
              id="email"
              type="email"
              v-model="user.email"
              class="col-span-3"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label class="text-right"> Contraseña </Label>
            <Input
              id="password"
              type="password"
              v-model="user.password"
              class="col-span-3"
              placeholder="********"
              maxlength="8"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label class="text-right"> Rol </Label>
            <Select v-model="user.role">
              <SelectTrigger class="col-span-3">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="role in roles" :value="role.name">{{
                  role.name
                }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="reset" variant="outline" @click="createUser = false">
            Cancelar
          </Button>
          <Button
            @click="handleUser"
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <div
      v-if="showSesionModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white rounded p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Desactivar usuario
        </h3>
        <form @submit.prevent="handleDesactivation" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >¿Estás seguro que desea desactivar al usuario
              {{ activeDropdown?.name }}?</label
            >
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="submit"
              class="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              class="px-4 py-2 mr-4 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
              @click="desactivation"
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, effect, reactive, ref } from "vue";
import { MoreVerticalIcon, SearchIcon } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { actions } from "astro:actions";
import type { Role } from "@/interface/Roles.ts";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  core?: any;
}
const currentPage = ref("1");
const { users, roles } = defineProps<{ users: User[]; roles: Role[] }>();
const searchQuery = ref("");
const activeDropdown = ref(null);
const showSesionModal = ref(false);
const createUser = ref(false);
const user = reactive({
  name: "",
  email: "",
  password: "",
  role: "",
});
const notification = reactive({
  show: false,
  message: "",
  type: "success",
});

const showNotification = (message: string, type = "success") => {
  notification.show = true;
  notification.message = message;
  notification.type = type;
  setTimeout(() => {
    notification.show = false;
  }, 3000);
};
// Filtrar usuarios basado en la búsqueda
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users;
  return users.data?.filter(
    (user) =>
      (selectCore.value && user.core?.name !== selectCore.value) ||
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const nucleos = computed(() => {
  const userList = Array.isArray(users.data) ? users.data : [];
  return [...new Set(userList.map((item) => item.core?.name).filter(Boolean))];
});

const selectCore = ref(nucleos.value[0]);

// Funciones para manejar dropdowns
const toggleDropdown = (user) => {
  activeDropdown.value = activeDropdown.value?.id === user.id ? null : user;
};

async function handleUser() {
  try {
    actions.auth.register(user);
    showNotification("Se creó el nuevo usuario");
    window.location.href = "/settings";
  } catch (e) {
    console.log(e);
    showNotification("Hubo problemas al crear un usuario");
    throw new Error(e);
  }
}

async function handleDesactivation() {
  showSesionModal.value = false;
}

async function desactivation() {
  await actions.user.deactiveUser(activeDropdown.value);
}

effect(() => {});
</script>
