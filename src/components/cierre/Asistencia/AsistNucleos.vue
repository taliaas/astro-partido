<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Stats Overview -->
      <div class="bg-white rounded shadow-sm p-6">
        <div class="flex px-4 py-5 sm:px-6 border-gray-200">
          <h2 class="p-3 font-semibold text-gray-900">Núcleos</h2>
          <select
            v-model="nucleoSeleccionado"
            class="p-3 font-semibold text-gray-900 border-none rounded"
          >
            <option value="ind">Independientes</option>
            <option value="semestral">Mecánica</option>
            <option value="anual">ICB</option>
            <option value="anual">Civil</option>
            <option value="anual">Mixtos</option>
          </select>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4">Núcleo</th>
                <th class="text-center py-3 px-4">Fecha de Reunión</th>
                <th class="text-center py-3 px-4">Fecha de Entrega</th>
                <th class="text-center py-3 px-4">Militantes</th>
                <th class="text-center py-3 px-4">Asistencia</th>
                <th class="text-center py-3 px-4">Ausentes</th>
                <th class="text-right py-3 px-4">Porcentaje</th>
                <th class="text-right py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="nucleo in filteredNucleos"
                :key="nucleo.name"
                class="border-b hover:bg-gray-50"
              >
                <td class="py-3 px-4">{{ nucleo.name }}</td>
                <td class="text-center py-3 px-4">{{ nucleo.meetingDate }}</td>
                <td class="text-center py-3 px-4">{{ nucleo.deliveryDate }}</td>
                <td class="text-center py-3 px-4">{{ nucleo.total }}</td>
                <td class="text-center py-3 px-4">{{ nucleo.attendance }}</td>
                <td class="text-center py-3 px-4">{{ nucleo.absent }}</td>
                <td class="text-right py-3 px-4">
                  <span
                    :class="{
                      'text-green-600': nucleo.percentage >= 70,
                      'text-yellow-600':
                        nucleo.percentage >= 50 && nucleo.percentage < 70,
                      'text-red-600': nucleo.percentage < 50,
                    }"
                  >
                    {{ nucleo.percentage }}%
                  </span>
                </td>
                <td class="text-center py-3 px-4">
                  <DropdownMenu class="bg-white p-2 rounded-lg shadow-md">
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" class="w-8 h-8 p-0">
                        <MoreVerticalIcon class="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem @click="showAbsenceReasons = true">
                        <Eye class="w-4 h-4" />
                        <span>Detalles</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download class="w-4 h-4" /> <span>Exportar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Notes Section -->
      <div class="bg-white rounded shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Notas y Observaciones</h2>
          <Button @click="showNotesDialog = true" variant="outline" class="rounded">
            Ver Detalles
          </Button>
        </div>

        <!-- Preview of latest notes -->
        <div class="text-gray-600 bg-gray-200 rounded p-4">
          {{ notes[0].text }}
        </div>
      </div>

      <!-- Notes Dialog -->
      <Dialog v-model:open="showNotesDialog">
        <DialogContent class="bg-white rounded">
          <DialogHeader>
            <DialogTitle>Notas y Observaciones</DialogTitle>
          </DialogHeader>
          <div class="space-y-4 max-h-[60vh] overflow-y-auto">
            <div
              v-for="note in notes"
              :key="note.id"
              class="p-4 rounded bg-gray-200"
            >
              <div class="flex justify-between items-start">
                <span class="font-medium">{{ note.area }}</span>
                <span class="text-sm text-gray-500">{{ note.date }}</span>
              </div>
              <p class="mt-2 text-gray-700">{{ note.text }}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <!-- Absence Reasons Dialog -->
      <Dialog v-model:open="showAbsenceReasons">
        <DialogContent class="bg-white rounded shadow-md border-r-2">
          <DialogHeader>
            <DialogTitle>Causas de Ausencias</DialogTitle>
          </DialogHeader>
          <div class="space-y-3 max-h-[60vh] overflow-y-auto">
            <div
              v-for="reason in absenceReasons"
              :key="reason.label"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <div :class="[reason.color, 'w-3 h-3 rounded']"></div>
                <span class="text-sm">{{ reason.label }}</span>
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-sm font-medium">{{ reason.count }}</span>
                <div class="w-24 bg-gray-200 rounded h-2">
                  <div
                    :class="[reason.color, 'h-2 rounded']"
                    :style="{ width: `${reason.percentage}%` }"
                  ></div>
                </div>
                <span class="text-sm text-gray-500 w-12">{{ reason.percentage }}%</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { MoreVerticalIcon, Eye, Download } from "lucide-vue-next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const showNotesDialog = ref(false);
const showAbsenceReasons = ref(false);
const selectedNucleo = ref("all");
const nucleoSeleccionado = ref("ind");

const nucleoOptions = [
  { label: "Todos los Núcleos", value: "all" },
  { label: "Arquitectura", value: "arquitectura" },
  { label: "Automática", value: "automatica" },
  { label: "CIPEL", value: "cipel" },
];

const nucleos = ref([
  {
    name: "Arquitectura",
    meetingDate: "2024-03-15",
    deliveryDate: "2024-03-20",
    total: 11,
    attendance: 11,
    absent: 0,
    percentage: 100,
  },
  {
    name: "Automática",
    meetingDate: "2024-03-16",
    deliveryDate: "2024-03-21",
    total: 16,
    attendance: 10,
    absent: 6,
    percentage: 62.5,
  },
  {
    name: "CIPEL",
    meetingDate: "2024-03-17",
    deliveryDate: "2024-03-22",
    total: 16,
    attendance: 0,
    absent: 16,
    percentage: 0,
  },
]);

const filteredNucleos = computed(() => {
  if (selectedNucleo.value === "all") {
    return nucleos.value;
  }
  return nucleos.value.filter(
    (nucleo) => nucleo.name.toLowerCase() === selectedNucleo.value
  );
});

const absenceReasons = ref([
  { label: "Enfermedad", count: 6, percentage: 30, color: "bg-red-600" },
  { label: "Extranjero", count: 3, percentage: 1, color: "bg-blue-600" },
  { label: "Trabajo", count: 3, percentage: 15, color: "bg-gray-600" },
  { label: "Fuera de Provincia", count: 6, percentage: 30, color: "bg-yellow-400" },
  { label: "Vacaciones", count: 2, percentage: 10, color: "bg-green-600" },
  { label: "Lic. de Maternidad", count: 2, percentage: 1, color: "bg-pink-600" },
  { label: "Problemas Personales", count: 3, percentage: 1, color: "bg-purple-600" },
  { label: "Problemas Familiares", count: 2, percentage: 1, color: "bg-orange-600" },
  { label: "Movilizado", count: 2, percentage: 1, color: "bg-blue-300" },
  { label: "Injustificado", count: 3, percentage: 1, color: "bg-violet-800" },
  { label: "Otros", count: 2, percentage: 1, color: "bg-red-400" },
]);

const notes = ref([
  {
    id: 1,
    area: "Automática",
    date: "Mar 24",
    text:
      "Hay 3 procesos de desactivación en curso, 1 en el extranjero en beca doctoral.",
  },
  {
    id: 2,
    area: "CIME",
    date: "Mar 24",
    text:
      "1 con Parkinson enfermo, imposible de asistir. (El Núcleo acordó su flexibilización).",
  },
  {
    id: 3,
    area: "VRIPG",
    date: "Mar 24",
    text: "Revisar trámite de traslado de Modesto.",
  },
]);
</script>
