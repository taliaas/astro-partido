<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900">Cierre del funcionamiento</h1>
         <h2 class="text-2xl font-semibold text-gray-600">Parte Municipio</h2>
         <p class="text-sm text-gray-500 font-medium">Marzo 2024</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      
    </main>
  </div>
</template>

<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Nucleos from "src/components/cierre/asistencia/Nucleos.vue";
import Comite from "src/components/cierre/asistencia/Comite.vue";
import General from "src/components/cierre/asistencia/General.vue";
</script>
