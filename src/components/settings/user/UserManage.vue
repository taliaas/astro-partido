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
          <SearchIcon
            class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          />
          <Input
            id="search"
            v-model:model-value="searchParams.name as string"
            placeholder="Buscar usuarios por nombre..."
            @update:model-value="search"
            class="pl-9"
          />
        </div>
        <div class="flex items-center gap-2">
          <Select
            :default-value="searchParams.role ?? 'all'"
            @update:model-value="handleFilterByValue('role', $event)"
          >
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Seleccione el rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem
                  v-for="(role, index) in roleEnum"
                  :key="index"
                  :value="role"
                  >{{ role }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            :default-value="searchParams.core ?? 'all'"
            @update:model-value="handleFilterByValue('core', $event)"
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el núcleo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos los núcleos</SelectItem>
                <SelectItem
                  v-for="nucleo in cores"
                  :key="nucleo.name"
                  :value="nucleo.name"
                  >{{ nucleo.name }}</SelectItem
                >
              </SelectGroup>
            </SelectContent>
          </Select>
          <!-- Status -->
          <Select
            :default-value="searchParams.status ?? 'all'"
            @update:model-value="handleFilterByValue('status', $event)"
          >
            <SelectTrigger class="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem
                  v-for="status in statuses"
                  :key="status.name"
                  :value="status.value"
                  >{{ status.name }}</SelectItem
                >
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button @click="openCreate">
            <UserPlus class="size-4" /> Añadir</Button
          >
        </div>
      </div>
      <!--Tabla -->
      <div class="rounded-md border">
        <table class="w-full caption-bottom text-md">
          <thead class="[&_tr]:border-b">
            <tr
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <th
                class="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
              >
                Nombre
              </th>
              <th
                class="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
              >
                Email
              </th>
              <th
                class="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
              >
                Núcleo
              </th>
              <th
                class="h-10 px-4 text-center align-middle font-medium text-muted-foreground"
              >
                Rol
              </th>
              <th
                class="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
              >
                Estado
              </th>
              <th
                class="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
              >
                Último Acceso
              </th>
              <th class="h-10 px-4 text-center w-[50px] text-muted-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="users.data?.length === 0">
              <td colspan="6" class="text-center py-6 text-muted-foreground">
                No se encontraron usuarios que coincidan con su criterio de
                búsqueda
              </td>
            </tr>

            <tr
              v-for="user in users?.data"
              :key="user.id"
              class="border-b transition-colors hover:bg-muted/50"
            >
              <td class="p-4 text-md">{{ user.name }}</td>
              <td class="p-4 text-md">{{ user.email }}</td>
              <td class="p-4 text-md">{{ user.core.name }}</td>
              <td class="p-4 text-md text-center">{{ user.role?.name }}</td>
              <td class="p-4 text-md">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    user.status === 'ACTIVO'
                      ? 'bg-green-100 text-green-800'
                      : user.status === 'INACTIVO'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800',
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
                    <DropdownMenuItem
                      v-if="user.status === UserStatus.Inactivo"
                      @click="openModal(user)"
                    >
                      <UserCheck class="h-4 w-4" /> Activar </DropdownMenuItem
                    ><DropdownMenuItem @click="openEdit(user)">
                      <UserPen class="h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator
                      v-if="user.status === UserStatus.Activo"
                      class="bg-gray-200 border dark:border-gray-400"
                    />
                    <DropdownMenuItem
                      v-if="user.status === UserStatus.Activo"
                      @click="openModal(user)"
                      variant="destructive"
                    >
                      <UserX class="h-4 w-4 text-destructive-foreground" />
                      Desactivar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between mt-4">
        <div class="text-md text-muted-foreground">
          Mostrando {{ users.page }} de {{ users.total }} página(s)
        </div>
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            :disabled="currentPage <= 1"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage <= 1 }"
            @click="goToPreviousPage"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            :disabled="currentPage >= totalPages"
            :class="{
              'opacity-50 cursor-not-allowed': currentPage >= totalPages,
            }"
            @click="goToNextPage"
          >
            <ChevronRight />
          </Button>
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
            variant="default"
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog :open="open" @update:open="open = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle
            >¿Estás seguro que desea
            {{ currentStatus ? "desactivar" : "activar" }} este
            usuario?</AlertDialogTitle
          >
          <AlertDialogDescription>
            <p v-if="currentStatus">
              El usuario seleccionado no podrá acceder al sistema a menos que
              esta acción sea revertida.
            </p>
            <p v-else>Esta acción le permitirá al usuario acceder al sistema</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction @click="handleAction">Aceptar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import CreateUserForm from "@/components/settings/user/CreateUserForm.vue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Input from "@/components/ui/input/Input.vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectGroup from "@/components/ui/select/SelectGroup.vue";
import { roleEnum } from "@/enum/roleEnum";
import { UserStatus } from "@/enum/Status";
import type { User } from "@/interface/Militante";
import { useDebounceFn, useUrlSearchParams } from "@vueuse/core";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import {
  ChevronLeft,
  ChevronRight,
  MoreVerticalIcon,
  SearchIcon,
  UserCheck,
  UserPen,
  UserPlus,
  UserX,
} from "lucide-vue-next";
import { ref } from "vue";

const { users, cores } = defineProps<{
  users: { data: User[]; total: number; page: number };
  cores: any;
}>();

const statuses = [
  { name: "Activo", value: UserStatus.Activo },
  { name: "Inactivo", value: UserStatus.Inactivo },
  { name: "Pendiente", value: UserStatus.Pendiente },
];

const totalPages = ref(users.total);
const currentPage = ref(users.page);
const searchParams = useUrlSearchParams("history", { removeFalsyValues: true });
const selectedUser = ref<User | null>(null);
const open = ref(false);
const createUser = ref(false);
const loading = ref(false);
const isEdit = ref(false);
const currentStatus = ref();

const search = useDebounceFn(async () => {
  await navigate("");
  setTimeout(() => {
    const e = document.querySelector<HTMLInputElement>("#search");
    if (e) {
      e.focus();
    }
  }, 500);
}, 1000);

const handleFilterByValue = (filter: string, value: any) => {
  const query = new URLSearchParams(searchParams as any);
  if (value && value !== "all") {
    query.set(filter, value);
  } else {
    query.delete(filter);
  }
  navigate("?" + query.toString());
};

const openEdit = (user: any) => {
  isEdit.value = true;
  createUser.value = true;
  selectedUser.value = user;
};

const openModal = (user: any) => {
  open.value = true;
  selectedUser.value = user;
  if (user.status === UserStatus.Activo) currentStatus.value = true;
  else if (user.status === UserStatus.Inactivo) currentStatus.value = false;
};

const openCreate = () => {
  createUser.value = true;
  isEdit.value = false;
};

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

async function handleAction() {
  if (currentStatus.value)
    await actions.user.deactiveUser(String(selectedUser.value?.id) ?? "");
  else
    await actions.user.activeUser({ id: String(selectedUser.value?.id) ?? "" });
  navigate("");
}
</script>
