<template>
  <div>
    <!-- Leyenda de columnas (discreta, no como tabla) -->
    <div
      class="grid grid-cols-7 gap-4 px-4 mb-2 text-sm font-medium text-gray-500"
    >
      <div>NÚCLEO</div>
      <div>FECHA REUNIÓN</div>
      <div>FECHA ENTREGA</div>
      <div class="text-center">TOTAL</div>
      <div class="text-center">ASISTENCIA</div>
      <div class="text-center">AUSENTE</div>
      <div class="text-center">PORCIENTO</div>
    </div>

    <div class="space-y-2">
      <div v-for="com in comite" :key="com.id">
        <Collapsible>
          <CollapsibleTrigger
            class="flex justify-between items-center group w-full p-2 text-lg font-medium hover:bg-gray-100 bg-gray-50 border border-gray-300 rounded-md group transition-colors"
          >
            {{ com.name }}
            <div class="flex items-center gap-2">
              <div class="group-data-[state=closed]:hidden px-3 rounded-full">
                <span class="text-foreground text-sm"
                  >Total: {{ getTotalAsistencia(com.name) }}/{{
                    getTotalMiembros(com.name)
                  }}</span
                >
              </div>
              <ChevronDownIcon
                class="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform"
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div
              v-for="nucleo in com.core"
              :key="nucleo.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <div
                v-for="asis in getAttendanceByCore(nucleo.name)"
                :key="asis.id"
              >
                <div
                  class="grid grid-cols-7 gap-4 p-4 items-center text-sm border-b"
                >
                  <div class="font-medium">{{ nucleo.name }}</div>
                  <div>{{ formatDate(asis.creationDate) }}</div>
                  <div>{{ formatDate(asis.deliveryDate) }}</div>
                  <div class="text-center">{{ asis.total }}</div>
                  <div class="text-center text-green-600 font-medium">
                    {{ asis.attendance }}
                  </div>
                  <div class="text-center text-red-600 font-medium">
                    {{ asis.absents }}
                  </div>
                  <div class="text-center">
                    <span
                      class="inline-block px-2 py-1 rounded-full text-xs font-medium"
                      :class="getPercentageClass(asis.percent)"
                    >
                      {{ asis.percent }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="com.core.length === 0"
              class="p-4 border border-gray-300 rounded-md text-md flex flex-col items-center justify-center"
            >
              <h2 class="text-gray-500 font-medium">
                No hay núcleos registrados
              </h2>
              <p class="text-gray-400">
                Los núcleos aparecerán aquí cuando estén disponibles
              </p>
            </div>
            <div
              v-else-if="attendance.attendances.length === 0"
              class="p-4 rounded-md text-md flex flex-col items-center justify-center my-2"
            >
              <h2 class="text-gray-500 font-medium">No hay asistencias</h2>
              <p class="text-gray-400 text-sm">
                Los datos aparecerán aquí cuando estén disponibles
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
    <!-- Resumen general -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex justify-between items-center">
        <h3 class="font-medium">Resumen General</h3>
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span class="text-sm"
              >Asistencia: {{ getTotalAsistenciaGeneral() }}</span
            >
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span class="text-sm"
              >Ausencias: {{ getTotalAusenciasGeneral() }}</span
            >
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
            <span class="text-sm">Total: {{ getTotalMiembrosGeneral() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "lucide-vue-next";
import OrdinaryService from "@/services/OrdinaryService.ts";
import { ref, watch, onMounted } from "vue";
import type { AttendanceResponse } from "@/interface/Absent.ts";

const selectedMonth = ref("2025-01");
const { comite } = defineProps<{
  comite: Array<{
    id: number;
    name: string;
    core: Array<{
      id: number;
      name: string;
    }>;
  }>;
}>();

const attendance = ref<AttendanceResponse>({ attendances: [] });

// Función para obtener las asistencias de un núcleo específico
const getAttendanceByCore = (coreName: string) => {
  if (!attendance.value || !attendance.value.attendances) return [];
  return attendance.value.attendances.filter((a) => a.core === coreName);
};

// Función para formatear fechas
const formatDate = (dateString: string) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (e) {
    return dateString; // Si hay error, devolver la cadena original
  }
};

// Función para obtener el total de asistencia por comité
const getTotalAsistencia = (comiteName: string) => {
  if (!attendance.value || !attendance.value.attendances) return 0;

  // Obtener todos los núcleos del comité
  const comiteObj = comite.find((c) => c.name === comiteName);
  if (!comiteObj) return 0;

  const nucleosNames = comiteObj.core.map((n) => n.name);

  // Sumar todas las asistencias de los núcleos de este comité
  return attendance.value.attendances
    .filter((a) => nucleosNames.includes(a.core))
    .reduce((total, a) => total + a.attendance, 0);
};

// Función para obtener el total de miembros por comité
const getTotalMiembros = (comiteName: string) => {
  if (!attendance.value || !attendance.value.attendances) return 0;

  // Obtener todos los núcleos del comité
  const comiteObj = comite.find((c) => c.name === comiteName);
  if (!comiteObj) return 0;

  const nucleosNames = comiteObj.core.map((n) => n.name);

  // Sumar todos los totales de los núcleos de este comité
  return attendance.value.attendances
    .filter((a) => nucleosNames.includes(a.core))
    .reduce((total, a) => total + a.total, 0);
};

// Función para obtener el total de asistencia general
const getTotalAsistenciaGeneral = () => {
  if (!attendance.value || !attendance.value.attendances) return 0;
  return attendance.value.attendances.reduce(
    (total, a) => total + a.attendance,
    0,
  );
};

// Función para obtener el total de ausencias general
const getTotalAusenciasGeneral = () => {
  if (!attendance.value || !attendance.value.attendances) return 0;
  return attendance.value.attendances.reduce(
    (total, a) => total + a.absents,
    0,
  );
};

// Función para obtener el total de miembros general
const getTotalMiembrosGeneral = () => {
  if (!attendance.value || !attendance.value.attendances) return 0;
  return attendance.value.attendances.reduce((total, a) => total + a.total, 0);
};

// Función para obtener la clase CSS según el porcentaje
const getPercentageClass = (percentage: number) => {
  if (percentage >= 90) return "bg-green-100 text-green-800";
  if (percentage >= 70) return "bg-green-50 text-green-600";
  if (percentage >= 50) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

// Función para obtener los datos de asistencia
async function getAttendance() {
  const service = new OrdinaryService();
  const value = selectedMonth.value;
  const [year, month] = value.split("-");
  try {
    attendance.value = await service.getAttendance(month, year);
  } catch (e) {
    console.error("Error al obtener asistencias:", e);
    attendance.value = { attendances: [] };
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  getAttendance();
});

// Observar cambios en el mes seleccionado
watch(
  () => selectedMonth.value,
  () => {
    getAttendance();
  },
);
</script>
