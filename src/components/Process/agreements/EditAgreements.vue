<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Card from "@/components/ui/card/Card.vue";
import Input from "@/components/ui/input/Input.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgreementStatus } from "@/enum/Status";
import type { Agreements, Militant } from "@/interface/Militante";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { Check, X } from "lucide-vue-next";
import { reactive, ref } from "vue";
import { toast } from "vue-sonner";

const { agreement, militants } = defineProps<{
  agreement: Agreements;
  militants: Militant[];
}>();

const currentAgreements = reactive<Agreements>({
  id: agreement.id ?? "",
  descripcion: agreement.descripcion ?? "",
  responsable: agreement.responsable ?? null,
  participants: agreement.participants ?? [],
  created: agreement.created ?? "",
  enddate: agreement.enddate ?? "",
  status: agreement.status ?? AgreementStatus.PENDIENTE,
  minute: agreement.development.minute,
  development: agreement.development,
});

const edit = async () => {
  try {
    await actions.agreements.editAgreements({
      id: agreement.id,
      data: currentAgreements,
    });
    toast.success("El acuerdo ha sido actualizado correctamente.");
    navigate("");
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <!-- Acuerdos Table -->
  <Card class="space-y-4">
    <CardHeader>
      <CardTitle>Editar acuerdo</CardTitle>
      <CardAction
        ><a href="/process/agreements/"
          ><X class="text-muted-foreground size-4" /></a
      ></CardAction>
    </CardHeader>
    <CardContent>
      {{ agreement.development.minute }}
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
              <th class="h-12 px-4 text-center align-middle font-medium">
                Fecha de Finalización
              </th>
              <th class="h-12 px-4 text-left align-middle font-medium">
                Estado
              </th>
              <th class="h-12 w-[100px] text-center px-4 align-middle">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="border">
              <td class="h-12 px-4">{{ currentAgreements.id }}</td>
              <td class="px-2">
                <Input v-model="currentAgreements.descripcion" type="text" />
              </td>
              <td class="px-2">
                <Select
                  multiple
                  :default-value="
                    currentAgreements.participants.map((i) => i.id + '')
                  "
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
                        >{{ item.firstname }} {{ item.lastname }}</SelectItem
                      >
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </td>
              <td class="text-center">
                <Select v-model="currentAgreements.responsable.id">
                  <SelectTrigger>
                    <SelectValue placeholder="Responsable"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="item of militants"
                      :key="item.id"
                      :value="item.id"
                      >{{ item.firstname }} {{ item.lastname }}</SelectItem
                    >
                  </SelectContent>
                </Select>
              </td>
              <td class="p-2">
                <Input
                  type="date"
                  :default-value="currentAgreements.enddate.valueOf()"
                  class="max-w-36 mx-auto"
                />
              </td>
              <td>
                <Select :default-value="currentAgreements.status">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="item in AgreementStatus" :value="item">{{
                      item
                    }}</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td class="p-2 flex justify-center">
                <Button variant="ghost" size="icon" @click="edit">
                  <Check class="size-4 text-green-500" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</template>
