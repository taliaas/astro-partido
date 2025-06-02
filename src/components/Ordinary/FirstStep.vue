<template>
  <div class="space-y-8">
    <!-- 2. Núcleo -->
    <FormField name="nucleo" v-slot="{ componentField }">
      <FormItem class="w-1/3">
        <FormLabel> Núcleo </FormLabel>
        <FormControl>
          <select
            :="componentField"
            class="w-full px-1 py-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option v-for="nucleo in cores" :key="nucleo" :value="nucleo.id">
              {{ nucleo?.name }}
            </option>
          </select></FormControl
        >
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="mt-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField name="fecha" v-slot="{ componentField }">
          <FormItem class="w-3/4">
            <FormLabel>Fecha de la reunión</FormLabel>
            <FormControl>
              <Input
                type="date"
                id="fecha"
                required
                v-bind="componentField"
                class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="hora" v-slot="{ componentField }">
          <FormItem class="w-3/4">
            <FormLabel>Hora</FormLabel>
            <FormControl>
              <Input
                type="time"
                id="hora"
                required
                v-bind="componentField"
                class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="lugar" v-slot="{ componentField }">
          <FormItem class="w-3/4">
            <FormLabel>Lugar</FormLabel>
            <FormControl>
              <Input
                type="text"
                required
                v-bind="componentField"
                class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>

    <!-- 3. Invitados -->
    <div class="rounded">
      <div class="flex justify-between">
        <label class="block my-2 text-md font-medium text-gray-700"
          >Invitados y Participantes</label
        >
        <Button
          @click="addPerson"
          variant="outline"
          class="group inline-flex items-center m-3 justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4"
        >
          <PlusIcon
            class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90"
          />
          Agregar
        </Button>
      </div>
      <table class="min-w-full divide-y rounded-md divide-gray-200">
        <thead class="bg-gray-100 rounded">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              No.
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nombre y Apellidos
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Cargo
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in person" :key="index" class="border-b">
            <td class="p-4 align-middle">{{ index + 1 }}</td>
            <td class="p-4 align-middle">
              <input
                type="text"
                v-model="item.nombre"
                class="w-full px-2 bg-transparent focus:outline-none"
                placeholder="Nombre"
                :name="'invitados.' + index + '.nombre_apellidos'"
              />
            </td>
            <td class="p-4 align-middle">
              <select
                type="text"
                v-model="item.cargo"
                class="px-2 bg-transparent focus:outline-none"
                :name="'invitados.' + index + '.cargo'"
              >
                <option v-for="cargo in cargos" :key="cargo" :value="cargo">
                  {{ cargo }}
                </option>
              </select>
            </td>
            <td class="p-4 text-center align-middle">
              <button
                @click="removeInvitados(index)"
                type="button"
                class="text-destructive hover:text-destructive/90"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Empty State -->
      <div
        v-if="person.length === 0"
        class="text-center py-16 border border-gray-300 rounded"
      >
        <div
          class="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-50 flex items-center justify-center"
        >
          <SearchIcon class="h-6 w-6" />
        </div>
        <h3 class="font-medium text-gray-500">
          No hay invitados o participantes
        </h3>
      </div>
    </div>

    <!-- 4. Relación de Asistencia -->
    <div class="overflow-x-auto mt-4 space-y-4">
      <label class="block mb-3 text-md font-medium text-gray-700"
        >Relación de Militantes del Núcleo</label
      >
      <table class="min-w-full divide-y rounded divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th
              v-for="header in headers"
              :key="header"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(militante, index) in militantes" :key="index">
            <td class="p-6 text-left whitespace-nowrap">
              <input
                class="hidden"
                :name="'militante.' + index + '.id'"
                :value="militante.id"
              />
              {{ index + 1 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ militante.firstname }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ militante.lastname }}
            </td>
            <td class="py-4 whitespace-nowrap">
              <select
                v-model="estado[index]"
                :name="'militante.' + index + '.estado'"
                class="px-2 py-2 border-none rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="presente">Presente</option>
                <option value="virtual">Virtual</option>
                <option value="ausente">Ausente</option>
              </select>
            </td>
            <td
              class="w-1/5 px-6 py-4 whitespace-nowrap"
              v-if="estado[index] === 'ausente'"
            >
              <select
                v-model="militante.selectedCausa"
                :name="'militante.' + index + '.reason'"
                class="px-2 py-2 rounded bg-white"
              >
                <option
                  v-for="causa in absenceReasons"
                  :key="causa"
                  :value="causa"
                  class="rounded"
                >
                  {{ causa }}
                </option>
              </select>
            </td>
            <td class="w-1/5 px-6 py-4 whitespace-nowrap" v-else>
              <!-- Celda vacía para mantener la estructura cuando no es ausente -->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Empty State -->
      <div
        v-if="militantes.length === 0"
        class="text-center py-16 border border-gray-300 rounded"
      >
        <div
          class="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-50 flex items-center justify-center"
        >
          <SearchIcon class="h-6 w-6" />
        </div>
        <h3 class="mt-4 text-sm font-medium text-gray-500">
          No se encontraron militantes en este núcleo
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { reactive } from "vue";
import Input from "../ui/input/Input.vue";
import { PlusIcon, SearchIcon, TrashIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import MilitantService from "@/services/MilitantService.ts";
import { absenceReasons, cargos } from "@/enum/absenceReasons.ts";
import { FormField } from "@/components/ui/form";
import FormItem from "@/components/ui/form/FormItem.vue";
import FormLabel from "@/components/ui/form/FormLabel.vue";
import FormControl from "@/components/ui/form/FormControl.vue";
import FormMessage from "@/components/ui/form/FormMessage.vue";

defineEmits(["update"]);

const { cores } = defineProps<{ cores: any[] }>();
const selectedNucleo = ref(cores[0]?.id);
const headers = ["No.", "Nombre", "Apellidos", "Estado", "Causa"];
const formData = reactive({
  fecha: "",
  hora: "",
  lugar: "",
  nucleo: "",
});

const person = ref([{ nombre: "", cargo: "" }]);
const militantes = ref<
  { id: any; firstname: string; lastname: string; selectedCausa?: string }[]
>([]);
const estado = reactive([]);

async function getMilitantes() {
  const service = new MilitantService();
  try {
    const core = selectedNucleo.value as any;
    const result = await service.getMilitantes(core ?? 1);
    militantes.value = result.map((m: any) => ({
      ...m,
      selectedCausa: "",
    }));
  } catch (e) {
    console.error(e);
  }
}

const addPerson = () => {
  person.value.push({ nombre: "", cargo: "" });
};

const removeInvitados = (index: any) => {
  person.value.splice(index, 1);
};

watch(selectedNucleo, () => {
  getMilitantes();
});

onMounted(() => {
  getMilitantes();
});
</script>
