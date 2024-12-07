<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-vue-next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

</script>

<template>
  <form class="space-y-8 max-w-2xl mx-auto">
    <!-- 1. Información General -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold">1. Información General</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Fecha -->

        <!-- Hora -->
        <div class="space-y-2">
          <Label for="hora">Hora<span class="text-red-500">*</span></Label>
          <Input type="time" id="hora" required />
        </div>

        <!-- Lugar -->
        <div class="space-y-2">
          <Label for="lugar">Lugar<span class="text-red-500">*</span></Label>
          <Input id="lugar" required />
        </div>

        <!-- Área -->
        <div class="space-y-2">
          <Label for="area">Área<span class="text-red-500">*</span></Label>
          <Input id="area" required />
        </div>
      </div>
    </section>

    <!-- 2. Presidencia -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold">2. Presidencia</h2>
      <div class="space-y-2">
        <Label for="secretario">Nombre del Secretario General<span class="text-red-500">*</span></Label>
        <Input id="secretario" required />
      </div>
    </section>

    <!-- 3. Asistencia -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold">3. Asistencia</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Total miembros -->
        <div class="space-y-2">
          <Label for="total">Número total de miembros<span class="text-red-500">*</span></Label>
          <Input type="number" id="total" required />
        </div>
        <!-- Asistentes -->
        <div class="space-y-2">
          <Label for="asistentes">Número de asistentes<span class="text-red-500">*</span></Label>
          <Input type="number" id="asistentes" required />
        </div>
        <!-- Porcentaje -->
        <div class="space-y-2">
          <Label for="porcentaje">Porcentaje de asistencia</Label>
          <Input id="porcentaje" readonly />
        </div>
      </div>
    </section>

    <!-- 4. Relación de Asistencia -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold">4. Relación de Asistencia</h2>
      <div class="space-y-2">
        <Label for="asistencia">Nombre Completo y Estado<span class="text-red-500">*</span></Label>
        <Textarea
          id="asistencia"
          placeholder="Nombre Completo - Estado (Presente/Virtual/Ausente)"
          required
        />
      </div>
    </section>

    <!-- Botón de envío -->
    <Button type="submit" class="w-full">Enviar Formulario</Button>
  </form>
</template>
