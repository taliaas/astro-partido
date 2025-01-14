<template>
  <div class="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-white">
    <div class="max-w-7xl container p-6 shadow-md border rounded-lg border-gray-300">
      <div class="space-x-4">
        <div class="space-y-2 text-center">
          <h2 class="font-bold text-2xl">{{acta.name}} {{acta.id}} </h2>
          <h3 class="font-semibold text-xl text-gray-500">PCC CUJAE</h3>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>1. Informacion General</AccordionTrigger>
            <AccordionContent>
              <div class="space-x-2">
                <div class="w-1/3 p-2">
                  <label for="nucleo" class="block text-md font-medium text-gray-700">Núcleo</label>
                  <select name="nucleo" v-model="acta.core.name"
                          class="w-full px-1 py-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option v-for="nucleo in cores" :key="nucleo" :value="nucleo">
                      {{ nucleo?.name }}
                    </option>
                  </select>
                </div>

                <div class="mt-4">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="w-3/4">
                      <label for="fecha" class="block text-md font-medium text-gray-700">Fecha de la reunión</label>
                      <Input type="date" id="fecha" name="fecha" v-model="acta.fecha" required
                             class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" />
                    </div>
                    <div class="w-3/4">
                      <label for="hora" class="block text-md font-medium text-gray-700">Hora</label>
                      <Input type="time" id="hora" name="hora" v-model="acta.hora" required
                             class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" />
                    </div>
                    <div class="w-3/4">
                      <label for="lugar" class="block text-md font-medium text-gray-700">Lugar</label>
                      <Input type="text" id="lugar" name="lugar" v-model="acta.lugar" required
                             class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" />
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>2. Asistencia</AccordionTrigger>
            <AccordionContent>

            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>3. Tema evaluado en la reunión</AccordionTrigger>
            <AccordionContent>
              <div class="p-2 outline-none">
                <Textarea
                    id="tema"
                    name="tema"
                    v-model="acta.tema"
                    rows="2"
                    required
                    class="text-gray-800 focus:outline-none ring-transparent block w-full md:text-md border-gray-300 rounded transition duration-150 ease-in-out"
                ></Textarea>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>4. Principales planteamientos </AccordionTrigger>
            <AccordionContent>
              <div class="p-2 outline-none">
                <Textarea
                    id="planteamientos"
                    name="planteamientos"
                    v-model="acta.planteamientos"
                    rows="4"
                    required
                    class="text-gray-800 focus:outline-none ring-transparent block w-full md:text-md border-gray-300 rounded transition duration-150 ease-in-out"
                ></Textarea>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>5. Valoración </AccordionTrigger>
            <AccordionContent>
              <div class="p-2">
                <Textarea
                    id="valoracion"
                    name="valoracion"
                    v-model="acta.valoracion"
                    rows="4"
                    required
                    class="text-gray-800 focus:outline-none ring-transparent block w-full md:text-md border-gray-300 rounded transition duration-150 ease-in-out"
                ></Textarea>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>5. Firmas </AccordionTrigger>
            <AccordionContent>
              <div class="p-2">
                  <label
                  for="orientador" class="block text-md font-medium w-3/4 my-2 text-gray-700">Nombre del orientador</label>
                  <input type="text" v-model="acta.name_orientador"
                         class="w-2/5 border text-gray-500 border-gray-300 p-2 rounded focus:outline-none"
                  />
                  <label
                    for="secretario"
                    class="block text-md font-medium my-2 text-gray-700">Nombre del Secretario</label>
                  <input type="text" v-model="acta.name_secretario"
                         class="border text-gray-500 border-gray-300 w-2/5 p-2 rounded focus:outline-none"
                  />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div class="grid grid-cols-5 gap-4 m-4">
          <button class="p-2 rounded border col-start-4">Cancelar</button>
          <button @click="update" class="p-2 rounded border col-start-5 bg-blue-600 hover:bg-blue-700 text-white">Guardar cambios</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "../ui/input/Input.vue";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import Textarea from "../ui/textarea/Textarea.vue";
import {Label} from "@/components/ui/label";
import PoliticalService from "@/services/PoliticalService.ts";

const { cores, acta } = defineProps<{ cores: any[], acta: any }>()

async function update () {
  const service = new PoliticalService()
  try{
    return await service.updateMinute(acta.id, acta)
  }
  catch (e) {
    console.error(e);
  }
}
</script>