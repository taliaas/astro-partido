<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mb-8 text-center transform transition-all duration-500 hover:scale-102">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Acta de Círculo Político</h1>
    </div>

    <div class="max-w-7xl mx-auto overflow-hidden">
      <form @submit.prevent="nextPage" class="p-8 space-y-3">
        <!-- Núcleo -->
        <div class="space-y-2 w-1/4">
          <label for="nucleo" class="block text-sm font-medium text-gray-700">Núcleo</label>
          <select
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
              <label for="fecha" class="block text-md font-medium text-gray-700">Fecha de la reunión</label>
              <Input type="date" id="fecha" name="fecha" v-model="foata.fecha" required
                     class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" />
            </div>
            <div class="w-3/4">
              <label for="hora" class="block text-md font-medium text-gray-700">Hora</label>
              <Input type="time" id="hora" name="hora" v-model="foata.hora" required
                     class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" />
            </div>
            <div class="w-3/4">
              <label for="lugar" class="block text-md font-medium text-gray-700">Lugar</label>
              <Input type="text" id="lugar" name="lugar" v-model="foata.lugar" required
                     class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" />
            </div>
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
                class="group inline-flex items-center bg-white m-3 justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4">
              <PlusIcon class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
              Agregar Ausencia
            </button>
          </div>
          <TransitionGroup name="list" tag="div" class="space-y-2">
            <div
                v-for="(ausencia, index) in foata.causasAusencias"
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
              <input
                  id="temaTratado"
                  v-model="foata.tema"
                  type="text"
                  required
                  class="block w-full text-lg p-2 text-gray-500 border border-gray-300 bg-transparent focus:outline-none rounded transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  placeholder="Título del tema"
              />
            </div>
          </div>
        </div>

        <!-- Principales Planteamientos -->
        <div class="space-y-1 flex justify-between">
          <h3 class="text-lg font-medium  flex items-center">
            Principales Planteamientos
          </h3>
          <button
              @click="addPlanteamiento"
              type="button"
              class="group inline-flex bg-white items-center m-3 justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4">
            <PlusIcon class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
            Agregar Planteamiento
          </button>
        </div>
        <div class="rounded border">
          <table class="w-full">
            <thead>
            <tr class="border-b bg-muted/50">
              <th class="h-12 px-4 text-left align-middle font-medium">Participante</th>
              <th class="h-12 px-4 text-left align-middle font-medium">Comentario</th>
              <th class="h-12 px-4 text-left align-middle font-medium"></th>
              <th class="h-12 w-[100px] px-4 align-middle"></th>
            </tr>
            </thead>
            <tbody>
            <tr
                class="border-b"
                v-for="(planteamiento, index) in foata.planteamientos"
                :key="index"
            >
              <td class="p-4 align-middle">
                <input
                    type="text"
                    v-model="planteamiento.participante"
                    class="w-full border-none text-gray-500 bg-transparent focus:outline-none"
                    placeholder="Nombre"
                />
              </td>
              <td class="p-4 align-middle">
                <input
                    type="text"
                    v-model="planteamiento.comentario"
                    class="w-full border-none text-gray-500 bg-transparent focus:outline-none"
                    placeholder="Comentario"
                />
              </td>
              <td class="p-4 align-middle text-end">
                <button
                    @click="removePlanteamiento(index)"
                    type="button"
                    class="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </td>
            </tr>
            </tbody>
          </table>
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
                v-model="foata.valoracion"
                rows="4"
                required
                class="text-gray-600 focus:outline-none ring-transparent block w-full md:text-md border-gray-300 rounded transition duration-150 ease-in-out"
                placeholder="Valoración de la calidad de la reunión"
            ></Textarea>
            </div>
          </div>
        </div>
        <div>
          <input
              type="text"
              v-model="foata.name_orientador"
              class="w-full border-none text-gray-500 bg-transparent focus:outline-none"
              placeholder="Nombre del orientador"
          />
          <input
              type="text"
              v-model="foata.name_secretario"
              class="w-full border-none text-gray-500 bg-transparent focus:outline-none"
              placeholder="Nombre del Secretario"
          />
        </div>
        <div class="flex justify-between">
          <Button variant="outline" @click="cerrar" type="reset" class="w-1/3 px-4 py-2 rounded bg-gray-100 border border-gray-300 hover:bg-gray-200 shadow-md">Cancelar</Button>
          <button type="submit"
                  class="w-1/3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ">
            Enviar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "../ui/input/Input.vue";
import { PlusIcon, TrashIcon } from "lucide-vue-next";
import Textarea from "../ui/textarea/Textarea.vue";
import {ref} from "vue";
import {Button} from "@/components/ui/button";
import {navigate} from "astro:transitions/client";

const selectedNucleo = ref(null);
const { cores } = defineProps<{ cores: any[] }>()

const foata = ref({
  lugar: '',
  hora: '',
  fecha: '',
  totalMilitantes: 10,
  ausentes: 0,
  causasAusencias: [],
  tema: "",
  planteamientos: [],
  valoracion: "",
  name_orientador: '',
  name_secretario: ''
});

const porcentajeAsistencia = (() => {
  if (foata.value.totalMilitantes > 0) {
    const porcentaje =
        ((foata.value.totalMilitantes - foata.value.ausentes) /
            foata.value.totalMilitantes) *
        100;
    return porcentaje.toFixed(2) + "%";
  }
  return "0%";
});

const cerrar = async () => {
  console.log('minutes')
  await navigate("/minutes/");
}

const addAusencia = () => {
  foata.value.causasAusencias.push({ nombre: "", motivo: "" });
};

const removeAusencia = (index) => {
  foata.value.causasAusencias.splice(index, 1);
};

const addPlanteamiento = () => {
  foata.value.planteamientos.push({ participante: "", comentario: "" });
};

const removePlanteamiento = (index) => {
  foata.value.planteamientos.splice(index, 1);
};

const submitForm = () => {

};
</script>