<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900">Cierre del funcionamiento</h1>
        <h2 class="text-2xl font-semibold text-gray-600">Asistencia</h2>
        <input
          type="month"
          lang="es"
          v-model="fecha"
          class="text-sm text-gray-500 font-medium"
        />
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <AsistNucleos />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AsistNucleos from "./Asistencia/AsistNucleos.vue";

const fecha = ref("2024-03");

</script>
