<script setup lang="ts">
import ExportMilitants from "@/components/settings/militantes/Export/exportMilitants.vue";
import Button from "@/components/ui/button/Button.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Input from "@/components/ui/input/Input.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Militant } from "@/interface/Militante";
import { useDebounceFn, useUrlSearchParams } from "@vueuse/core";
import { navigate } from "astro:transitions/client";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  MoreVerticalIcon,
  Search,
  UserPen,
  UserPlus,
} from "lucide-vue-next";
import { ref } from "vue";

const { militants, cores } = defineProps<{
  militants: { data: Militant[]; total: number; page: number };
  cores: any;
}>();

// UI state
const searchParams = useUrlSearchParams("history", { removeFalsyValues: true });
const selectCore = ref("");
const currentMember = ref<Militant | null>(null);
const totalPages = ref(militants.total);
const currentPage = ref(militants.page);
const statuses = ["Activo", "Inactivo"];

// Methods
const search = useDebounceFn(async () => {
  await navigate("");
  setTimeout(() => {
    const e = document.querySelector<HTMLInputElement>("#search");
    if (e) {
      e.focus();
    }
  }, 500);
}, 1000);

const getInitials = (member: any) => {
  return `${member.firstname.charAt(0)}${member.lastname.charAt(0)}`;
};

const handleFilterByValue = (filter: string, value: any) => {
  const query = new URLSearchParams(searchParams as any);
  if (value && value !== "all") {
    query.set(filter, value);
  } else {
    query.delete(filter);
  }
  navigate("?" + query.toString());
};

const handleAdd = () => {
  navigate(`/settings/militants/new`);
};

const handleEdit = (member: Militant) => {
  currentMember.value = member;
  navigate(`/settings/militants/${currentMember.value?.id}/edit`);
};

const handleView = (member: Militant) => {
  currentMember.value = member;
  navigate(`/settings/militants/${currentMember.value?.id}`);
};

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    navigate(
      `/settings/militants?core=${selectCore.value}&page=${currentPage.value}`
    );
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    navigate(
      `/settings/militants?core=${selectCore.value}&page=${currentPage.value}`
    );
  }
}
</script>
<template>
  <div class="pb-4">
    <h2 class="text-2xl font-bold text-gray-900">Militantes</h2>
    <p class="text-gray-600">Administra los militantes del sistema</p>
  </div>
  <div
    class="container mx-auto p-6 space-y-4 border bg-white rounded-md shadow-xl"
  >
    <div class="flex justify-between space-x-2">
      <div class="flex-1 relative w-full flex">
        <Search
          class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
        />
        <Input
          id="search"
          v-model:model-value="searchParams.name as string"
          @update:model-value="search"
          class="pl-9"
          placeholder="Buscar miembros..."
          autofocus
        />
      </div>
      <div class="flex gap-2">
        <Select
          :default-value="searchParams.core ?? 'all'"
          @update:model-value="handleFilterByValue('core', $event)"
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione el núcleo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all"> Todos los núcleos</SelectItem>
            </SelectGroup>
            <SelectItem
              v-for="nucleo in cores"
              :key="nucleo.name"
              :value="nucleo.name"
              >{{ nucleo.name }}</SelectItem
            >
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
                v-for="(status, index) in statuses"
                :key="index"
                :value="status"
                >{{ status }}</SelectItem
              >
            </SelectGroup>
          </SelectContent>
        </Select>
        <!-- Export Button -->
        <ExportMilitants :militants="militants.data" />

        <Button @click="handleAdd" class="cursor-pointer" variant="default">
          <UserPlus class="size-4" />
          Añadir
        </Button>
      </div>
    </div>
    <!-- Members Table -->
    <div class="rounded-md border">
      <table class="w-full caption-bottom text-md">
        <thead class="[&_tr]:border-b">
          <tr
            class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
          >
            <th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
            >
              Nombre
            </th>
            <th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
            >
              Correo
            </th>
            <th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
            >
              Núcleo
            </th>
            <th
              class="h-12 px-4 text-center align-middle font-medium text-muted-foreground"
            >
              Organización
            </th>
            <th
              class="h-12 px-4 text-center align-middle font-medium text-muted-foreground"
            >
              Estado
            </th>
            <th
              class="h-12 px-4 text-center align-middle font-medium text-muted-foreground"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="[&_tr:last-child]:border-0">
          <tr
            v-for="member in militants.data"
            :key="member.id"
            class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
          >
            <td class="p-4 align-middle">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
                >
                  <span class="text-md font-medium">{{
                    getInitials(member)
                  }}</span>
                </div>
                <div>
                  <div class="font-medium">
                    {{ member.firstname }} {{ member.lastname }}
                  </div>
                </div>
              </div>
            </td>
            <td class="p-4 align-middle">{{ member.email }}</td>
            <td class="p-4 align-middle">{{ member.core?.name }}</td>
            <td class="p-4 align-middle text-center">
              {{ member.organization }}
            </td>
            <td class="p-4 align-middle text-center capitalize">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  member.deactivation === null
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800',
                ]"
              >
                {{ member.deactivation === null ? "Activo" : "Inactivo" }}
              </span>
            </td>
            <td class="p-4 text-center align-middle cursor-context-menu">
              <DropdownMenu>
                <DropdownMenuTrigger class="focus:outline-none">
                  <Button variant="ghost" size="icon" class="rounded-full">
                    <MoreVerticalIcon class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="handleView(member)">
                    <Eye class="h-4 w-4" />
                    Detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="handleEdit(member)">
                    <UserPen class="h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="handleView(member)">
                    <Download class="h-4 w-4" />
                    Exportar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
          <tr v-if="militants.data.length === 0">
            <td colspan="6" class="p-4 text-center text-muted-foreground">
              No hay militantes.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between py-4">
      <div class="text-md text-muted-foreground">
        Mostrando <span class="font-medium">{{ currentPage }}</span> de
        <span class="font-medium">{{ totalPages }}</span> página(s)
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          :disabled="currentPage <= 1"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage <= 1 }"
          @click="previousPage"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          @click="nextPage"
          :disabled="currentPage >= totalPages"
          :class="{
            'opacity-50 cursor-not-allowed': currentPage >= totalPages,
          }"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  </div>
</template>
