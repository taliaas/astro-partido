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
                <!-- 2. Presidencia -->
                <div class="mt-4">
                  <label for="secretario" class="block text-md font-medium text-gray-700">Nombre del Secretario General</label>
                  <Input type="text" id="secretario" name="secretario" v-model="acta.secretarioGeneral" required
                         class="mt-1 block w-3/4 rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" />
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
            <AccordionTrigger>3. Orden del día</AccordionTrigger>
            <AccordionContent>
              <div class="rounded border">
                <table class="w-full">
                  <thead>
                  <tr class="border-b bg-muted/50">
                    <th class="h-12 w-[100px] px-4 text-left align-middle font-medium">No.</th>
                    <th class="h-12 px-4 text-left align-middle font-medium">Descripción</th>
                    <th class="h-12 w-[100px] px-4 align-middle">
                      <Button @click="addAgendaItem" variant="outline"
                              class="group inline-flex items-center justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4">
                        <PlusIcon class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
                        Agregar
                      </Button></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, index) in agendaItems" :key="index" class="border-b">
                    <td class="p-4 align-middle font-medium">{{ index + 1 }}</td>
                    <td class="p-4 align-middle">
                      <input type="text" v-model="item.description" class="w-full bg-transparent focus:outline-none"
                             placeholder="Descripción" />
                    </td>
                    <td class="p-4 align-middle">
                      <button @click="removeAgendaItem(index)"
                              class="text-destructive hover:text-destructive/90 transition-colors duration-200">
                        <TrashIcon class="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>4. Desarrollo</AccordionTrigger>
            <AccordionContent>

            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>5. Fechas </AccordionTrigger>
            <AccordionContent>

            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div class="grid grid-cols-4 gap-4 m-4">
          <button class="p-2 rounded border">Cancelar</button>
          <button @click="update" class="p-2 rounded border bg-blue-600 hover:bg-blue-700 text-white">Guardar cambios</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "../ui/input/Input.vue";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import {PlusIcon, TrashIcon} from "lucide-vue-next";
import OrdinaryService from "@/services/OrdinaryService.ts";

const { cores, acta } = defineProps<{ cores: any[], acta: any }>()

async function update () {
  const service = new OrdinaryService()
  try{
    return await service.updateMinute(acta.id, acta)
  }
  catch (e) {
    console.error(e);
  }
}
</script>