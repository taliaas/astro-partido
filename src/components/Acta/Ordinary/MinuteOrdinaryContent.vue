<script setup lang="ts">
import Label from "@/components/ui/label/Label.vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type Minute from "@/interface/Minute";

const { minute } = defineProps<{ minute: Minute }>();
</script>

<template>
  <div class="space-y-2">
    <div class="flex justify-between w-2/3">
      <div class="flex gap-2">
        <Label class="text-md">Fecha: </Label>
        <p>{{ minute.date || "-" }}</p>
      </div>
      <div class="flex gap-2">
        <Label class="text-md">Hora: </Label>
        <p>{{ minute.hour || "-" }}</p>
      </div>
      <div class="flex gap-2">
        <Label class="text-md">Lugar: </Label>
        <p>{{ minute.place || "-" }}</p>
      </div>
    </div>

    <div class="grid grid-rows-3 gap-2">
      <div class="flex gap-2">
        <Label class="text-md">Próxima reunión: </Label>
        <p>{{ minute.ordinary?.fechaProx || "-" }}</p>
      </div>
      <div class="flex gap-2">
        <Label class="text-md">Preparación próxima reunión: </Label>
        <p>{{ minute.ordinary?.fechaPrep || "-" }}</p>
      </div>
      <div class="flex gap-2">
        <Label class="text-md">Próximo círculo de estudios políticos: </Label>
        <p>{{ minute.ordinary?.fechaCP || "-" }}</p>
      </div>
    </div>

    <div>
      <Label class="text-lg">Asistencia</Label>
      <Table class="">
        <TableHeader class="uppercase border-b">
          <TableHead>No.</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead class="text-center">Causa</TableHead>
        </TableHeader>
        <TableBody v-for="(item, index) in minute.abscents" :key="item.id">
          <TableRow>
            <TableCell class="p-2">{{ index + 1 }}</TableCell>
            <TableCell class="p-2"
              >{{ item.militant.firstname }}
              {{ item.militant.lastname }}</TableCell
            >
            <TableCell class="p-2">{{ item.estado }}</TableCell>
            <TableCell class="p-2 text-center">{{
              item.reason || "-"
            }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
