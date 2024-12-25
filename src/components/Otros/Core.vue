<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <h1 class="text-3xl font-bold mb-6 text-center">Crear un núcleo</h1>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="space-y-2">
        <Label for="coreName" class="text-xl font-semibold text-gray-700">Núcleo</Label>
        <Input
          class="rounded border-gray-300"
          id="coreName"
          v-model="coreName"
          placeholder="Añadir nombre"
          required
        />
      </div>

      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-700">Áreas</h2>
        <TransitionGroup name="list" tag="ul" class="space-y-4">
          <li
            v-for="(area, index) in areas"
            :key="index"
            class="flex items-center space-x-2"
          >
            <Input
              class="rounded border-gray-300"
              v-model="area.name"
              :placeholder="`Añadir área ${index + 1}`"
              required
            />
            <Button
              class="rounded border-gray-300"
              type="button"
              variant="destructive"
              size="icon"
              @click="removeArea(index)"
              :disabled="areas.length === 1"
            >
              <TrashIcon class="h-4 w-4 text-red-600" />
            </Button>
          </li>
        </TransitionGroup>
        <Button
          type="button"
          variant="outline"
          @click="addArea"
          class="w-full rounded border-gray-300 shadow-sm"
        >
          Añadir área
        </Button>
      </div>
      <Button
        type="submit"
        variant="outline"
        class="w-full rounded border-gray-300 shadow-sm"
        >Guardar núcleo</Button
      >
    </form>

    <div
      v-if="showSuccessMessage"
      class="mt-4 p-4 bg-green-100 text-green-700 rounded-md"
    >
      Creado!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CoreService from "@/services/CoreService.ts";
import { TrashIcon } from "lucide-vue-next";

interface Area {
  name: string;
}
const areas = ref<Area[]>([{ name: "" }]);

const addArea = () => {
  areas.value.push({ name: "" });
};

const removeArea = (index: number) => {
  if (areas.value.length > 1) {
    areas.value.splice(index, 1);
  }
};
const coreName = ref("");
const showSuccessMessage = ref(false);

const handleSubmit = () => {
  const coreData = { name: coreName.value };
  const crear = new CoreService();
  try {
    const response = crear.createCore(coreData, areas.value);
    coreName.value = "";
    areas.value = [{ id: 1, name: "" }];
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

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
