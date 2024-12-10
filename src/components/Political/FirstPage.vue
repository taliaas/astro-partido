<template>
  <div class="min-h-screen">
    <form @submit.prevent="nextPage" class="p-8 space-y-8">
      <!-- Núcleo -->
      <div class="space-y-2 w-1/4">
        <label for="nucleo" class="block text-sm font-medium text-gray-700">Núcleo</label>
        <select
          v-model="selectedNucleo"
          class="w-full px-1 py-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-gray-300"
        >
          <option value="indep">Independiente</option>
          <option value="mec">Mecánica</option>
          <option value="icb">ICB</option>
          <option value="civ">Civil</option>
          <option value="mix">Mixtos</option>
        </select>
      </div>

      <!-- Asistencia -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-800 flex items-center">Asistencia</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label for="totalMilitantes" class="block text-sm font-medium text-gray-700"
              >Total de Militantes</label
            >
            <div class="mt-1 relative rounded shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <UsersIcon class="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="totalMilitantes"
                v-model="foata.totalMilitantes"
                type="number"
                required
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label for="ausentes" class="block text-sm font-medium text-gray-700"
              >Número de Ausentes</label
            >
            <div class="mt-1 relative rounded shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <UserMinusIcon class="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="ausentes"
                v-model="foata.ausentes"
                type="number"
                required
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label
              for="porcentajeAsistencia"
              class="block text-sm font-medium text-gray-700"
              >Porcentaje de Asistencia</label
            >
            <div class="mt-1 relative rounded shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <PercentIcon class="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="porcentajeAsistencia"
                :value="porcentajeAsistencia"
                type="text"
                readonly
                class="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded text-gray-500 sm:text-sm sm:leading-5"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Causas de Ausencias -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-800 flex items-center">
          Causas de Ausencias
        </h3>
        <TransitionGroup name="list" tag="div" class="space-y-2">
          <div
            v-for="(ausencia, index) in foata.causasAusencias"
            :key="index"
            class="flex space-x-2"
          >
            <Input
              v-model="ausencia.nombre"
              type="text"
              class="flex-1 px-3 py-2 border text-gray-500 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              placeholder="Nombre"
            />
            <Input
              v-model="ausencia.motivo"
              type="text"
              class="flex-1 px-3 py-2 border  text-gray-500 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              placeholder="Motivo"
            />
            <button
              @click="removeAusencia(index)"
              type="button"
              class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
            >
              <XIcon class="h-5 w-5" />
            </button>
          </div>
        </TransitionGroup>
        <button
          @click="addAusencia"
          type="button"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
        >
          <PlusIcon class="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-90" />
          Agregar Ausencia
        </button>
      </div>

      <!-- Datos del Tema Evaluado -->
      <div class="space-y-4">
        <div>
          <label for="temaTratado" class="block text-lg font-medium"
            >Tema Tratado</label
          >
          <div class="mt-1 relative rounded shadow-sm">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <FileTextIcon class="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="temaTratado"
              v-model="foata.temaTratado"
              type="text"
              required
              class="block w-full pl-10 pr-3 py-2  text-gray-500 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              placeholder="Título del tema"
            />
          </div>
        </div>
      </div>

      <!-- Principales Planteamientos -->
      <h3 class="text-lg font-medium  flex items-center">
        Principales Planteamientos
      </h3>
      <div class="rounded border">
        <table class="w-full">
          <thead>
            <tr class="border-b bg-muted/50">
              <th class="h-12 px-4 text-left align-middle font-medium">Participante</th>
              <th class="h-12 px-4 text-left align-middle font-medium">Comentario</th>
              <th class="h-12 px-4 text-left align-middle font-medium">Acciones</th>
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
                <Input
                  type="text"
                  v-model="planteamiento.participante"
                  class="w-full border-none text-gray-500 font-semibold bg-transparent focus:outline-none"
                  placeholder="Nombre"
                />
              </td>
              <td class="p-4 align-middle">
                <Input
                  type="text"
                  v-model="planteamiento.comentario"
                  class="w-full border-none  text-gray-500 font-semibold bg-transparent focus:outline-none"
                  placeholder="Comentario"
                />
              </td>
              <td class="p-4 align-middle">
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

      <div class="space-y-4">
        <button
          @click="addPlanteamiento"
          type="button"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
        >
          <PlusIcon class=" h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-90" />
          Agregar Planteamiento
        </button>
      </div>

      <!-- Valoración de la Reunión -->
      <div class="space-y-4">
        <div>
          <label for="resumenEvento" class="block text-xl font-medium "
            >Valoración de la Reunión</label
          >
          <div class="mt-1">
            <Textarea
              id="resumenEvento"
              v-model="foata.resumenEvento"
              rows="4"
              required
              class="shadow-md outline-1 text-gray-600 focus:ring-blue-500 focus:border-blue-500 block w-full md:text-md border-gray-300 rounded transition duration-150 ease-in-out"
              placeholder="Valoración de la calidad de la reunión"
            ></Textarea>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  Users2Icon,
  ClipboardListIcon,
  UsersIcon,
  UserMinusIcon,
  PercentIcon,
  AlertCircleIcon,
  XIcon,
  PlusIcon,
  ArrowRightIcon,
} from "lucide-vue-next";
import { FileTextIcon, TrashIcon, ArrowLeftIcon, CheckIcon } from "lucide-vue-next";
import Input from "../ui/Input/Input.vue";
import Textarea from "../ui/textarea/Textarea.vue";

const selectedNucleo = ref("indep");

const foata = ref({
  totalMilitantes: 10,
  ausentes: 0,
  causasAusencias: [],
  temaTratado: "",
  planteamientos: [],
  resumenEvento: "",
  firmas: [],
});

const porcentajeAsistencia = computed(() => {
  if (foata.value.totalMilitantes > 0) {
    const porcentaje =
      ((foata.value.totalMilitantes - foata.value.ausentes) /
        foata.value.totalMilitantes) *
      100;
    return porcentaje.toFixed(2) + "%";
  }
  return "0%";
});

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

const addFirma = () => {
  foata.value.firmas.push({ nombre: "" });
};

const removeFirma = (index) => {
  foata.value.firmas.splice(index, 1);
};

const prevPage = () => {
  // Aquí puedes manejar la navegación a la página anterior
  console.log("Volver a la página anterior");
};

const submitForm = () => {
  // Aquí puedes manejar el envío del formulario completo
  console.log("Formulario enviado:", foata.value);
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
