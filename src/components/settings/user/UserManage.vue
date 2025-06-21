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
          <Button @click="openCreate"> Añadir</Button>
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
                <DropdownMenu>
                  <DropdownMenuTrigger class="focus:outline-none">
                    <Button variant="ghost" size="icon" class="rounded-full">
                      <MoreVerticalIcon class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="openEdit(user)">
                      <Pencil class="h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
          <DialogTitle class="text-xl">
            {{ isEdit ? "Editar Usuario" : "Crear Nuevo Usuario" }}
          </DialogTitle>
          <DialogDescription>
            Complete los datos del usuario para
            {{ isEdit ? "actualizarlo." : "crear una nueva cuenta." }}
          </DialogDescription>
        </DialogHeader>
        <CreateUserForm
          :user="isEdit ? selectedUser : null"
          :onLoadingChange="(value) => (loading = value)"
        />
        <DialogFooter>
          <DialogClose>
            <Button type="button" variant="outline"> Cancelar</Button>
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
import { navigate } from "astro:transitions/client";
import { MoreVerticalIcon, Pencil, SearchIcon } from "lucide-vue-next";
import { computed, ref } from "vue";
import DropdownMenuTrigger from "../../ui/dropdown-menu/DropdownMenuTrigger.vue";
import DropdownMenuContent from "../../ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuItem from "../../ui/dropdown-menu/DropdownMenuItem.vue";
import DropdownMenu from "../../ui/dropdown-menu/DropdownMenu.vue";

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
const selectedUser = ref<User | null>(null);
const showSesionModal = ref(false);
const selectCore = ref("");
const createUser = ref(false);
const loading = ref(false);
const isEdit = ref(false);

// Filtrar usuarios basado en la búsqueda
const filteredUsers = computed(() => {
  if (!Array.isArray(users.data)) return [];
  return users.data.filter((user) => {
    const matchesCore =
      selectCore.value === "" || user.core?.id === selectCore.value;
    const matchesSearch =
      !searchQuery.value ||
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesCore && matchesSearch;
  });
});

const openEdit = (user: any) => {
  isEdit.value = true
  createUser.value = true;
  selectedUser.value = user;

};

const openCreate = () => {
  createUser.value = true
  isEdit.value = false
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
