<template>
  <div class="min-h-screen p-6 bg-linear-to-b from-gray-50 to-white">
    <div
        class="max-w-7xl container p-6 shadow-md border rounded-lg border-gray-300"
    >
      <div class="space-x-4">
        <div class="space-y-2 text-center">
          <h2 class="font-bold text-2xl">{{ acta.name }} {{ acta.id }}</h2>
          <h3 class="font-semibold text-xl text-gray-500">PCC CUJAE</h3>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>1. Informacion General</AccordionTrigger>
            <AccordionContent>
              <div class="space-x-2">
                <div class="w-1/3 p-2">
                  <label
                      for="nucleo"
                      class="block text-md font-medium text-gray-700"
                  >Núcleo</label
                  >
                  <select
                      name="nucleo"
                      v-model="acta.core.name"
                      class="w-full px-1 py-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option
                        v-for="nucleo in cores"
                        :key="nucleo"
                        :value="nucleo"
                    >
                      {{ nucleo?.name }}
                    </option>
                  </select>
                </div>
                <!-- 2. Presidencia -->
                <div class="mt-4">
                  <label
                      for="secretario"
                      class="block text-md font-medium text-gray-700"
                  >Nombre del Secretario General</label
                  >
                  <Input
                      type="text"
                      id="secretario"
                      name="secretario"
                      v-model="acta.secretarioGeneral"
                      required
                      class="mt-1 block w-3/4 rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </div>

                <div class="mt-4">
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
                          v-model="acta.fecha"
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
                          v-model="acta.hora"
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
                          v-model="acta.lugar"
                          required
                          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>4. Desarrollo</AccordionTrigger>
            <AccordionContent class="p-2">
              <div class="">
                <label
                    for="chequeo"
                    class="block text-md font-medium text-gray-700"
                >1. Chequeo de acuerdos</label
                >
                <Textarea
                    id="chequeo"
                    name="chequeo"
                    v-model="acta.chequeo"
                    rows="4"
                    class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Chequeo de acuerdos"
                >
                </Textarea>
              </div>
              <div class="">
                <label
                    for="orient"
                    class="block text-md font-medium text-gray-700"
                >2. Orientaciones del Organismo Superior</label
                >
                <Textarea
                    id="orient"
                    name="orientaciones"
                    v-model="acta.orientaciones"
                    rows="4"
                    class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Orientaciones del Organismo Superior"
                ></Textarea>
              </div>
              <div>
                <label
                    for="analisis"
                    class="block text-md font-medium text-gray-700"
                >3. Análisis y discusiones</label
                >
                <Textarea
                    id="analisis"
                    name="analisis"
                    v-model="acta.analisis"
                    rows="4"
                    class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Análisis y discusiones"
                ></Textarea>
              </div>
              <div class="space-y-2">
                <label
                    for="observaciones"
                    class="block text-md font-medium text-gray-700"
                >
                  Observaciones generales
                </label>
                <Textarea
                    id="observaciones"
                    name="observaciones"
                    v-model="acta.observaciones"
                    rows="4"
                    class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                ></Textarea>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>5. Fechas</AccordionTrigger>
            <AccordionContent>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div class="w-3/4 space-y-2">
                  <label
                      for="proxima"
                      class="block text-md font-medium text-gray-700"
                  >
                    Próxima reunión
                  </label>
                  <Input
                      type="date"
                      required
                      id="proxima"
                      name="fechaProx"
                      v-model="acta.fechaProx"
                      class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div class="w-3/4 space-y-2">
                  <label
                      for="preparacion"
                      class="block text-md font-medium text-gray-700"
                  >
                    Preparación próxima reunión
                  </label>
                  <Input
                      type="date"
                      required
                      id="preparacion"
                      name="fechaPrep"
                      v-model="acta.fechaPrep"
                      class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div class="w-3/4 space-y-2">
                  <label
                      for="circulo"
                      class="block text-md font-medium text-gray-700"
                  >
                    Próximo círculo de estudios políticos
                  </label>
                  <Input
                      type="date"
                      required
                      id="circulo"
                      name="fechaCP"
                      v-model="acta.fechaCP"
                      class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div class="grid grid-cols-4 gap-4 m-4">
          <button class="p-2 rounded border">Cancelar</button>
          <button
              @click="update"
              class="p-2 rounded border bg-blue-600 hover:bg-blue-700 text-white"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "../ui/input/Input.vue";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import Textarea from "../ui/textarea/Textarea.vue";
import {actions} from "astro:actions";

const {cores, acta} = defineProps<{ cores: any[]; acta: any }>();

async function update() {
  try {
    return await actions.ordinary.updateMinute({id: acta.id, data: acta})
  } catch (e) {
    console.error(e);
  }
}
</script>
