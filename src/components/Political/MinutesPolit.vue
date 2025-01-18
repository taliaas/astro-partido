<template>
  <div class="min-h-screen p-6">
    <div
      class="mx-auto max-w-7xl bg-white p-6 border border-gray-300 rounded-lg"
    >
      <div
        class="mb-8 text-center transform transition-all duration-500 hover:scale-102"
      >
        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          Acta de Círculo Político
        </h1>
      </div>

      <div class="max-w-7xl mx-auto overflow-hidden">
        <form @submit.prevent="submitForm" class="p-8 space-y-3">
          <!-- Núcleo -->
          <div class="space-y-2 w-1/4">
            <label for="nucleo" class="block text-sm font-medium text-gray-700"
              >Núcleo</label
            >
            <select
              name="nucleo"
              v-model="selectedNucleo"
              class="w-full px-1 py-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-gray-300"
            >
              <option v-for="nucleo in cores" :key="nucleo" :value="nucleo">
                {{ nucleo?.name }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="w-3/4">
                <label
                  for="fecha"
                  class="block text-md font-medium text-gray-700"
                  >Fecha de la reunión</label
                >
                <Input
                  type="date"
                  id="fecha"
                  name="fecha"
                  v-model="formData.fecha"
                  required
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
              <div class="w-3/4">
                <label
                  for="hora"
                  class="block text-md font-medium text-gray-700"
                  >Hora</label
                >
                <Input
                  type="time"
                  id="hora"
                  name="hora"
                  v-model="formData.hora"
                  required
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
              <div class="w-3/4">
                <label
                  for="lugar"
                  class="block text-md font-medium text-gray-700"
                  >Lugar</label
                >
                <Input
                  type="text"
                  id="lugar"
                  name="lugar"
                  v-model="formData.lugar"
                  required
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
          </div>
          <div class="flex *:flex-1 gap-4">
            <div class="">
              <label
                  for="total_trabajador"
                  class="block text-md font-medium text-gray-700"
              >Cantidad de trabajadores</label
              >
              <Input
                  type="number"
                  id="trabajador"
                  name="trabajador"
                  v-model="formData.total_trabajador"
                  required
                  min="0"
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
            <div class="">
              <label
                  for="total_organismo"
                  class="block text-md font-medium text-gray-700"
              >Participantes del Org. Sup.</label
              >
              <Input
                  type="number"
                  id="organismo"
                  name="organismo"
                  v-model="formData.total_organismo"
                  required
                  min="0"
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
          <!-- Causas de Ausencias -->
          <div class="space-y-2">
            <div class="flex justify-between">
              <h3 class="text-lg font-medium text-gray-800 flex items-center">
                Causas de Ausencias
              </h3>
              <button
                @click="addAusencia"
                type="button"
                class="group inline-flex items-center bg-white m-3 justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4"
              >
                <PlusIcon
                  class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90"
                />
                Agregar Ausencia
              </button>
            </div>
            <TransitionGroup name="list" tag="div" class="space-y-2">
              <div
                v-for="(ausencia, index) in formData.causa"
                :key="index"
                class="flex space-x-2"
              >
                <Input
                  v-model="ausencia.nombre"
                  type="text"
                  class="flex-1 px-3 py-2 focus:outline-none border text-gray-500 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  placeholder="Nombre"
                />
                <Input
                  v-model="ausencia.motivo"
                  type="text"
                  class="flex-1 px-3 py-2 border focus:outline-none text-gray-500 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  placeholder="Motivo"
                />
                <button
                  @click="removeAusencia(index)"
                  type="button"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded text-red-600 bg-gray-50 hover:bg-gray-200 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </TransitionGroup>
          </div>

          <!-- Datos del Tema Evaluado -->
          <div class="space-y-2">
            <div>
              <label for="temaTratado" class="block text-lg font-medium"
                >Tema evaluado en la reunión</label
              >
              <div class="mt-1 relative rounded shadow-sm">
                <Textarea
                  id="temaTratado"
                  v-model="formData.tema"
                  rows="3"
                  required
                  class="block w-full text-lg p-2 text-gray-500 border border-gray-300 bg-transparent focus:outline-none rounded transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  placeholder="Título del tema"
                />
              </div>
            </div>
          </div>

          <!-- Principales Planteamientos -->
          <div class="space-y-1 flex justify-between">
            <h3 class="text-lg font-medium flex items-center">
              Principales Planteamientos
            </h3>
          </div>
          <div class="rounded border">
            <Textarea
              id="planteamientos"
              name="planteamientos"
              v-model="formData.planteamientos"
              rows="4"
              required
              class="text-gray-600 focus:outline-none ring-transparent block w-full md:text-md border-gray-300 rounded transition duration-150 ease-in-out"
            ></Textarea>
          </div>

          <!-- Valoración de la Reunión -->
          <div class="space-y-2">
            <div>
              <label for="resumenEvento" class="block text-xl font-medium mb-4"
                >Valoración de la Reunión</label
              >
              <div class="mt-1">
                <Textarea
                  id="valo"
                  name="valoracion"
                  v-model="formData.valoracion"
                  rows="4"
                  required
                  class="text-gray-600 focus:outline-none ring-transparent block w-full md:text-md border-gray-300 rounded transition duration-150 ease-in-out"
                  placeholder="Valoración de la calidad de la reunión"
                ></Textarea>
              </div>
            </div>
          </div>
          <div class="flex *:flex-1 gap-4">
            <div class="my-6">
              <label
                for="orientador"
                class="block text-md font-medium w-3/4 my-2 text-gray-700"
                >Nombre del orientador</label
              >
              <input
                type="text"
                name="name_orientador"
                v-model="formData.name_orientador"
                class="border text-gray-500 border-gray-300 p-2 rounded focus:outline-none w-full"
                placeholder="Nombre del orientador"
              />
            </div>
            <div class="my-6">
              <label
                for="secretario"
                class="block text-md font-medium my-2 text-gray-700"
                >Nombre del Secretario</label
              >
              <input
                type="text"
                name="name_secretario"
                v-model="formData.name_secretario"
                class="border text-gray-500 border-gray-300 p-2 rounded focus:outline-none w-full"
                placeholder="Nombre del Secretario"
              />
            </div>
          </div>
          <div class="flex justify-between mt-4 py-4">
            <Button
              variant="outline"
              @click="cerrar"
              type="reset"
              class="w-1/3 px-4 py-2 rounded bg-gray-100 border border-gray-300 hover:bg-gray-200 shadow-md"
              >Cancelar
            </Button>
            <button
              type="submit"
              class="w-1/3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "../ui/input/Input.vue";
import { PlusIcon, TrashIcon } from "lucide-vue-next";
import Textarea from "../ui/textarea/Textarea.vue";
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { navigate } from "astro:transitions/client";
import { Label } from "@/components/ui/label";
import PoliticalService from "@/services/PoliticalService.ts";

const selectedNucleo = ref(null);
const { cores } = defineProps<{ cores: any[] }>();

const formData = ref({
  lugar: "",
  hora: "",
  fecha: "",
  total_organismo: 0,
  total_trabajador: 0,
  ausentes: 0,
  causa: [],
  tema: "",
  planteamientos: [],
  valoracion: "",
  name_orientador: "",
  name_secretario: "",
});

const cerrar = async () => {
  console.log("minutes");
  await navigate("/minutes/");
};

const addAusencia = () => {
  formData.value.causa.push({ nombre: "", motivo: "" });
};

const removeAusencia = (index) => {
  formData.value.causa.splice(index, 1);
};

const submitForm = async () => {
  const service = new PoliticalService();
  try {
    await service.createMinute({
      ...formData.value,
      core: selectedNucleo.value,
    });
    alert('Se ha creado el acta política correctamente!')
    await navigate('/minutes')
  } catch (e) {
    console.log(e);
  }
};
</script>
