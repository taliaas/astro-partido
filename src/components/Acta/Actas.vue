<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Header Section -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-semibold text-gray-900">
                Listado de Actas Ordinarias
              </h1>
              <p class="mt-1 text-sm text-gray-500">
                Gestiona y visualiza todas las actas del sistema
              </p>
            </div>
            <div class="flex gap-3">
              <div class="flex gap-3">
                <a
                  href="/addRO"
                  class="inline-flex items-center px-4 py-2 border border-gray-200 rounded shadow-sm text-sm font-medium text-gray-700 bg-primary-600 hover:bg-gray-50"
                >
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Nueva Acta
                </a>
              </div>
              <input
                type="file"
                class="inline-flex items-center px-4 py-2 border border-gray-200 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              />
            </div>
          </div>

          <!-- Search and Filters -->
          <div class="mt-6 flex items-center gap-4">
            <div class="flex-1 relative">
              <SearchIcon
                class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                type="text"
                placeholder="Buscar actas..."
                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                v-model="searchQuery"
              />
            </div>
            <select
              id="nucleo-filter"
              v-model="selectedNucleo"
              class="px-4 py-2 border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos los Núcleos</option>
              <option v-for="acta in actas" :key="acta.id" :value="acta.nucleo">
                {{ acta.nucleo }}
              </option>
            </select>
            <select
              v-model="selectedMonth"
              class="px-4 py-2 border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos los meses</option>
              <option value="1">Enero</option>
              <option value="2">Febrero</option>
              <option value="3">Marzo</option>
            </select>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Título
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Núcleo
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fecha
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Creado por
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="acta in actas" :key="acta.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">Acta Ordinaria {{ acta.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-left text-gray-500">{{ acta.core.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ acta.fecha }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ acta.secretarioGeneral }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(estado)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ estado }}
                  </span>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-right text-md font-medium"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-8 h-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full bg-white">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem @click="verActa">
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Ver</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Exportar</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator class="bg-gray-200" />
                      <DropdownMenuItem className="text-red-600 flex flex-row  p-1">
                        <Trash2 className="mr-1 h-2 w-2" />
                        <span class="ml-1">Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="actas.length === 0" class="text-center py-12">
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay actas</h3>
          <p class="mt-1 text-sm text-gray-500">
            Comienza creando una nueva acta o cargando un documento existente.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OrdinaryService from "@/services/OrdinaryService.ts";
import { navigate } from "astro:transitions/client";
import {
  Download,
  Edit,
  Eye,
  MoreVertical,
  PlusIcon,
  SearchIcon,
  Trash2
} from "lucide-vue-next";
import { onMounted, ref } from "vue";
import Button from "../ui/button/Button.vue";

const searchQuery = ref("");
const selectedNucleo = ref("");
const selectedMonth = ref("");

const actas = ref([]);

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
const estado = ref('Aprobada')
const getStatusClass = (status: string) => {
  const classes = {
    Aprobada: "bg-green-100 text-green-800",
    Pendiente: "bg-yellow-100 text-yellow-800",
    Rechazada: "bg-red-100 text-red-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const verActa = () => {
  navigate("/viewRO")
}

async function obtenerActas() {
  const service = new OrdinaryService();
  try {
    const user = await service.getAll();
    console.log("ACTAS:", user);
    actas.value = user;
  } catch (error) {
    console.log("error");
  }
}
onMounted(() => {
  obtenerActas();
});
</script>

<style>
:root {
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
  --primary-700: #0369a1;
}
</style>
