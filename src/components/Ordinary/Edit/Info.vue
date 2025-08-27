<template>
  <div class="min-h-screen p-6 bg-linear-to-b from-gray-50 to-white">
    <div class="max-w-7xl mx-auto relative ">
      <form class="space-y-4">
        <div class="space-y-2 text-center">
          <h2 class="font-bold text-2xl">{{ acta.name }} {{ acta.id }}</h2>
          <h3 class="font-semibold text-xl text-gray-500">PCC CUJAE</h3>
        </div>
        <!-- 1. Información general -->
        <div class="space-y-2" v-if="currentStep === 1" >
          <h2 class="font-semibold text-2xl">Información general</h2>
          <div class="space-y-4">
            <div class="flex">
              <div class="w-1/3 space-y-1.5">
                <Label
                  for="nucleo"
                  class="block text-md font-medium text-gray-700"
                  >Núcleo</Label
                >
                <Select
                  name="nucleo"
                  v-model="acta.core.name"
                  class="w-3/4 px-1 py-2"
                >
                  <SelectTrigger class="w-2/3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        v-for="nucleo in cores"
                        :key="nucleo.id"
                        :value="nucleo.name"
                        >{{ nucleo.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div class="w-1/3 space-y-1.5">
                <Label
                  for="secretario"
                  class="block text-md font-medium text-gray-700"
                  >Nombre del Secretario General</Label
                >
                <Input
                  type="text"
                  id="secretario"
                  name="secretario"
                  v-model="acta.secretarioGeneral"
                  required
                  class="block w-3/4"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="w-3/4">
                <Label
                  for="fecha"
                  class="block text-md font-medium text-gray-700"
                  >Fecha de la reunión</Label
                >
                <Input
                  type="date"
                  id="fecha"
                  name="fecha"
                  v-model="acta.fecha"
                  required
                  class="mt-1 block w-full rounded shadow-sm"
                />
              </div>
              <div class="w-3/4">
                <Label
                  for="hora"
                  class="block text-md font-medium text-gray-700"
                  >Hora</Label
                >
                <Input
                  type="time"
                  id="hora"
                  name="hora"
                  v-model="acta.hora"
                  required
                  class="mt-1 block w-full rounded shadow-sm"
                />
              </div>
              <div class="w-3/4">
                <Label
                  for="lugar"
                  class="block text-md font-medium text-gray-700"
                  >Lugar</Label
                >
                <Input
                  type="text"
                  id="lugar"
                  name="lugar"
                  v-model="acta.lugar"
                  required
                  class="mt-1 block w-full rounded shadow-sm"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="w-3/4 space-y-2">
                <Label
                  for="proxima"
                  class="block text-md font-medium text-gray-700"
                >
                  Próxima reunión
                </Label>
                <Input
                  type="date"
                  required
                  id="proxima"
                  name="fechaProx"
                  v-model="acta.fechaProx"
                  class="mt-1 block w-full rounded shadow-sm focus:border-indigo-300 -indigo-200 -opacity-50"
                />
              </div>
              <div class="w-3/4 space-y-2">
                <Label
                  for="preparacion"
                  class="block text-md font-medium text-gray-700"
                >
                  Preparación próxima reunión
                </Label>
                <Input
                  type="date"
                  required
                  id="preparacion"
                  name="fechaPrep"
                  v-model="acta.fechaPrep"
                  class="mt-1 block w-full rounded shadow-sm focus:border-indigo-300 -indigo-200 -opacity-50"
                />
              </div>
              <div class="w-3/4 space-y-2">
                <Label
                  for="circulo"
                  class="block text-md font-medium text-gray-700"
                >
                  Próximo círculo de estudios políticos
                </Label>
                <Input
                  type="date"
                  required
                  id="circulo"
                  name="fechaCP"
                  v-model="acta.fechaCP"
                  class="mt-1 block w-full rounded shadow-sm focus:border-indigo-300 -indigo-200 -opacity-50"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 2. Asistencia -->
        <div v-if="currentStep === 2">
          <h2 class="font-semibold text-2xl">Asistencia</h2>
          <div class="space-y-2">
            <Label for="order" class="block text-md font-medium text-gray-700"
              >Ausentes</Label
            >
          </div>
          <div class="space-y-2">
            <Label for="order" class="block text-md font-medium text-gray-700"
              >Invitados</Label
            >
          </div>
        </div>
        <!-- 3. Desarrollo -->
        <div class="space-y-2" v-if="currentStep === 3">
          <h2 class="font-semibold text-2xl">Desarrollo</h2>
          <div class="space-y-2">
            <Label for="order" class="block text-md font-medium text-gray-700"
              >Orden del Día</Label
            >
            <Textarea
              id="order"
              name="order"
              v-model="acta.order"
              rows="4"
            ></Textarea>
          </div>
          <div class="space-y-2" v-if="acta.development">
            <Label for="chequeo" class="block text-md font-medium text-gray-700"
              >1. {{ acta?.order[0] }}</Label
            >
            <Textarea
              id="chequeo"
              name="chequeo"
              v-model="acta.development"
              rows="4"
              class="mt-1 block w-full rounded focus:border-indigo-300 -indigo-200 -opacity-50"
              placeholder="Chequeo de acuerdos"
            >
            </Textarea>
          </div>
          <div class="space-y-2">
            <Label
              for="agreements"
              class="block text-md font-medium text-gray-700"
            >
              Acuerdos
            </Label>
            <Textarea v-model="acta.agreements"></Textarea>
          </div>
          <div class="space-y-2">
            <Label
              for="observaciones"
              class="block text-md font-medium text-gray-700"
            >
              Observaciones generales
            </Label>
            <Textarea
              id="observaciones"
              name="observaciones"
              v-model="acta.observaciones"
              rows="4"
              class="mt-1 block w-full rounded focus:border-indigo-300 -indigo-200 -opacity-50"
            ></Textarea>
          </div>
        </div>
      </form>
      <div class=" w-full flex justify-between pt-4">
        <Button
          :disabled="currentStep === 1"
          size="icon"
          variant="outline"
          class="rounded-full"
          @click="currentStep--"
        >
          <ChevronLeft />
        </Button>

        <Button
          :disabled="currentStep === 3"
          size="icon"
          variant="outline"
          class="rounded-full"
          @click="currentStep++"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import Select from "@/components/ui/select/Select.vue";
import SelectContent from "@/components/ui/select/SelectContent.vue";
import SelectGroup from "@/components/ui/select/SelectGroup.vue";
import SelectItem from "@/components/ui/select/SelectItem.vue";
import SelectTrigger from "@/components/ui/select/SelectTrigger.vue";
import SelectValue from "@/components/ui/select/SelectValue.vue";
import Textarea from "@/components/ui/textarea/Textarea.vue";
import Button from "@/components/ui/button/Button.vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { ref } from "vue";

const { cores, acta } = defineProps<{ cores: any[]; acta: any }>();
const currentStep = ref(1);
</script>
