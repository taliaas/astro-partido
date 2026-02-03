<template>
  <div class="p-2 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gestión de Traslados</h2>
        <p class="text-gray-600">
          Administra los traslados de miembros entre sucursales
        </p>
      </div>
      <div class="flex gap-2">
        <Button
          @click="exportarListado"
          variant="outline"
          class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:bg-gray-100"
        >
          <FileDown class="size-4" />
          Exportar Listado
        </Button>

        <Button
          @click="openAddModal"
          class="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:bg-primary/90"
        >
          <PlusIcon class="size-4" />
          Nuevo Traslado
        </Button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg border shadow-sm">
      <div class="flex gap-4 items-center flex-wrap">
        <div class="flex-1 min-w-[250px]">
          <Input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por nombre del miembro..."
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option v-for="est in Estado" :key="est" :value="est">
            {{ est }}
          </option>
        </select>
        <select
          v-model="selectNucleo"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los núcleos</option>
          <option v-for="nucleo in cores" :key="nucleo.id" :value="nucleo.id">
            {{ nucleo.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Lista de Traslados -->
    <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                No.
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                Militante
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                Origen
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                Destino
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                class="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(transfer, index) in filteredTransfers"
              :key="transfer.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ indexPage(Number(index)) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">
                  <template v-if="transfer.militante">
                    {{ transfer.militante.firstname }}
                    {{ transfer.militante.lastname }}
                  </template>
                  <template v-else>
                    {{ transfer.nombreMilitanteExterno }}
                  </template>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transfer.origen }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transfer.destino }}
              </td>
              <td
                class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900"
              >
                {{ formatDate(transfer.fecha) }}
              </td>
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span
                  class="px-3 py-1 text-xs font-medium rounded-full"
                  :class="getEstadoBadgeClass(transfer.estado)"
                >
                  {{ transfer.estado }}
                </span>
              </td>
              <td
                class="px-6 py-4 text-center whitespace-nowrap text-sm font-medium space-x-2"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger class="focus:outline-none">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="rounded-full hover:bg-gray-100"
                    >
                      <MoreVerticalIcon class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      @click="openDetails(transfer)"
                      class="cursor-pointer"
                    >
                      <Eye class="h-4 w-4 mr-2" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="openEdit(transfer)"
                      class="cursor-pointer"
                    >
                      <Pencil class="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="exportar(transfer.id)"
                      class="cursor-pointer"
                    >
                      <Download class="h-4 w-4 mr-2" />
                      Exportar PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
            <tr v-if="!filteredTransfers?.length">
              <td colspan="6" class="text-center py-12 text-gray-500">
                <p class="text-lg">No hay traslados registrados</p>
                <p class="text-sm mt-2">
                  Usa el botón "Nuevo Traslado" para agregar uno
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginación -->
        <div class="flex justify-between p-4 border-t">
          <div v-if="traslados?.total === 0"></div>
          <div
            v-else
            class="flex text-md text-muted-foreground items-center gap-2"
          >
            <div>
              Mostrando
              <span class="font-medium">{{ currentPage || 1 }}</span> de
              <span class="font-medium">{{ traslados?.total || 1 }}</span>
              páginas
            </div>
          </div>

          <div class="flex justify-end gap-4">
            <Button
              size="icon"
              :disabled="currentPage === 1"
              variant="outline"
              @click="goToPreviousPage"
            >
              <ChevronLeft />
            </Button>
            <Button
              size="icon"
              :disabled="currentPage >= hasNextPage"
              variant="outline"
              @click="goToNextPage"
            >
              <ChevronRight />
            </Button>

            <div>
              <Select
                :default-value="searchParams.limit ?? '10'"
                @update:model-value="handleFilterByValue('limit', $event)"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para Nuevo/Editar Traslado -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? "Editar Traslado" : "Nuevo Traslado" }}
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>

        <form @submit.prevent="saveTransfer()" class="space-y-4">
          <!-- Tipo de Militante (solo en crear) -->
          <div v-if="!isEdit">
            <Label class="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Militante <span class="text-red-500">*</span>
            </Label>
            <select
              v-model="tipoMilitante"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar tipo</option>
              <option value="interno">Interno</option>
              <option value="externo">Externo</option>
            </select>
          </div>

          <!-- Militante Interno (select) o Externo (input) -->
          <div v-if="!isEdit && tipoMilitante">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{
                tipoMilitante === "interno"
                  ? "Militante"
                  : "Nombre del Militante Externo"
              }}
              <span class="text-red-500">*</span>
            </label>

            <!-- Select para militante interno -->
            <select
              v-if="tipoMilitante === 'interno'"
              v-model="currentTransfer.militante.id"
              @change="onMilitanteChange"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar militante</option>
              <option
                v-for="member in members"
                :key="member.id"
                :value="member.id"
              >
                {{ member.firstname }} {{ member.lastname }}
              </option>
            </select>

            <!-- Input para militante externo -->
            <Input
              v-else
              v-model="nombreMilitanteExterno"
              type="text"
              required
              placeholder="Escriba el nombre completo del militante"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <!-- Mostrar input de solo lectura cuando está editando -->
          <div v-if="isEdit">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Militante</label
            >
            <input
              type="text"
              :value="
                currentTransfer.militante?.firstname
                  ? `${currentTransfer.militante.firstname} ${currentTransfer.militante.lastname}`
                  : currentTransfer.nombreMilitanteExterno || 'N/A'
              "
              disabled
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700"
            />
          </div>

          <!-- Tipo de Traslado - SOLO para militante interno -->
          <div v-if="!isEdit && tipoMilitante === 'interno'">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Traslado <span class="text-red-500">*</span>
            </label>
            <select
              v-model="tipoTraslado"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar tipo</option>
              <option value="interno">Interno</option>
              <option value="externo">Externo</option>
            </select>
          </div>

          <!-- Tipo de Traslado en edición -->
          <div v-if="isEdit">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Tipo de Militante</label
            >
            <input
              type="text"
              :value="tipoMilitante === 'interno' ? 'Interno' : 'Externo'"
              disabled
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700 mb-3"
            />

            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Traslado <span class="text-red-500">*</span>
            </label>
            <select
              v-model="tipoTraslado"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar tipo</option>
              <option value="interno">Interno</option>
              <option value="externo">Externo</option>
            </select>
          </div>

          <!-- Núcleo Origen -->
          <div v-if="(!isEdit && tipoMilitante) || isEdit">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Núcleo Origen <span class="text-red-500">*</span>
            </label>
            <!-- Militante interno: mostrar el núcleo de BD (readonly) -->
            <Input
              v-if="tipoMilitante === 'interno' && !isEdit"
              type="text"
              :value="nucleoOrigenFromDB"
              disabled
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700"
            />
            <!-- Militante externo o editando: input manual -->
            <Input
              v-else
              v-model="currentTransfer.origen"
              type="text"
              required
              placeholder="Nombre del núcleo de origen"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <!-- Núcleo Destino -->
          <div v-if="shouldShowDestino">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Núcleo Destino <span class="text-red-500">*</span>
            </label>

            <!-- Traslado interno: select de núcleos -->
            <select
              v-if="
                (tipoMilitante === 'interno' && tipoTraslado === 'interno') ||
                (tipoMilitante === 'externo' && !isEdit)
              "
              v-model="currentTransfer.destino"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar núcleo</option>
              <option
                v-for="nucleo in cores"
                :key="nucleo.id"
                :value="nucleo.name"
              >
                {{ nucleo.name }}
              </option>
            </select>

            <!-- Para edición de traslado interno, también usar select -->
            <select
              v-else-if="isEdit && tipoTraslado === 'interno'"
              v-model="currentTransfer.destino"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar núcleo</option>
              <option
                v-for="nucleo in cores"
                :key="nucleo.id"
                :value="nucleo.name"
              >
                {{ nucleo.name }}
              </option>
            </select>

            <!-- Traslado externo: input manual -->
            <Input
              v-else-if="
                (tipoMilitante === 'interno' && tipoTraslado === 'externo') ||
                (isEdit && tipoTraslado === 'externo')
              "
              v-model="currentTransfer.destino"
              type="text"
              required
              placeholder="Escriba el nombre del núcleo destino"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <!-- Motivo del Traslado -->
          <div v-if="shouldShowOtherFields">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Motivo del Traslado <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="currentTransfer.details"
              required
              rows="3"
              placeholder="Describe el motivo del traslado..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <!-- Fecha de Traslado -->
          <div v-if="shouldShowOtherFields">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Traslado <span class="text-red-500">*</span>
            </label>
            <input
              v-model="currentTransfer.fecha"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Estado (solo en edición) -->
          <div
            v-if="isEdit"
            class="bg-blue-50 border border-blue-200 rounded-md p-3"
          >
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Estado <span class="text-red-500">*</span>
            </label>
            <select
              v-model="currentTransfer.estado"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="est in Estado" :key="est" :value="est">
                {{ est }}
              </option>
            </select>
          </div>

          <div class="flex gap-3 pt-4 justify-end">
            <Button
              type="button"
              @click="closeModal"
              variant="secondary"
              class="px-4 py-2"
            >
              Cancelar
            </Button>
            <Button type="submit" :disabled="isLoading" class="px-4 py-2">
              <span v-if="isLoading">Guardando...</span>
              <span v-else>{{ isEdit ? "Actualizar" : "Crear Traslado" }}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeDetailsModal"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Detalles del Traslado</h3>
          <button
            @click="closeDetailsModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>

        <div v-if="selectedTransfer" class="space-y-5">
          <!-- Información del Militante -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-semibold text-gray-700 mb-3">
              Información del Militante
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Nombre</label
                >
                <p class="text-base text-gray-900 font-medium">
                  <template v-if="selectedTransfer.militante">
                    {{ selectedTransfer.militante.firstname }}
                    {{ selectedTransfer.militante.lastname }}
                  </template>
                  <template v-else>
                    {{ selectedTransfer.nombreMilitanteExterno }}
                  </template>
                </p>
              </div>
              <div v-if="selectedTransfer.militante">
                <label class="block text-sm font-medium text-gray-500"
                  >CI</label
                >
                <p class="text-base text-gray-900">
                  {{ selectedTransfer.militante.ci }}
                </p>
              </div>
            </div>
          </div>

          <!-- Detalles del Traslado -->
          <div>
            <h4 class="font-semibold text-gray-700 mb-3">
              Detalles del Traslado
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Origen</label
                >
                <p class="text-base text-gray-900 font-medium">
                  {{ selectedTransfer.origen }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Destino</label
                >
                <p class="text-base text-gray-900 font-medium">
                  {{ selectedTransfer.destino }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Tipo de Militante</label
                >
                <p class="text-base text-gray-900">
                  {{ selectedTransfer.tipoMilitante || "Interno" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Tipo de Traslado</label
                >
                <p class="text-base text-gray-900">
                  {{ selectedTransfer.tipoTraslado || "N/A" }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Fecha</label
                >
                <p class="text-base text-gray-900">
                  {{ formatDate(selectedTransfer.fecha) }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Estado</label
                >
                <span
                  class="inline-block px-3 py-1 text-sm font-medium rounded-full"
                  :class="getEstadoBadgeClass(selectedTransfer.estado)"
                >
                  {{ selectedTransfer.estado }}
                </span>
              </div>
            </div>
          </div>

          <!-- Motivo -->
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-2"
              >Motivo del Traslado</label
            >
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-base text-gray-900 whitespace-pre-wrap">
                {{ selectedTransfer.details }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-6 border-t">
          <Button
            @click="closeDetailsModal"
            variant="secondary"
            class="px-6 py-2"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import DropdownMenu from "@/components/ui/dropdown-menu/DropdownMenu.vue";
import DropdownMenuContent from "@/components/ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuItem from "@/components/ui/dropdown-menu/DropdownMenuItem.vue";
import DropdownMenuTrigger from "@/components/ui/dropdown-menu/DropdownMenuTrigger.vue";
import Input from "@/components/ui/input/Input.vue";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import {
  Eye,
  MoreVerticalIcon,
  Pencil,
  PlusIcon,
  XIcon,
  Download,
  FileDown,
} from "lucide-vue-next";
import { ref, computed, watch } from "vue";
import { toast } from "vue-sonner";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { useUrlSearchParams } from "@vueuse/core";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Label from "@/components/ui/label/Label.vue";

const {
  traslados,
  members,
  cores,
  page: initialPage,
} = defineProps<{
  traslados: any;
  members: any[];
  cores: any;
  page: number;
}>();

// Estado reactivo
const searchTerm = ref("");
const statusFilter = ref("");
const showModal = ref(false);
const showDetailsModal = ref(false);
const isLoading = ref(false);
const selectNucleo = ref("");
const isEdit = ref(false);
const searchParams = useUrlSearchParams();

// Nuevos estados para el flujo de creación
const tipoMilitante = ref<"interno" | "externo" | "">("");
const tipoTraslado = ref<"interno" | "externo" | "">("");
const nombreMilitanteExterno = ref("");
const nucleoOrigenFromDB = ref("");

const Estado = ["Pendiente", "Completado"] as const;

//Estados de paginación
const currentPage = ref(initialPage || 1);
const hasNextPage = ref(traslados?.total || 1);

const indexPage = (index: number) => {
  const limit: number = traslados.limit;
  const page: number = traslados.total;
  return Number(page - 1) * Number(limit) + (index + 1);
};

// Función para obtener clases CSS según el estado
const getEstadoBadgeClass = (estado: string) => {
  const classes: Record<string, string> = {
    Pendiente: "bg-gray-100 text-gray-800",
    Completado: "bg-green-100 text-green-800",
  };
  return classes[estado] || "bg-gray-100 text-gray-800";
};

// Función para formatear fecha
// Función para formatear fecha en la TABLA y DETALLES
const formatDate = (date: string | Date) => {
  try {
    // Si viene como string desde el backend (ej: "2024-12-31T00:00:00.000Z")
    // lo parseamos como fecha local, no UTC
    const dateStr = typeof date === "string" ? date : date.toISOString();
    const [year, month, day] = dateStr.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return "";
  }
};

// Función para formatear fecha en el MODAL DE EDICIÓN
const formatDateForEdit = (date: string | Date) => {
  try {
    // Extraer solo la parte de la fecha (YYYY-MM-DD) sin conversiones
    const dateStr = typeof date === "string" ? date : date.toISOString();
    return dateStr.split("T")[0]; // Devuelve "2024-12-31"
  } catch {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
};

const selectedTransfer = ref<any>({
  origen: "",
  destino: "",
  details: "",
  militante: null,
  fecha: "",
  estado: Estado[0],
  tipoMilitante: "",
  tipoTraslado: "",
  nombreMilitanteExterno: "",
});

const currentTransfer = ref<{
  id?: number;
  origen: string;
  destino: string;
  details: string;
  militante: {
    id: string | number;
    firstname?: string;
    lastname?: string;
  };
  fecha: Date | string;
  estado: (typeof Estado)[number];
  nombreMilitanteExterno?: string;
}>({
  origen: "",
  destino: "",
  details: "",
  militante: { id: "" },
  fecha: new Date(),
  estado: Estado[0],
});

// Computed properties
const filteredTransfers = computed(() => {
  return traslados?.data.filter((transfer: any) => {
    const nombreCompleto = transfer.militante
      ? `${transfer.militante.firstname} ${transfer.militante.lastname}`.toLowerCase()
      : (transfer.nombreMilitanteExterno || "").toLowerCase();

    const matchesSearch = nombreCompleto.includes(
      searchTerm.value.toLowerCase(),
    );

    const matchedCores =
      selectNucleo.value === "" ||
      (transfer.militante && transfer.militante.core.id === selectNucleo.value);

    const matchesStatus =
      statusFilter.value === "" || transfer.estado === statusFilter.value;

    return matchesSearch && matchesStatus && matchedCores;
  });
});

const shouldShowDestino = computed(() => {
  if (isEdit.value) return true;
  if (!tipoMilitante.value) return false;
  if (tipoMilitante.value === "externo") return true;
  return tipoTraslado.value !== "";
});

const shouldShowOtherFields = computed(() => {
  if (isEdit.value) return true;
  if (!tipoMilitante.value) return false;
  if (tipoMilitante.value === "externo")
    return currentTransfer.value.destino !== "";
  return tipoTraslado.value !== "" && currentTransfer.value.destino !== "";
});

// Métodos
const openAddModal = () => {
  isEdit.value = false;
  tipoMilitante.value = "";
  tipoTraslado.value = "";
  nombreMilitanteExterno.value = "";
  nucleoOrigenFromDB.value = "";
  const today = new Date().toISOString().split("T")[0];
  currentTransfer.value = {
    origen: "",
    destino: "",
    details: "",
    militante: { id: "" },
    fecha: today,
    estado: Estado[0],
  };
  showModal.value = true;
};

const onMilitanteChange = () => {
  const selectedMember = members.find(
    (m: any) => m.id === currentTransfer.value.militante.id,
  );
  if (selectedMember && selectedMember.core) {
    nucleoOrigenFromDB.value = selectedMember.core.name;
    currentTransfer.value.origen = selectedMember.core.name;
  }
};

const openDetails = (transfer: any) => {
  selectedTransfer.value = { ...transfer };
  showDetailsModal.value = true;
};

const openEdit = (transfer: any) => {
  isEdit.value = true;
  tipoMilitante.value = transfer.militante ? "interno" : "externo";
  tipoTraslado.value = transfer.tipoTraslado || "interno";

  if (!transfer.militante && transfer.nombreMilitanteExterno) {
    nombreMilitanteExterno.value = transfer.nombreMilitanteExterno;
  }

  if (transfer.militante && transfer.militante.core) {
    nucleoOrigenFromDB.value = transfer.militante.core.name;
  }

  const fechaFormateada =
    transfer.fecha instanceof Date
      ? transfer.fecha.toISOString().split("T")[0]
      : new Date(transfer.fecha).toISOString().split("T")[0];

  currentTransfer.value = {
    ...transfer,
    fecha: formatDateForEdit(transfer.fecha),
    militante: transfer.militante || { id: "" },
  };

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEdit.value = false;
  tipoMilitante.value = "";
  tipoTraslado.value = "";
  nombreMilitanteExterno.value = "";
  nucleoOrigenFromDB.value = "";
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedTransfer.value = {
    origen: "",
    destino: "",
    details: "",
    militante: null,
    fecha: "",
    estado: Estado[0],
    tipoMilitante: "",
    tipoTraslado: "",
    nombreMilitanteExterno: "",
  };
};

const saveTransfer = async () => {
  isLoading.value = true;
  try {
    // CLAVE: Crear la fecha en formato ISO con hora al mediodía UTC
    const fechaLocal = currentTransfer.value.fecha; // "2024-12-31"
    const fechaISO = `${fechaLocal}T12:00:00.000Z`; // Forzar mediodía UTC

    if (!isEdit.value) {
      const transferData: any = {
        origen: currentTransfer.value.origen,
        destino: currentTransfer.value.destino,
        details: currentTransfer.value.details,
        fecha: fechaISO, // Usar fecha en formato ISO
        estado: Estado[0],
        tipoMilitante: tipoMilitante.value,
      };

      if (tipoMilitante.value === "interno") {
        transferData.militante = { id: currentTransfer.value.militante.id };
        transferData.tipoTraslado = tipoTraslado.value;
      } else {
        transferData.nombreMilitanteExterno = nombreMilitanteExterno.value;
        transferData.tipoTraslado = "interno";
      }

      await actions.transfer.createTransfer(transferData);
      toast.success("Traslado creado correctamente");
    } else {
      const updateData: any = {
        id: currentTransfer.value.id,
        origen: currentTransfer.value.origen,
        destino: currentTransfer.value.destino,
        details: currentTransfer.value.details,
        fecha: fechaISO, // Usar fecha en formato ISO
        estado: currentTransfer.value.estado,
        tipoTraslado: tipoTraslado.value,
      };

      if (
        tipoMilitante.value === "interno" &&
        currentTransfer.value.militante?.id
      ) {
        updateData.militante = { id: currentTransfer.value.militante.id };
      }

      await actions.transfer.updateTransfer(updateData);
      toast.success("El traslado fue editado correctamente");
    }
    closeModal();
    navigate("");
  } catch (error) {
    console.error("Error al guardar:", error);
    toast.error("Error al guardar el traslado");
  } finally {
    isLoading.value = false;
  }
};

const exportar = async (id: number) => {
  try {
    toast.info("Generando PDF...");
    const result = await actions.transfer.exportTransfer({ id });

    if (result.error) {
      toast.error(result.error.message || "Error al exportar");
      return;
    }

    const byteCharacters = atob(result.data.pdf);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.data.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Traslado exportado correctamente");
  } catch (error) {
    console.error("Error:", error);
    toast.error("No se pudo exportar el traslado");
  }
};

const exportarListado = async () => {
  try {
    toast.info("Generando listado de traslados...");

    const result = await actions.transfer.exportListadoTransfers({
      estado: statusFilter.value || undefined,
      nucleoId: selectNucleo.value ? String(selectNucleo.value) : undefined,
    });

    if (result.error) {
      toast.error(result.error.message || "Error al exportar listado");
      return;
    }

    const byteCharacters = atob(result.data.pdf);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.data.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Listado exportado correctamente");
  } catch (error) {
    console.error("Error:", error);
    toast.error("No se pudo exportar el listado");
  }
};

// Funciones de paginación
function goToNextPage() {
  const query = new URLSearchParams(searchParams as any);
  const nextPage = Number(currentPage.value) + 1;
  if (currentPage.value < hasNextPage.value) {
    currentPage.value = nextPage;
    query.set("page", String(nextPage));
    navigate("?" + query.toString());
  }
}

function goToPreviousPage() {
  const query = new URLSearchParams(searchParams as any);
  const prevPage = Number(currentPage.value) - 1;
  if (currentPage.value > 1) {
    currentPage.value = prevPage;
    query.set("page", String(prevPage));
    navigate("?" + query.toString());
  }
}

const handleFilterByValue = (filter: string, value: any) => {
  const query = new URLSearchParams(searchParams as any);

  if (filter === "limit") {
    query.set("page", "1");
    currentPage.value = 1;
  }

  if (value && value !== "all") {
    query.set(filter, value);
  } else {
    query.delete(filter);
  }

  navigate("?" + query.toString());
};

// Watch para resetear página al filtrar
watch([searchTerm, statusFilter, selectNucleo], () => {
  currentPage.value = 1;
});
</script>
