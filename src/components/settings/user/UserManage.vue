<template>
  <div class="pb-4">
    <h2 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
    <p class="text-gray-600">Administra los usuarios del sistema</p>
  </div>
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
          <option value="">Todos los núcleos</option>
            <option v-for="nucleo in cores" :key="nucleo.id" :value="nucleo.id">
              {{ nucleo.name }}
            </option>
          </select>
          <Button @click="createUser = true"> Añadir </Button>
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
              <th class="h-10 px-4 text-left">Núcleo</th>
              <th class="h-10 px-4 text-left">Estado</th>
              <th class="h-10 px-4 text-left">Último Acceso</th>
              <th class="h-10 px-4 text-center w-[50px]">Acciones</th>
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
              <td class="p-4">{{ user.core.name }}</td>
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
              <td class="p-4">
                <span v-if="user.lastLogin === null"> Nunca </span>
                <span v-else>{{ user.lastLogin }}</span>
              </td>
              <td class="p-4 text-center">
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
          Mostrando {{ filteredUsers.length }} de
          {{ users.data?.length }} usuarios
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-md border px-3 py-1"
            :disabled="currentPage === 1"
            :class="{ 'bg-muted': currentPage === 1 }"
            @click="goToPreviousPage"
          >
            Anterior
          </button>
          <button
            class="rounded-md border px-3 py-1"
            :disabled="currentPage >= hasNextPage"
            :class="{ 'bg-muted': currentPage >= hasNextPage }"
            @click="goToNextPage"
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
        <CreateUserForm
          :onLoadingChange="(value) => (loading = value)"
        />
        <DialogFooter>
          <DialogClose>
            <Button type="button" variant="outline"> Cancelar </Button>
          </DialogClose>
          <Button
            type="submit"
            :loading
            :disabled="loading"
            form="create-user"
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
import CreateUserForm from "@/components/settings/user/CreateUserForm.vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { MoreVerticalIcon, SearchIcon } from "lucide-vue-next";
import { computed, ref } from "vue";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  core?: any;
}

const { users, page, cores } = defineProps<{
  users: { data: User[]; total: number; page: string };
  page: number;
  cores: any;
}>();

const hasNextPage = ref(users.total);
const currentPage = ref(page);
const searchQuery = ref("");
const activeDropdown = ref<User | null>(null);
const showSesionModal = ref(false);
const selectCore = ref('');
const createUser = ref(false);
const loading = ref(false);

// Filtrar usuarios basado en la búsqueda
const filteredUsers = computed(() => {
  if (!Array.isArray(users.data)) return [];
  return users.data.filter((user) => {
    const matchesCore = 
    selectCore.value === '' || user.core?.id === selectCore.value
    const matchesSearch =
      !searchQuery.value ||
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesCore && matchesSearch;
  });
});

// Funciones para manejar dropdowns
const toggleDropdown = (user: User) => {
  activeDropdown.value = activeDropdown.value?.id === user.id ? null : user;
};

async function handleDesactivation() {
  showSesionModal.value = false;
}

async function desactivation() {
  await actions.user.deactiveUser(+activeDropdown.value?.id!);
}

function goToNextPage() {
  if (users.total > currentPage.value) {
    currentPage.value++;
    navigate(`/settings?page=${currentPage.value}`);
  }
}

function goToPreviousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    navigate(`/settings?page=${currentPage.value}`);
  }
}

</script>
