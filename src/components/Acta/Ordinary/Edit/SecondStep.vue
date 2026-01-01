<template>
  <div class="space-y-2">
    <div class="flex justify-between">
      <h3 class="text-lg font-medium">Orden del Día</h3>
      <div>
        <Button
          @click="
            agendaItems.push({
              order: '',
              content: '',
              agreements: [],
              workplan: [],
            })
          "
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
            <th class="h-12 w-[100px] px-4 text-left align-middle font-medium">
              No.
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium">
              Descripción
            </th>
            <th class="h-12 w-[100px] px-4 align-middle"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) of agendaItems.fields.value"
            :key="index"
            class="border-b"
          >
            <td class="p-4 align-middle font-medium">{{ index + 1 }}</td>
            <td class="p-4 align-middle">
              <FormField
                :name="`development.${index}.order`"
                v-slot="{ componentField }"
              >
                <FormItem class="w-3/4">
                  <FormControl>
                    <Input
                      type="text"
                      v-bind="componentField"
                      placeholder="Descripción"
                      class="border-none shadow-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </td>
            <td class="p-4 align-middle">
              <Button @click="agendaItems.remove(index)" variant="ghost">
                <TrashIcon class="h-4 w-4 text-destructive-foreground" />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="space-y-4">
    <h2 class="text-lg mt-8 mb-4 font-bold">Desarrollo</h2>
    <div
      v-for="(item, developmentIndex) of agendaItems.fields.value"
      :key="developmentIndex"
    >
      <div>
        <FormField
          :name="`development.${developmentIndex}.content`"
          v-slot="{ componentField }"
        >
          <FormItem class="">
            <FormLabel class="text-md"
              >{{ developmentIndex + 1 }}.
              {{ form.values.development[developmentIndex].order }}</FormLabel
            >
            <FormControl>
              <Textarea rows="4" v-bind="componentField"></Textarea>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <!-- Acuerdos Table -->
      <FieldArray
        :name="`development.${developmentIndex}.agreements`"
        v-slot="agreements"
      >
        <div class="space-y-4">
          <div class="flex justify-between mt-8 mb-4">
            <Label for="agreements" class="text-md font-bold">Acuerdos</Label>
            <div class="flex justify-end">
              <Button
                type="button"
                @click="
                  agreements.push({
                    descripcion: '',
                    responsable: null,
                    enddate: '2025-01-01',
                    participants: [],
                    pto: '',
                  })
                "
                variant="outline"
              >
                <PlusIcon
                  class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90"
                />
                Agregar acuerdo
              </Button>
            </div>
          </div>
          <div class="rounded-md border">
            <table class="w-full">
              <thead>
                <tr class="border-b bg-muted/50">
                  <th
                    class="h-12 w-[100px] px-4 text-left align-middle font-medium"
                  >
                    No.
                  </th>
                  <th class="h-12 px-4 text-left align-middle font-medium">
                    Descripción
                  </th>
                  <th class="h-12 px-4 text-left align-middle font-medium">
                    Participantes
                  </th>
                  <th class="h-12 px-4 text-left align-middle font-medium">
                    Responsable
                  </th>
                  <th class="h-12 px-4 text-left align-middle font-medium">
                    Fecha
                  </th>
                  <th class="h-12 w-[100px] px-4 align-middle"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, agreementIndex) of agreements.fields"
                  :key="agreementIndex"
                  class="border"
                >
                  <td class="px-4 py-4">{{ agreementIndex + 1 }}</td>
                  <td>
                    <FormField
                      :name="
                        'development.' +
                        developmentIndex +
                        '.agreements.' +
                        agreementIndex +
                        '.descripcion'
                      "
                      v-slot="{ componentField }"
                    >
                      <FormItem class="w-3/4">
                        <FormControl>
                          <Input
                            type="text"
                            v-bind="componentField"
                            class="border-none shadow-none"
                            placeholder="Descripción"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </td>
                  <td class="px-4 py-4">
                    <FormField
                      :name="
                        'development.' +
                        developmentIndex +
                        '.agreements.' +
                        agreementIndex +
                        '.participants'
                      "
                      v-slot="{ field, setValue }"
                    >
                      <FormItem class="w-3/4">
                        <FormControl>
                          <Select
                            :model-value="field.value.map(({ id }: any) => id)"
                            @update:model-value="
                              (val: any) => {
                                setValue(
                                  val.map((id: string) => ({ id })),
                                  false
                                );
                              }
                            "
                            multiple
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder="Participantes"
                                class="text-wrap max-w-64 max-h-none"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem
                                  v-for="item of militants"
                                  :key="item.id"
                                  :value="item.id + ''"
                                  >{{ item.firstname }}
                                  {{ item.lastname }}</SelectItem
                                >
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem></FormField
                    >
                  </td>
                  <td class="px-4 py-4">
                    <FormField
                      :name="
                        'development.' +
                        developmentIndex +
                        '.agreements.' +
                        agreementIndex +
                        '.responsable.id'
                      "
                      v-slot="{ componentField }"
                    >
                      <FormItem class="w-3/4">
                        <FormControl>
                          <Select :="componentField">
                            <SelectTrigger>
                              <SelectValue
                                placeholder="Responsable"
                              ></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                v-for="item of militants"
                                :key="item.id"
                                :value="item.id + ''"
                                >{{ item.firstname }}
                                {{ item.lastname }}</SelectItem
                              >
                            </SelectContent>
                          </Select></FormControl
                        >
                        <FormMessage /></FormItem
                    ></FormField>
                  </td>
                  <td class="px-4 py-4">
                    <FormField
                      :name="
                        'development.' +
                        developmentIndex +
                        '.agreements.' +
                        agreementIndex +
                        '.enddate'
                      "
                      v-slot="{ componentField }"
                    >
                      <FormItem class="w-3/4">
                        <FormControl>
                          <Input
                            type="date"
                            v-bind="componentField"
                            class="border shadow-none"
                            :name="
                              'development.' +
                              developmentIndex +
                              'agreements.' +
                              agreementIndex +
                              '.enddate'
                            "
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </td>
                  <td class="px-4 py-4">
                    <Button
                      variant="ghost"
                      type="button"
                      @click="agreements.remove(agreementIndex)"
                    >
                      <TrashIcon class="size-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              v-if="!agreements.fields.length"
              class="text-muted-foreground text-center p-6"
            >
              No hay acuerdos
            </div>
          </div>
        </div>
      </FieldArray>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSchema } from "@/components/Acta/Ordinary/Create/form_schema";
import Button from "@/components/ui/button/Button.vue";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Textarea from "@/components/ui/textarea/Textarea.vue";
import type { Militant } from "@/interface/Militante";
import { PlusIcon, TrashIcon } from "lucide-vue-next";
import { FieldArray, useFieldArray, useFormContext } from "vee-validate";

const { militants } = defineProps<{
  militants: Militant[];
}>();

const form = useFormContext<FormSchema>();

const agendaItems =
  useFieldArray<FormSchema["development"][number]>("development");
</script>
