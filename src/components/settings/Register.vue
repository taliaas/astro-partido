<template>
  <div class="container mx-auto p-4 space-y-6">
    <div class="">
      <h2 class="text-2xl font-semibold">Trazas del Sistema</h2>
      <p class="text-gray-600 mt-1">
        Monitorea las actividades del sistema y acciones de usuarios en todos
        los módulos
      </p>
    </div>
    <!-- Tarjeta principal -->
    <div class="bg-white rounded-lg border shadow-md p-4">
      <div class="p-6 space-y-3">
        <!-- Tabla de trazas -->
        <div class="flex gap-2">
          <Label class="p-2 bg-gray-100 rounded-md text-muted-foreground">
            <Filter class="size-4" />Filtros</Label
          >
          <!-- <Input type="search" placeholder="Buscar ..."></Input> -->

          <!-- Modules -->
          <Select
            :default-value="searchParams.module ?? 'all'"
            @update:model-value="handleFilterByValue('module', $event)"
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los módulos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los módulos</SelectItem>
              <SelectItem v-for="(item, index) in modules" :value="item.name">
                <span v-if="item === null"> - </span>
                {{ item.name }}</SelectItem
              >
            </SelectContent>
          </Select>

          <!-- Actions -->
          <Select
            :default-value="searchParams.action ?? 'all'"
            @update:model-value="handleFilterByValue('action', $event)"
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos las acciones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las acciones</SelectItem>
              <SelectItem v-for="(item, index) in Action" :value="item">
                <span v-if="item === null"> - </span>
                {{ item }}</SelectItem
              >
            </SelectContent>
          </Select>
          <!-- Users -->
          <Select
            :default-value="searchParams.user ?? 'all'"
            @update:model-value="handleFilterByValue('user', $event)"
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los usuarios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los usuarios</SelectItem>
              <SelectItem v-for="(user, index) in users" :value="user.id + ''">
                <span v-if="user === null"> - </span>
                {{ user?.name }}
              </SelectItem>
            </SelectContent>
          </Select>
          <!-- <Input type="date" class="max-w-36"></Input> -->
        </div>

        <table class="w-full caption-bottom text-md border rounded">
          <thead class="">
            <tr
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <th
                class="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
              >
                Módulo
              </th>
              <th
                class="text-left align-middle font-medium text-muted-foreground"
              >
                Acción
              </th>
              <th
                class="text-center align-middle font-medium text-muted-foreground"
              >
                Usuario
              </th>
              <th
                class="text-center align-middle font-medium text-muted-foreground"
              >
                Fecha
              </th>
              <th
                class="text-center align-middle font-medium text-muted-foreground"
              >
                Hora
              </th>
              <th
                class="text-center align-middle font-medium text-muted-foreground"
              >
                Detalles
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="trazas.data?.length === 0">
              <td colspan="6" class="text-center py-6 text-muted-foreground">
                No se encontraron trazas
              </td>
            </tr>
            <tr
              v-for="traza in trazas.data"
              :key="traza.id"
              class="border rounded"
            >
              <td class="px-4 font-medium">{{ traza.module }}</td>
              <td>{{ traza.action }}</td>
              <td class="text-center">
                {{ traza.user?.name || "No especificado" }}
              </td>
              <td class="text-center">
                {{ format(traza.createdAt, "yyyy-MM-dd") }}
              </td>
              <td class="text-center">
                {{ format(traza.createdAt, "HH:mm:ss") }}
              </td>

              <td class="text-muted-foreground text-center py-2">
                <Button
                  variant="ghost"
                  @click="abrirDetalle(traza)"
                  class="text-md hover:text-blue-600 rounded-md transition-colors"
                >
                  <Eye class="w-4 h-4" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-between">
          <p class="text-muted-foreground">
            Mostrando: {{ trazas.data.length === 0 ? 0 : trazas.page }} de
            {{ trazas.total }} página(s)
          </p>

          <div class="space-x-2">
            <Button
              variant="outline"
              class="p-2 border rounded-md"
              @click="previusPage"
              :disabled="currentPage <= 1"
              :class="{ 'bg-muted': currentPage === 1 }"
            >
              <ArrowLeft />
            </Button>
            <Button
              variant="outline"
              class="p-2 border rounded-md"
              @click="nextPage"
              :disabled="currentPage >= trazas.total"
              :class="{ 'bg-muted': currentPage >= trazas.total }"
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles -->
    <div
      v-if="modalAbierto"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="cerrarModal"
    >
      <div
        class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6 border-b">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold">Detalles de la Traza</h3>
              <p class="text-md text-gray-600 mt-1">
                Información completa para la traza seleccionada
              </p>
            </div>
            <button
              @click="cerrarModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XIcon class="h-6 w-6" />
            </button>
          </div>
        </div>

        <div v-if="trazaSeleccionada" class="p-6 space-y-6">
          <!-- Acción y Módulo -->
          <div class="flex gap-4">
            <div class="space-y-1">
              <div class="text-md font-medium text-gray-500">Acción</div>
              <span
                class="inline-flex items-center py-0.5 rounded-full text-md font-medium"
              >
                {{ trazaSeleccionada.action }}
              </span>
            </div>
            <div class="space-y-1 text-right">
              <div class="text-md font-medium text-gray-500">Módulo</div>
              <div class="font-medium text-gray-900">
                {{ trazaSeleccionada.module }}
              </div>
            </div>
            <!-- ID de Entidad (si existe) -->
            <div v-if="trazaSeleccionada.entityId" class="space-y-1 text-right">
              <div class="text-md font-medium text-gray-500">
                ID de {{ trazaSeleccionada.module }}
              </div>
              <div class="font-medium text-gray-900 text-left">
                {{ trazaSeleccionada.entityId }}
              </div>
            </div>
          </div>

          <!-- Información del Usuario -->
          <div class="space-y-3">
            <div
              class="text-md font-medium text-gray-500 flex items-center gap-2"
            >
              <UserIcon class="h-4 w-4" />
              Información del Usuario
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center space-x-4">
                <div
                  class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <UserIcon class="h-6 w-6 text-gray-500" />
                </div>
                <div class="space-y-1">
                  <div class="font-medium text-gray-900">
                    {{ trazaSeleccionada.user.name }}
                  </div>
                  <div class="text-md text-gray-500">
                    {{ trazaSeleccionada.user.email }}
                  </div>
                  <div class="text-xs text-gray-400">
                    Estado: {{ trazaSeleccionada.user.status }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fecha y Hora -->
          <div class="space-y-3">
            <div
              class="text-md font-medium text-gray-500 flex items-center gap-2"
            >
              <CalendarIcon class="h-4 w-4" />
              Fecha y Hora
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="font-mono text-md text-gray-900">
                {{ format(trazaSeleccionada.createdAt, "yyyy-MM-dd HH:mm:ss") }}
              </div>
            </div>
          </div>

          <!-- Metadatos Adicionales -->
          <div class="space-y-3">
            <div
              class="text-md font-medium text-gray-500 flex items-center gap-2"
            >
              <DatabaseIcon class="h-4 w-4" />
              Metadatos de la Traza
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4 text-md">
                <div>
                  <div class="font-medium text-gray-500">ID de Traza</div>
                  <div class="font-mono text-gray-900">
                    {{ trazaSeleccionada.id }}
                  </div>
                </div>
                <div>
                  <div class="font-medium text-gray-500">Estado</div>
                  <div class="text-green-600">Completado</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Botón de cerrar -->
          <div class="flex justify-end pt-4">
            <button
              @click="cerrarModal"
              class="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label/Label.vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/interface/Militante";
import { useUrlSearchParams } from "@vueuse/core";
import { navigate } from "astro:transitions/client";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  DatabaseIcon,
  Eye,
  Filter,
  UserIcon,
  XIcon,
} from "lucide-vue-next";
import { ref, watch } from "vue";

const Action = ["CREATE", "UPDATE", "DELETE", "LOGIN"] as const;
export interface Logs {
  id: number;
  action: any;
  module: string;
  createdAt: Date;
  entityId?: string;
  user: User;
  expiresAt: Date | null;
}

const { trazas, modules, users } = defineProps<{
  trazas: { data: Logs[]; page: number; total: number; limit: number };
  modules: { id: string; name: string }[];
  users: User[];
}>();

const trazaSeleccionada = ref({
  id: 0,
  action: Action[0],
  module: "",
  createdAt: "",
  user: {
    status: "",
    name: "",
    email: "",
  },
  entityId: "",
  expiresAt: "",
});

const modalAbierto = ref(false);
const searchParams = useUrlSearchParams();
const currentPage = ref(trazas?.page);

const handleFilterByValue = (filter: string, value: any) => {
  const query = new URLSearchParams(searchParams as any);
  if (value && value !== "all") {
    query.set(filter, value);
  } else {
    query.delete(filter);
  }
  navigate("?" + query.toString());
};

// Mantener currentPage sincronizado con trazas.page
watch(
  () => trazas.page,
  (newPage) => {
    currentPage.value = newPage;
  },
);

// Función para abrir el modal de detalles
const abrirDetalle = (traza: any) => {
  trazaSeleccionada.value = traza;
  modalAbierto.value = true;
};

const previusPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    const limit = 10;
    navigate(`register?page=${currentPage.value}&limit=${limit}`);
  }
};

const nextPage = () => {
  if (trazas.total > currentPage.value) {
    currentPage.value++;
    const limit = 10;
    navigate(`register?page=${currentPage.value}&limit=${limit}`);
  }
};

// Función para cerrar el modal
const cerrarModal = () => {
  modalAbierto.value = false;
  trazaSeleccionada.value = {
    id: 0,
    action: Action[0],
    module: "",
    createdAt: "",
    user: {
      status: "",
      name: "",
      email: "",
    },
    entityId: "",
    expiresAt: "",
  };
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Animaciones para el modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
