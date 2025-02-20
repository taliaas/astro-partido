<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <h3 class="text-lg font-medium">Orden del Día</h3>
      <div>
        <Button
          @click="addAgendaItem"
          type="button"
          variant="outline"
          class="group inline-flex items-center justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4"
        >
          <PlusIcon
            class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90"
          />
          Agregar punto
        </Button>
      </div>
    </div>
    <div class="rounded border">
      <table class="w-full">
        <thead>
          <tr class="border-b bg-muted/50">
            <th class="h-12 w-[100px] px-4 text-left align-middle font-medium">No.</th>
            <th class="h-12 px-4 text-left align-middle font-medium">Descripción</th>
            <th class="h-12 w-[100px] px-4 align-middle"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in formData.order" :key="index" class="border-b">
            <td class="p-4 align-middle font-medium">{{ index + 1 }}</td>
            <td class="p-4 align-middle">
              <input
                type="text"
                v-model="item.description"
                :class="{ 'border-red-500': errors.order?.[index]?.description }"
                class="w-full bg-transparent focus:outline-none"
                :name="'order.' + index"
                placeholder="Descripción"
              />
              <span v-if="errors.order?.[index]?.description" class="text-red-500 text-sm">
                {{ errors.order[index].description }}
              </span>
            </td>
            <td class="p-4 align-middle">
              <button
                @click="removeAgendaItem(index)"
                class="text-destructive hover:text-destructive/90 transition-colors duration-200"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="space-y-4">
    <h2 class="text-lg mt-8 mb-4 font-bold">Desarrollo</h2>
    <div>
      <label for="chequeo" class="block text-md font-medium text-gray-700">
        1. Chequeo de acuerdos
      </label>
      <Textarea
        id="chequeo"
        name="chequeo"
        v-model="formData.chequeo"
        :class="{ 'border-red-500': errors.chequeo }"
        rows="4"
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        placeholder="Chequeo de acuerdos"
      />
      <span v-if="errors.chequeo" class="text-red-500 text-sm">{{ errors.chequeo }}</span>
    </div>

    <div>
      <label for="orient" class="block text-md font-medium text-gray-700">
        2. Orientaciones del Organismo Superior
      </label>
      <Textarea
        id="orient"
        name="orientaciones"
        v-model="formData.orientaciones"
        :class="{ 'border-red-500': errors.orientaciones }"
        rows="6"
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        placeholder="Orientaciones del Organismo Superior"
      />
      <span v-if="errors.orientaciones" class="text-red-500 text-sm">{{ errors.orientaciones }}</span>
    </div>

    <div>
      <label for="analisis" class="block text-md font-medium text-gray-700">
        3. Análisis y discusiones
      </label>
      <Textarea
        id="analisis"
        name="analisis"
        v-model="formData.analisis"
        :class="{ 'border-red-500': errors.analisis }"
        rows="6"
        class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        placeholder="Análisis y discusiones"
      />
      <span v-if="errors.analisis" class="text-red-500 text-sm">{{ errors.analisis }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { PlusIcon, TrashIcon } from "lucide-vue-next"
import { Button } from "../ui/button"
import Textarea from "../ui/textarea/Textarea.vue"
import { secondStepSchema } from "@/schemas/secondStep"
import { Input } from "../ui/input";
import { reactive, ref } from "vue"; 

const errors = ref({})

const formData = ref({
  order: [{ description: "" }],
  orientaciones: "",
  chequeo: "",
  analisis: "",
})

watch(() => formData.value, (newValue) => {
  try {
    secondStepSchema.parse(newValue)
    errors.value = {}
  } catch (err) {
    errors.value = err.formErrors?.fieldErrors || {}
  }
}, { deep: true })

const addAgendaItem = () => {
  formData.value.order.push({ description: "" })
}

const removeAgendaItem = (index: number) => {
  formData.value.order.splice(index, 1)
}

defineEmits(["update"])
</script>
