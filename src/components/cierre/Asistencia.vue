<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900">Cierre del funcionamiento</h1>
        <h2 class="text-2xl font-semibold text-gray-600">Asistencia</h2>
        <p class="text-sm text-gray-500 font-medium">Marzo 2024</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <Tabs default-value="nucleo" class="flex flex-col items-center">
        <TabsList class="grid w-1/2 grid-cols-3">
          <TabsTrigger value="nucleo" class="hover:bg-gray-100 hover:border-b-3">
            Núcleos
          </TabsTrigger>
          <TabsTrigger value="comite" class="hover:bg-gray-100 hover:border-b-3">
            Cómite
          </TabsTrigger>
          <TabsTrigger value="general" class="hover:bg-gray-100 hover:border-b-3">
            CUJAE
          </TabsTrigger>
        </TabsList>
        <TabsContent value="nucleo">
          <Nucleos />
        </TabsContent>
        <TabsContent value="comite">
          <Comite />
        </TabsContent>
        <TabsContent value="general">
          <General />
        </TabsContent>
      </Tabs>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Comite from "./Asistencia/Comite.vue";
import General from "./Asistencia/General.vue";
import Nucleos from "./Asistencia/Nucleos.vue";
</script>
