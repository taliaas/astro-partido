<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Stats Overview -->
      <div class="bg-white rounded shadow-sm p-6">
        <div class="flex justify-between">
            <Button
              @click="exportData" variant="outline"
              class="m-4 rounded "
            >
              <DownloadIcon class="h-4 w-4 mr-2" />
              Exportar
            </Button>
        </div>
      
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b text-gray-700 font-normal bg-gray-100">
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
                v-for="nucleo in nucleos"
                :key="nucleo.name"
                class="border-b hover:bg-gray-50"
              >
                <td class="py-3 px-4">{{ nucleo.name }}</td>
                <td class="text-center py-3 px-4">{{ nucleo.meetingDate }}</td>
                <td class="text-center py-3 px-4">{{ nucleo.deliveryDate }}</td>
                <td class="text-center py-3 px-4">{{ nucleo.total }}</td>
                <td class="text-center py-3 px-4">{{ nucleo.attendance }}</td>
                <td class="text-center py-3 px-4">{{ nucleo.absent }}</td>
                <td class="text-center py-3 px-4">
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
                        <span>Causas</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="showNotesDialog = true">
                        <Notebook class="w-4 h-4" />
                        <span>Notas</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DownloadIcon class="w-4 h-4" /> <span>Exportar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Notes Dialog -->
      <Dialog v-model:open="showNotesDialog">
        <DialogContent class="bg-white rounded">
          <DialogHeader>
            <DialogTitle>Notas y Observaciones</DialogTitle>
          </DialogHeader>
          <div class="space-y-4 max-h-[60vh] overflow-y-auto">
            <div v-for="note in notes" :key="note.id" class="p-4 rounded bg-gray-200">
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
    <div v-if="showSuccessMessage">
      <Alert>
        <AlertTitle>{{}}</AlertTitle>
        <AlertDescription>
          {{ mensaje }}
        </AlertDescription>
      </Alert>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { MoreVerticalIcon, Eye, DownloadIcon, Notebook } from "lucide-vue-next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AbsentService from "src/services/AbsentService";

const showSuccessMessage = ref(false);
const mensaje = ref("");
const showNotesDialog = ref(false);
const showAbsenceReasons = ref(false);

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
  }, {
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

async function loadAttendance() {
  const service = new AbsentService();

  try {
    const response = await service.getAll();
    //darle valor a la tabla con la AbsentInterface
    //dar valor a notas con esta info
  } catch (error) {
    showSuccessMessage.value = true;
    mensaje = "error";
    console.log("Error", error);
  } finally {
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  }
}

/*interface Notas {
  id: number;
  area: string;
  date: Date;
  text: string;
}*/
</script>
