<script setup lang="ts">
import {ref} from 'vue'
import {indicators} from "@/lib/indicadoresKey.ts";

const selectedIndicator = ref("Orden del Día")
const fecha = ref('2025-07')
const {computo} = defineProps<{
  computo: any;
}>();
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-[1600px] mx-auto space-y-2">
      <div class="p-6">
        <div class="flex justify-between p-2">
          <h1 class="text-2xl font-bold mb-6">Análisis por Indicador</h1>
        </div>
      </div>
      <div class="shadow-md p-4 rounded-md border">
        <div class="flex gap-4">
          <div>
            <label
                class="text-md font-medium text-gray-700 dark:text-gray-300"
            >Indicadores</label
            >
            <select
                v-model="selectedIndicator"
                class="w-full rounded-md border border-gray-300 p-2 text-sm"
            >
              <option
                  v-for="(indicator,key) in indicators"
                  :key="key"
                  :value="indicator.name"
              >
                {{ indicator.name }}
              </option>
            </select>
          </div>

          <div class="flex flex-col">
            <label class="text-md font-medium text-gray-700 dark:text-gray-300">
              Mes y año
            </label>
            <input type="month" v-model="fecha" class="border p-2 rounded-md border-gray-300"/>
          </div>
        </div>

      </div>
      <div class="shadow-md p-4 rounded-md border">

      </div>
    </div>
  </div>
</template>
