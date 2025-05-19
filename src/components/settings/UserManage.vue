<template>
  <div class="rounded-lg border bg-card shadow-sm">
    <div class="p-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4"
      >
        <div class="relative">
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
            @click="createUser"
            class="rounded-md bg-button px-3 py-2 text-sm font-medium text-primary-foreground flex items-center gap-1"
          >
            <span>Añadir Usuario</span>
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
              <td class="p-4">{{ user.role.name }}</td>
              <td class="p-4">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    user.status === 'Activo'
                      ? 'bg-green-100 text-green-800'
                      : user.status === 'Inactivo'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-amber-100 text-amber-800',
                  ]"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="p-4">{{ user.lastLogin }}</td>
              <td class="p-4">
                <div class="relative">
                  <button
                    @click="toggleDropdown(user.id)"
                    class="rounded-md p-1 hover:bg-muted"
                  ><MoreVerticalIcon class="h-4 w-4"/></button>
                  <div
                    v-if="activeDropdown === user.id"
                    class="absolute right-0 z-10 mt-2 w-56 rounded-md border bg-background shadow-lg"
                  >
                    <div
                      class="py-2 px-3 text-sm font-medium text-muted-foreground border-b bg-muted"
                    >
                      Acciones
                    </div>
                    <div class="py-1">
                      <a href="#" class="block px-4 py-2 text-sm hover:bg-muted"
                        >Editar usuario</a
                      >
                      <a href="#" class="block px-4 py-2 text-sm hover:bg-muted"
                        >Gestionar permisos</a
                      >
                      <div class="border-t my-1"></div>
                      <a
                        href="#"
                        class="block px-4 py-2 text-sm text-red-600 hover:bg-muted"
                        >Desactivar usuario</a
                      >
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
          Mostrando {{ filteredUsers.length }} de {{ users.length }} usuarios
        </div>
        <div class="flex items-center gap-2">
          <button class="rounded-md border px-3 py-1 text-sm" disabled>
            Anterior
          </button>
          <button class="rounded-md border px-3 py-1 text-sm">Siguiente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {MoreVerticalIcon, SearchIcon} from "lucide-vue-next";
import { Input } from "@/components/ui/input";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  core?: any;
}

const { users } = defineProps<{ users: User[] }>();
const searchQuery = ref("");
const activeDropdown = ref(null);

// Filtrar usuarios basado en la búsqueda
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users;
  return users.filter(
    (user) =>
      (selectCore.value && user.core?.name !== selectCore.value) ||
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const nucleos = computed(() => {
  const userList = Array.isArray(users) ? users : [];
  return [...new Set(userList.map((item) => item.core?.name).filter(Boolean))];
});

const selectCore = ref(nucleos.value[0]);

// Funciones para manejar dropdowns
const toggleDropdown = (id) => {
  activeDropdown.value = activeDropdown.value === id ? null : id;
};

async function createUser() {}
</script>
