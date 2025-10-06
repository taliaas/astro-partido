<template>
  <div>
    <!-- Leyenda de columnas (discreta, no como tabla) -->
    <div class="space-y-2">
      <div v-for="com in comite" :key="com.id">
        <Collapsible>
          <CollapsibleTrigger
            class="flex justify-between items-center group w-full p-2 text-lg font-medium hover:bg-gray-100 bg-gray-50 border border-gray-300 rounded-md group transition-colors"
          >
            {{ com.name }}
            <div class="flex items-center gap-2">
              <ChevronDownIcon
                class="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform"
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{{ listTable[0] }}</TableHead>
                  <TableHead>{{ listTable[1] }}</TableHead>
                  <TableHead>{{ listTable[2] }}</TableHead>
                  <TableHead class="text-center">{{ listTable[3] }}</TableHead>
                  <TableHead class="text-center">{{ listTable[4] }}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody
                v-for="nucleo in com.core"
                :key="nucleo.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <TableRow>
                  <TableCell>{{ nucleo.name }}</TableCell>
                  <TableCell>{{ getFechas(nucleo.id).fechaR }}</TableCell>
                  <TableCell>{{ getFechas(nucleo.id).fechaE }}</TableCell>
                  <TableCell class="text-center">{{
                    getAttendanceByCore(nucleo.id) ?? "-"
                  }}</TableCell
                  ><TableCell class="text-center *:p-1 *:px-2.5">
                    <div
                      v-if="nucleo.militantes.length < temp"
                      class="text-red-700 font-medium bg-red-100 rounded-full w-fit mx-auto"
                    >
                      {{ nucleo.militantes.length ?? 0 }}
                    </div>
                    <div v-else>
                      {{ nucleo.militantes.length ?? 0 }}
                    </div></TableCell
                  >
                </TableRow>
              </TableBody>
            </Table>
          </CollapsibleContent>
        </Collapsible>
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
import Table from "@/components/ui/table/Table.vue";
import TableBody from "@/components/ui/table/TableBody.vue";
import TableCell from "@/components/ui/table/TableCell.vue";
import TableHead from "@/components/ui/table/TableHead.vue";
import TableHeader from "@/components/ui/table/TableHeader.vue";
import TableRow from "@/components/ui/table/TableRow.vue";
import { ChevronDownIcon } from "lucide-vue-next";
import { ref } from "vue";

interface indicatorData {
  id: number;
  key: string;
  value: number;
  text: string;
}
export interface ComputoData {
  id: number;
  year: number;
  month: number;
  core: any;
  indicators: indicatorData[];
  minute: {
    id: number;
    uploadedAt: Date;
    fecha: Date;
    name: string;
  };
  minuteOrdinary: any;
  minutePolitical: any;
}
let temp = ref();
const selectDate = ref("2023-01");
const { comite, computo } = defineProps<{
  comite: Array<{
    id: number;
    name: string;
    core: Array<{
      id: number;
      name: string;
      militantes: any[];
    }>;
  }>;
  computo: ComputoData[];
}>();

const listTable = [
  "NÚCLEO",
  "FECHA REUNIÓN",
  "FECHA ENTREGA",
  "ASISTENCIA",
  "TOTAL",
];

// Función para obtener las asistencias de un núcleo específico
const getAttendanceByCore = (id: number) => {
  const value = selectDate.value;
  const [year, month] = value.split("-");

  temp.value = computo
    .find(
      (item) =>
        item.year === Number(year) &&
        item.month === Number(month) &&
        item.core.id === id
    )
    ?.indicators.find((i) => i.key === "asistencia")?.value;
  return temp.value;
};

const getTotalMiembros = (comiteId: number) => {
  let total = 0;
  comite
    .find((item) => item.id === comiteId)
    ?.core.forEach((element) => {
      total += element.militantes.length;
    });
  return total;
};

const getFechas = (id: number) => {
  const value = selectDate.value;
  const [year, month] = value.split("-");

  let fechaE: Date;
  let fechaR: Date;
  const data = computo.find(
    (item) =>
      item.year === Number(year) &&
      item.month === Number(month) &&
      item.core.id === id
  );

  if (data?.minute === null || data?.minute === undefined) {
    fechaR = data?.minuteOrdinary.fecha;
    fechaE = data?.minuteOrdinary.createdAt;
  } else {
    fechaE = data?.minute.uploadedAt;
    fechaR = data?.minute.fecha;
  }
  return {
    fechaE: fechaE ? new Date(fechaE).toLocaleDateString("es") : "-",
    fechaR: fechaR ? new Date(fechaR).toLocaleDateString("es") : "-",
  };
};
</script>
