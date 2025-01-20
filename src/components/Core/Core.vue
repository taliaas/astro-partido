<template>
  <div class="max-w-2xl bg-gray-50 items-center">
    <div class="mx-auto border border-gray-300 p-6 rounded bg-white">
      <h1 class="text-3xl font-bold mb-6 text-center">Crear un núcleo</h1>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-2">
          <Label for="coreName" class="text-xl font-semibold text-gray-700"
            >Núcleo</Label
          >
          <Input
            class="rounded border-gray-300"
            id="coreName"
            v-model="coreName"
            placeholder="Añadir nombre"
            required
          />
        </div>

        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-700">Cómite</h2>
          <select
            required
            class="rounded-md border px-3 py-2 mx-1.5 text-sm w-full"
            v-model="selectedArea"
          >
            <option v-for="area in areas" :key="area" :value="area">
              {{ area.name }}
            </option>
          </select>
        </div>
        <Button
          type="submit"
          variant="outline"
          class="w-full rounded border-gray-300 shadow-sm"
          >Guardar núcleo
        </Button>
      </form>
      <div
        v-if="showSuccessMessage"
        class="mt-4 p-4 bg-green-100 text-green-700 rounded-md"
      >
        Creado!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CoreService from "@/services/CoreService.ts";
import { Select } from "@/components/ui/select";

const areas = defineProps<{areas: any}>();

const selectedArea = ref('')
const coreName = ref("");
const showSuccessMessage = ref(false);

const handleSubmit = async() => {
  const coreData = { name: coreName.value };
  const crear = new CoreService();
  try {
    await crear.createCore(coreData, selectedArea.value);
    coreName.value = ''
    showSuccessMessage.value = true;
  } catch (error) {
    console.log("Error:", error);
  } finally {
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  }
};
</script>
