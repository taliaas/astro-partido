<template>
  <div class="space-y-2">
    <!-- 2. Núcleo -->
    <div class="w-1/3">
      <label for="nucleo" class="block text-md font-medium text-gray-700">Núcleo</label>
      <select
        name="nucleo"
        v-model="formData.nucleo"
        class="w-full px-1 py-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        :class="{ 'border-red-500': errors.nucleo }"
      >
        <option v-for="nucleo in cores" :key="nucleo" :value="nucleo.id">
          {{ nucleo?.name }}
        </option>
      </select>
      <span v-if="errors.nucleo" class="text-red-500 text-sm">{{ errors.nucleo }}</span>
    </div>

    <div class="mt-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="w-3/4">
          <label class="block text-md font-medium text-gray-700">Fecha de la reunión</label>
          <Input
            type="date"
            id="fecha"
            name="fecha"
            v-model="formData.fecha"
            required
            :class="{ 'border-red-500': errors.fecha }"
            class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <span v-if="errors.fecha" class="text-red-500 text-sm">{{ errors.fecha }}</span>
        </div>
        <div class="w-3/4">
          <label class="block text-md font-medium text-gray-700">Hora</label>
          <Input
            type="time"
            id="hora"
            name="hora"
            v-model="formData.hora"
            required
            :class="{ 'border-red-500': errors.hora }"
            class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <span v-if="errors.hora" class="text-red-500 text-sm">{{ errors.hora }}</span>
        </div>
        <div class="w-3/4">
          <label class="block text-md font-medium text-gray-700">Lugar</label>
          <Input
            type="text"
            id="lugar"
            name="lugar"
            v-model="formData.lugar"
            required
            :class="{ 'border-red-500': errors.lugar }"
            class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <span v-if="errors.lugar" class="text-red-500 text-sm">{{ errors.lugar }}</span>
        </div>
      </div>
    </div>

    <!-- 3. Invitados -->
    <div class="rounded mt-3">
      <div class="flex justify-between">
        <label class="block my-2 text-md font-medium text-gray-700">Invitados y Participantes</label>
        <Button
          @click="addPerson"
          variant="outline"
          class="group inline-flex items-center m-3 justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4"
        >
          <PlusIcon class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
          Agregar
        </Button>
      </div>
      <table class="min-w-full divide-y rounded-md divide-gray-200 border border-gray-300">
        <thead class="bg-gray-100 rounded">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre y Apellidos</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in person" :key="index" class="border-b">
            <td class="p-4 align-middle">{{ index + 1 }}</td>
            <td class="p-4 align-middle">
              <input
                type="text"
                v-model="item.nombre_apellidos"
                :class="{ 'border-red-500': errors.invitados?.[index]?.nombre_apellidos }"
                class="w-full px-2 bg-transparent focus:outline-none"
                placeholder="Nombre"
                :name="'invitados.' + index + '.nombre_apellidos'"
              />
              <span v-if="errors.invitados?.[index]?.nombre_apellidos" class="text-red-500 text-sm">
                {{ errors.invitados[index].nombre_apellidos }}
              </span>
            </td>
            <td class="p-4 align-middle">
              <select
                v-model="item.cargo"
                :class="{ 'border-red-500': errors.invitados?.[index]?.cargo }"
                class="px-2 bg-transparent focus:outline-none"
                :name="'invitados.' + index + '.cargo'"
              >
                <option v-for="cargo in cargos" :key="cargo" :value="cargo">{{ cargo }}</option>
              </select>
              <span v-if="errors.invitados?.[index]?.cargo" class="text-red-500 text-sm">
                {{ errors.invitados[index].cargo }}
              </span>
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
      <div v-if="person.length === 0" class="text-center py-16 border border-gray-300 rounded">
        <div class="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-50 flex items-center justify-center">
          <SearchIcon class="h-6 w-6" />
        </div>
        <h3 class="mt-4 text-sm font-medium text-gray-500">No hay invitados o participantes</h3>
      </div>
    </div>

    <!-- 4. Relación de Asistencia -->
    <div class="overflow-x-auto mt-4">
      <label class="block mb-3 text-md font-medium text-gray-700">Relación de Militantes del Núcleo</label>
      <table class="min-w-full divide-y rounded divide-gray-200 border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th v-for="header in headers" :key="header" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(militante, index) in militantes" :key="index">
            <td class="p-6 text-left whitespace-nowrap">
              <input class="hidden" :name="'militante.' + index + '.id'" :value="militante.id" />
              {{ militante.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ militante.firstname }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ militante.lastname }}</td>
            <td class="py-4 whitespace-nowrap">
              <select
                v-model="estado[index]"
                :name="'militante.' + index + '.estado'"
                :class="{ 'border-red-500': errors.militantes?.[index]?.estado }"
                class="px-2 py-2 border-none rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="presente">Presente</option>
                <option value="virtual">Virtual</option>
                <option value="ausente">Ausente</option>
              </select>
              <span v-if="errors.militantes?.[index]?.estado" class="text-red-500 text-sm">
                {{ errors.militantes[index].estado }}
              </span>
            </td>
            <td class="px-4 whitespace-nowrap" v-if="estado[index] === 'ausente'">
              <select
                v-model="militante.selectedCausa"
                :name="'militante.' + index + '.reason'"
                :class="{ 'border-red-500': errors.militantes?.[index]?.reason }"
                class="w-full p-1 border-none rounded bg-white focus:outline-none ring-2 ring-primary-500"
              >
                <option v-for="causa in absenceReasons" :key="causa.id" :value="causa.label" class="rounded">
                  {{ causa.label }}
                </option>
              </select>
              <span v-if="errors.militantes?.[index]?.reason" class="text-red-500 text-sm">
                {{ errors.militantes[index].reason }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Empty State -->
      <div v-if="militantes.length === 0" class="text-center py-16 border border-gray-300 rounded">
        <div class="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-50 flex items-center justify-center">
          <SearchIcon class="h-6 w-6" />
        </div>
        <h3 class="mt-4 text-sm font-medium text-gray-500">No se encontraron militantes en este núcleo</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import Input from "../ui/input/Input.vue"
import { PlusIcon, SearchIcon, TrashIcon } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import MilitanteService from "@/services/MilitanteService"
import { Cargo } from "@/enum/Cargo"
import { reunionSchema } from "@/schemas/firstStep"

defineEmits(["update"])
const selectedNucleo = ref(null)
const { cores } = defineProps<{ cores: any[] }>()
const errors = ref({})

const formData = ref({
  nucleo: "",
  fecha: "",
  hora: "",
  lugar: "",
  invitados: [],
  militantes: []
})

const person = ref([{ nombre_apellidos: "", cargo: "" }])
const estado = ref([])

const cargos: Cargo[] = [
  Cargo.inv_ujc,
  Cargo.no_mili,
  Cargo.org_sup,
  Cargo.trab,
  Cargo.s_sindic,
  Cargo.secret_general,
  Cargo.secretariado,
]

const militantes = ref([])
const headers = ["No.", "Nombre", "Apellidos", "Estado", "Causa"]
const absenceReasons = ref([
  { id: 2, label: "Enfermedad" },
  { id: 3, label: "Extranjero" },
  { id: 4, label: "Trabajo" },
  { id: 5, label: "Fuera de Provincia" },
  { id: 6, label: "Vacaciones" },
  { id: 7, label: "Lic. de Maternidad" },
  { id: 8, label: "Problemas Personales" },
  { id: 9, label: "Problemas Familiares" },
  { id: 10, label: "Movilizado" },
  { id: 11, label: "Injustificado" },
  { id: 12, label: "Otros" },
])

watch(() => formData.value, (newValue) => {
  try {
    reunionSchema.parse(newValue)
    errors.value = {}
  } catch (err) {
    errors.value = err.formErrors?.fieldErrors || {}
  }
}, { deep: true })

async function getMilitantes() {
  const service = new MilitanteService()
  try {
    const core = selectedNucleo.value as any
    militantes.value = await service.getMilitantesByCore(core ?? 1)
  } catch (e) {
    console.error(e)
  }
}

const addPerson = () => {
  person.value.push({ nombre_apellidos: "", cargo: "" })
}

const removeInvitados = (index: number) => {
  person.value.splice(index, 1)
}

watch(selectedNucleo, () => {
  getMilitantes()
})

onMounted(() => {
  getMilitantes()
})
</script>
