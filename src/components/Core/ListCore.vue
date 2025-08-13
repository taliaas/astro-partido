<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between space-y-4 mb-4">
        <h1 class="text-3xl font-semibold text-gray-900 mb-8">
          Núcleos PCC CUJAE
        </h1>
        <button class="bg-blue-600 px-6 rounded text-white" @click="create">Crear núcleo</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Núcleo Card -->
        <div
          v-for="nucleo in cores"
          :key="nucleo.name"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div class="p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">
                {{ nucleo.name }}
              </h2>
              <div class="flex items-center space-x-2">
                <UsersIcon class="h-5 w-5 text-blue-500" />
                <span class="text-gray-600 font-medium">{{
                  nucleo.militantes.length
                }}</span>
              </div>
            </div>
            <div class="space-y-4">
              <span class="font-medium text-gray-600">Cómite: </span>
              <p class="text-md text-gray-500">{{ nucleo.areas?.name }}</p>
            </div>
            <div class="flex gap-4">
              <span class="text-md font-medium text-gray-600">
                Secretario funcionamiento:
              </span>
              <p class="text-gray-500 text-md">
                {{ nucleo.secretarioFuncionamiento }}
              </p>
            </div>
            <div class="flex gap-4">
              <span class="text-md font-medium text-gray-600"
                >Secretario general:
              </span>
              <p class="text-gray-500 text-md">
                {{ nucleo.secretarioGeneral }}
              </p>
            </div>

            <!-- Expand Button -->
            <button
              @click="handleExpanding(nucleo.id)"
              class="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ChevronDownIcon v-if="!expanding" class="h-4 w-4" />
              <ChevronUpIcon v-else class="h-4 w-4" />
              <span class="ml-1">{{
                expanding ? "Menos detalles" : "Más detalles"
              }}</span>
            </button>

            <!-- Expanded Details -->
            <div v-if="expanding" class="mt-4 pt-4 border-t border-gray-100">
              <div class="space-y-2">
                <div
                  v-for="detail in cores"
                  :key="detail.id"
                  class="flex justify-between items-center"
                >
                  <span class="text-sm text-gray-600">{{ detail }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ChevronDownIcon, ChevronUpIcon, UsersIcon } from "lucide-vue-next";
import {Button} from "@/components/ui/button";
import {navigate} from "astro:transitions/client";

const { cores } = defineProps<{ cores: any[] }>();

const expanding = ref(false);

const handleExpanding = (nucleoId) => {
  const nucleo = cores.value.find(n => n.id === nucleoId);
  if (nucleo) expanding.value = !expanding.value;
};

const create = () => {
  navigate('core/add')
}
</script>
