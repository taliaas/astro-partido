<template>
  <div class="space-y-2">
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
            v-for="(item, index) of agendaItems"
            :key="index"
            class="border-b"
          >
            <td class="p-4 align-middle font-medium">{{ index + 1 }}</td>
            <td class="p-4 align-middle">
              <FormField :name="'order.' + index" v-slot="{ componentField }">
                <FormItem class="w-3/4">
                  <FormControl>
                    <Input
                      type="text"
                      required
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
              <Button @click="removeAgendaItem(index)" variant="ghost">
                <TrashIcon class="h-4 w-4" />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  {{ form.values }}

  <div class="space-y-4">
    <h2 class="text-lg mt-8 mb-4 font-bold">Desarrollo</h2>
    <div
      v-for="(item, developmentIndex) of agendaItems"
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
              {{ form.values.order[developmentIndex] }}</FormLabel
            >
            <FormControl>
              <Textarea rows="4" v-bind="componentField"></Textarea>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <!-- Acuerdos Table -->
      <div class="space-y-4">
        <div class="flex justify-between mt-8 mb-4">
          <Label for="agreements" class="text-md font-bold">Acuerdos</Label>
          <div class="flex justify-end">
            <Button
              type="button"
              @click="addAgreement"
              variant="outline"
              class="group inline-flex items-center justify-center rounded border border-b-gray-300 transition-all duration-300 text-sm font-medium h-10 px-4"
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
              <FormField
                :name="`development.${developmentIndex}.agreements`"
                v-slot="{ field }"
              >
                <tr
                  v-for="(item, agreementIndex) of field.value?.agreements ??
                  []"
                  :key="agreementIndex"
                  class="border"
                >
                  <td class="p-4 align-middle font-medium">
                    {{ agreementIndex + 1 }}
                  </td>
                  <td class="p-4 align-middle">
                    <FormField
                      :name="
                        'development.' +
                        developmentIndex +
                        'agreements.' +
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
                  <td class="p-4 align-middle">
                    <FormField
                      :name="
                        'development.' +
                        developmentIndex +
                        'agreements.' +
                        agreementIndex +
                        '.participant.id'
                      "
                      v-slot="{ componentField }"
                    >
                      <FormItem class="w-3/4">
                        <FormControl>
                          <Select :="componentField">
                            <SelectTrigger
                              ><SelectValue placeholder="Participantes"
                            /></SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                v-for="militante in militants"
                                :key="militante.id"
                                :value="militante.id"
                                >{{ militante.firstname }}
                                {{ militante.lastname }}</SelectItem
                              >
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </td>
                  <td class="p-4 align-middle">
                    <FormField
                      :name="
                        'development.' +
                        developmentIndex +
                        'agreements.' +
                        agreementIndex +
                        '.responsable.id'
                      "
                      v-slot="{ componentField }"
                    >
                      <FormItem class="w-3/4">
                        <FormControl>
                          <Select :="componentField">
                            <SelectTrigger
                              ><SelectValue placeholder="Responsable"
                            /></SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                v-for="militante in militants"
                                :key="militante.id"
                                :value="militante.id"
                                >{{ militante.firstname }}
                                {{ militante.lastname }}</SelectItem
                              >
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </td>
                  <td class="p-4 align-middle">
                    <FormField
                      :name="
                        'development.' +
                        developmentIndex +
                        'agreements.' +
                        agreementIndex +
                        '.fecha'
                      "
                      v-slot="{ componentField }"
                    >
                      <FormItem class="w-3/4">
                        <FormControl>
                          <Input
                            type="date"
                            v-bind="componentField"
                            class="border-none shadow-none"
                            :name="
                              'development.' +
                              developmentIndex +
                              'agreements.' +
                              agreementIndex +
                              '.fecha'
                            "
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </td>
                  <td class="p-4 align-middle">
                    <Button
                      @click="removeAgreement(developmentIndex, agreementIndex)"
                      type="button"
                      variant="ghost"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              </FormField>
            </tbody>
          </table>
        </div>
      </div>
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Textarea from "@/components/ui/textarea/Textarea.vue";
import type { Militant } from "@/interface/Militante";
import { PlusIcon, TrashIcon } from "lucide-vue-next";
import { useFormContext } from "vee-validate";
import { computed } from "vue";

const { militants } = defineProps<{
  militants: Militant[];
}>();

const form = useFormContext<FormSchema>();

const agendaItems = computed(() => form.values.order);

const addAgendaItem = () => {
  form.setFieldValue("order", [...form.values.order, ""]);
};

const removeAgendaItem = (index: any) => {
  if (form.values.order.length === 1) form.setFieldValue("order", []);
  else form.setFieldValue("order", form.values.order.toSpliced(index, 1));
};

const addAgreement = (index: number) => {
  form.setFieldValue(`development`, [], true);
  // form.setFieldValue(`development.${index}.agreements`, [
  //   ...(form.values.development[index]?.agreements ?? []),
  //   { descripcion: "", responsable: { id: 0 }, fecha: "" as any },
  // ]);
};

const removeAgreement = (developmentIndex: number, agreementIndex: number) => {
  if (form.values.development[developmentIndex].agreements.length === 1)
    form.setFieldValue(`development.${developmentIndex}.agreements`, []);
  else
    form.setFieldValue(
      `development.${developmentIndex}.agreements`,
      form.values.development[developmentIndex].agreements.toSpliced(
        agreementIndex,
        1
      )
    );
};
</script>
