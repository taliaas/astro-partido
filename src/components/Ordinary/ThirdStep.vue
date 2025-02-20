<template>
  <!-- Acuerdos Table -->
  <div class="space-y-4 my-4">
    <div class="flex justify-between">
      <label for="agreements" class="block text-md font-medium text-gray-700">Acuerdos</label>
      <div class="flex justify-end">
        <Button
          type="button"
          @click="addAgreement"
          variant="outline"
          class="group inline-flex items-center justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4"
        >
          <PlusIcon class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
          Agregar acuerdo
        </Button>
      </div>
    </div>

    <div class="rounded-md border">
      <table class="w-full">
        <thead>
          <tr class="border-b bg-muted/50">
            <th class="h-12 w-[100px] px-4 text-left align-middle font-medium">No.</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Descripción</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Responsable</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Fecha</th>
            <th class="h-12 w-[100px] px-4 align-middle"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in formData.agreements" :key="index" class="border-b">
            <td class="p-4 align-middle font-medium">{{ index + 1 }}</td>
            <td class="p-4 align-middle">
              <input
                type="text"
                v-model="item.description"
                :class="{ 'border-red-500': errors.agreements?.[index]?.description }"
                class="w-full bg-transparent focus:outline-none"
                placeholder="Descripción"
                :name="'agreements.' + index + '.description'"
              />
              <span v-if="errors.agreements?.[index]?.description" class="text-red-500 text-sm">
                {{ errors.agreements[index].description }}
              </span>
            </td>
            <td class="p-4 align-middle">
              <input
                type="text"
                v-model="item.responsible"
                :class="{ 'border-red-500': errors.agreements?.[index]?.responsible }"
                class="w-full bg-transparent focus:outline-none"
                placeholder="Responsable"
                :name="'agreements.' + index + '.responsible'"
              />
              <span v-if="errors.agreements?.[index]?.responsible" class="text-red-500 text-sm">
                {{ errors.agreements[index].responsible }}
              </span>
            </td>
            <td class="p-4 align-middle">
              <Input
                type="date"
                v-model="item.date"
                :class="{ 'border-red-500': errors.agreements?.[index]?.date }"
                class="w-1/2 border-none rounded bg-transparent focus:outline-none"
                :name="'agreements.' + index + '.date'"
              />
              <span v-if="errors.agreements?.[index]?.date" class="text-red-500 text-sm">
                {{ errors.agreements[index].date }}
              </span>
            </td>
            <td class="p-4 align-middle">
              <button
                @click="removeAgreement(index)"
                class="text-destructive hover:text-destructive/90"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Salidas al Extranjero Table -->
  <div class="space-y-4 my-4">
    <div class="flex justify-between">
      <label for="salidas" class="block text-md font-medium text-gray-700">Salidas al Extranjero</label>
      <Button
        @click="addTravel"
        variant="outline"
        class="group inline-flex items-center justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4"
      >
        <PlusIcon class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
        Agregar salida
      </Button>
    </div>
    <div class="rounded-md border">
      <table class="w-full">
        <thead>
          <tr class="border-b bg-muted/50">
            <th class="h-12 px-4 text-left align-middle font-medium">Nombre</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Motivo</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Destino</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Fecha de ida</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Fecha de regreso</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Estado</th>
            <th class="h-12 w-[100px] px-4 align-middle"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in formData.travels" :key="index" class="border-b">
            <td class="p-4 align-middle">
              <input
                type="text"
                v-model="item.name"
                :class="{ 'border-red-500': errors.travels?.[index]?.name }"
                class="w-full bg-transparent focus:outline-none"
                placeholder="Nombre"
                :name="'travels.' + index + '.name'"
              />
              <span v-if="errors.travels?.[index]?.name" class="text-red-500 text-sm">
                {{ errors.travels[index].name }}
              </span>
            </td>
            <td class="p-4 align-middle">
              <input
                type="text"
                v-model="item.reason"
                :class="{ 'border-red-500': errors.travels?.[index]?.reason }"
                class="w-full bg-transparent focus:outline-none"
                placeholder="Motivo"
                :name="'travels.' + index + '.reason'"
              />
              <span v-if="errors.travels?.[index]?.reason" class="text-red-500 text-sm">
                {{ errors.travels[index].reason }}
              </span>
            </td>
            <td class="p-4 align-middle">
              <input
                type="text"
                v-model="item.destination"
                :class="{ 'border-red-500': errors.travels?.[index]?.destination }"
                class="w-full bg-transparent focus:outline-none"
                placeholder="Destino"
                :name="'travels.' + index + '.destination'"
              />
              <span v-if="errors.travels?.[index]?.destination" class="text-red-500 text-sm">
                {{ errors.travels[index].destination }}
              </span>
            </td>
            <td class="p-4 align-middle">
              <input
                type="date"
                v-model="item.dates.ida"
                :class="{ 'border-red-500': errors.travels?.[index]?.dates?.ida }"
                class="w-full bg-transparent focus:outline-none"
                :name="'travels.' + index + '.dates.ida'"
              />
              <span v-if="errors.travels?.[index]?.dates?.ida" class="text-red-500 text-sm">
                {{ errors.travels[index].dates.ida }}
              </span>
            </td>
            <td class="p-4 align-middle">
              <input
                type="date"
                v-model="item.dates.regreso"
                :class="{ 'border-red-500': errors.travels?.[index]?.dates?.regreso }"
                class="w-full bg-transparent focus:outline-none"
                :name="'travels.' + index + '.dates.regreso'"
              />
              <span v-if="errors.travels?.[index]?.dates?.regreso" class="text-red-500 text-sm">
                {{ errors.travels[index].dates.regreso }}
              </span>
            </td>
            <td class="p-4 align-middle">
              <select
                v-model="item.status"
                :class="{ 'border-red-500': errors.travels?.[index]?.status }"
                class="w-full bg-transparent focus:outline-none rounded"
                :name="'travels.' + index + '.status'"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </td>
            <td class="p-4 align-middle">
              <button
                @click="removeTravel(index)"
                class="text-destructive hover:text-destructive/90"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Observaciones y Firmas -->
  <section class="space-y-4 my-4">
    <div class="space-y-2">
      <label for="observaciones" class="block text-md font-medium text-gray-700">Observaciones generales</label>
      <Textarea
        id="observaciones"
        name="observaciones"
        v-model="formData.observaciones"
        :class="{ 'border-red-500': errors.observaciones }"
        rows="4"
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
      <span v-if="errors.observaciones" class="text-red-500 text-sm">{{ errors.observaciones }}</span>
    </div>
  </section>

  <!-- Fechas Relevantes -->
  <section class="space-y-4 border-t">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div class="w-3/4 space-y-2">
        <label for="proxima" class="block text-md font-medium text-gray-700">Próxima reunión</label>
        <Input
          type="date"
          id="proxima"
          name="fechaProx"
          v-model="formData.proximaReunion"
          :class="{ 'border-red-500': errors.proximaReunion }"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <span v-if="errors.proximaReunion" class="text-red-500 text-sm">{{ errors.proximaReunion }}</span>
      </div>
      <div class="w-3/4 space-y-2">
        <label for="preparacion" class="block text-md font-medium text-gray-700">Preparación próxima reunión</label>
        <Input
          type="date"
          id="preparacion"
          name="fechaPrep"
          v-model="formData.preparacionReunion"
          :class="{ 'border-red-500': errors.preparacionReunion }"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <span v-if="errors.preparacionReunion" class="text-red-500 text-sm">{{ errors.preparacionReunion }}</span>
      </div>
      <div class="w-3/4 space-y-2">
        <label for="circulo" class="block text-md font-medium text-gray-700">Próximo círculo de estudios políticos</label>
        <Input
          type="date"
          id="circulo"
          name="fechaCP"
          v-model="formData.circuloEstudios"
          :class="{ 'border-red-500': errors.circuloEstudios }"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <span v-if="errors.circuloEstudios" class="text-red-500 text-sm">{{ errors.circuloEstudios }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import Textarea from "../ui/textarea/Textarea.vue"
import Input from "../ui/input/Input.vue"
import { Button } from "@/components/ui/button"
import { PlusIcon, TrashIcon } from "lucide-vue-next"
import { thirdStepSchema } from "@/schemas/thirdStep"

const errors = ref({})

const formData = ref({
  agreements: [{ description: "", responsible: "", date: "" }],
  travels: [{
    name: "",
    reason: "",
    destination: "",
    dates: {
      ida: "",
      regreso: ""
    },
    status: "Pendiente"
  }],
  observaciones: "",
  proximaReunion: "",
  preparacionReunion: "",
  circuloEstudios: ""
})

watch(() => formData.value, (newValue) => {
  try {
    thirdStepSchema.parse(newValue)
    errors.value = {}
  } catch (err) {
    errors.value = err.formErrors?.fieldErrors || {}
  }
}, { deep: true })

const addAgreement = () => {
  formData.value.agreements.push({ description: "", responsible: "", date: "" })
}

const removeAgreement = (index: number) => {
  formData.value.agreements.splice(index, 1)
}

const addTravel = () => {
  formData.value.travels.push({
    name: "",
    reason: "",
    destination: "",
    dates: {
      ida: "",
      regreso: ""
    },
    status: "Pendiente"
  })
}

const removeTravel = (index: number) => {
  formData.value.travels.splice(index, 1)
}

defineEmits(["update"])
</script>
