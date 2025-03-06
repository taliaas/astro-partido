<template>
  <div class="max-w-[1600px] mx-auto space-y-6 p-4">
    <div class="p-6 rounded border border-gray-200 bg-white shadow-sm">
      <div class="mb-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900 pb-2">
          Gestión de Indicadores
        </h1>
      </div>
      <div>
        <div>
          <label>Nombre</label>
          <input class="flex"></input>
        </div>
        <div>
          <label>Descripción</label>
          <textarea class="w-full"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";


</script>