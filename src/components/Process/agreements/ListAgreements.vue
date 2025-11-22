<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
</script>
<template>
  <div class="p-2 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gestión de Acuerdos</h2>
        <p class="text-gray-600">
          Administra los acuerdos de las actas del núcleo
        </p>
      </div>
    </div>
    <div>
      <Table class="border rounded-">
        <TableHeader>
          <TableRow class="font-medium text-left">
            <TableHead>Acta</TableHead>
            <TableHead>Descripcion</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Participantes</TableHead>
            <TableHead>Fecha Creado</TableHead>
            <TableHead>Fucha de Cumplimiento</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody
          ><TableRow> <TableCell></TableCell> </TableRow
        ></TableBody>
      </Table>
    </div>
  </div>
</template>
