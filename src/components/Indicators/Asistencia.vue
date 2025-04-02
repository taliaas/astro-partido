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

    <div
      v-for="com in comite"
      class="overflow-hidden space-y-2 divide-y"
      :key="com"
    >
      <Collapsible>
        <CollapsibleTrigger
          class="flex justify-between items-center group w-full p-2 text-lg font-medium hover:bg-gray-200 bg-gray-100 border border-gray-300 rounded-md group transition-colors"
        >
          {{ com.name }}
          <div class="flex items-center gap-2">
            <div
              class="group-data-[state=closed]:hidden px-3 bg-green-100 rounded-full"
            >
              <span class="text-green-700 text-sm"
                >Total: {{ setTotal(com) }}</span
              >
            </div>
            <ChevronDownIcon
              class="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform"
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>

        </CollapsibleContent>
      </Collapsible>
    </div>

    <!-- Resumen general -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex justify-between items-center">
        <h3 class="font-medium">Resumen General</h3>
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span class="text-sm">Asistencia: {{ getTotalAsistenciaGeneral() }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span class="text-sm">Ausencias: {{ getTotalAusenciasGeneral() }}</span>
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

const { comite } = defineProps<{
  comite: any[];
}>();

function getTotalAsistenciaGeneral() {
  let total = 0
  Object.keys(nucleos.value).forEach(comite => {
    total += getTotalAsistencia(comite)
  })
  return total
}

function getTotalAusenciasGeneral() {
  let total = 0
  Object.keys(nucleos.value).forEach(comite => {
    total += nucleos.value[comite].reduce((sum, nucleo) => sum + nucleo.ausente, 0)
  })
  return total
}

function getTotalMiembrosGeneral() {
  let total = 0
  Object.keys(nucleos.value).forEach(comite => {
    total += getTotalMiembros(comite)
  })
  return total
}
</script>
