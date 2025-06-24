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
    <div class="bg-white rounded-lg border shadow-md">
      <div class="p-6">
        <!-- Tabla de trazas -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b text-lg">
                <th class="text-left py-3 px-4 font-bold text-gray-900">
                  Módulo
                </th>
                <th class="text-left py-3 px-4 font-bold text-gray-900">
                  Acción
                </th>
                <th class="text-left py-3 px-4 font-bold text-gray-900">
                  Usuario
                </th>
                <th class="text-left py-3 px-4 font-bold text-gray-900">
                  Fecha
                </th>
                <th class="text-left py-3 px-4 font-bold text-gray-900">
                  Hora
                </th>
                <th class="text-center py-3 px-4 font-bold text-gray-900 w-24">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="traza in trazas.logs"
                :key="traza.id"
                class="border-b"
              >
                <td class="py-3 px-4 font-medium text-gray-900">
                  {{ traza.module }}
                </td>
                <td class="py-3 px-4">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ traza.action }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center space-x-3">
                    <div>
                      <div class="font-medium text-gray-900">
                        {{ traza.user?.name }}
                      </div>
                      <div class="text-md text-gray-500">
                        {{ traza.user?.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4 text-md text-gray-500">
                  {{ format(traza.createdAt, "yyyy-MM-dd") }}
                </td>
                <td class="py-3 px-4 text-md text-gray-500">
                  {{ format(traza.createdAt, "HH:mm:ss") }}
                </td>
                <td class="text-center py-3 px-4">
                  <button
                    @click="abrirDetalle(traza)"
                    class="text-md hover:text-blue-600 px-3 py-1 rounded-md transition-colors"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr v-if="trazas.logs.length === 0">
                <td colspan="6" class="text-center py-6 text-gray-500">
                  No se encontraron trazas
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="6" class="py-4 text-gray-500 text-md">
                  Mostrasndo: {{ trazas.page }} de
                  {{ trazas.lastPage }} página(s)
                </td>
                <td colspan="6" class="py-4 text-gray-500 text-md">
                  <div class="space-x-2">
                    <button class="p-2 border rounded-md" @click="previusPage">
                      <ArrowLeft class="w-4 h-4" />
                    </button>
                    <button class="p-2 border rounded-md" @click="nextPage">
                      <ArrowRight class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
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
          <div class="flex items-center justify-between">
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

          <!-- ID de Entidad (si existe) -->
          <div v-if="trazaSeleccionada.entityId" class="space-y-3">
            <div
              class="text-md font-medium text-gray-500 flex items-center gap-2"
            >
              <HashIcon class="h-4 w-4" />
              ID de Entidad
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="font-mono text-md text-gray-900">
                {{ trazaSeleccionada.entityId }}
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
import { navigate } from "astro:transitions/client";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  DatabaseIcon,
  Eye,
  HashIcon,
  UserIcon,
  XIcon,
} from "lucide-vue-next";
import { ref, watch } from "vue";

const Action = ["CREATE", "UPDATE", "DELETE", "LOGIN"] as const;

const { trazas } = defineProps<{
  trazas: any;
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
const currentPage = ref(trazas.page);

// Mantener currentPage sincronizado con trazas.page
watch(
  () => trazas.page,
  (newPage) => {
    currentPage.value = newPage;
  }
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
  if (trazas.lastPage > currentPage.value) {
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
