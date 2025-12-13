<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Agreements } from "@/interface/Militante";

const { agreement } = defineProps<{
  agreement: Agreements;
}>();
</script>

<template>
  <div class="p-2 space-y-4">
    <div>
      <h1 class="text-2xl font-bold text-black">Detalles del Acuerdo</h1>
    </div>
    {{ agreement }}
    <Card class="p-6">
      <CardHeader class="border-b-2 border-black">
        <CardTitle class="text-lg">{{ agreement?.descripcion }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="grid grid-cols-3 gap-6">
          <div>
            <p class="text-sm font-semibold text-gray-700 uppercase">
              Responsable
            </p>
            <p class="text-lg text-black font-medium mt-2">
              {{ agreement.responsable.firstname }}
              {{ agreement.responsable.lastname }}
            </p>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-700 uppercase">Estado</p>
            <p class="text-lg text-black font-medium mt-2">
              {{ agreement.status }}
            </p>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-700 uppercase">
              Fecha Creación
            </p>
            <p class="text-lg text-black font-medium mt-2">
              {{ agreement.created }}
            </p>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-700 uppercase">
              Fecha Vencimiento
            </p>
            <p class="text-lg text-black font-medium mt-2">
              {{ agreement.enddate }}
            </p>
          </div>
        </div>
        <div class="gap-6">
          <div>
            <p class="text-sm font-semibold text-gray-700 uppercase">
              Participantes
            </p>
            <p
              v-if="agreement.participants.length === 0"
              class="text-muted-foreground"
            >
              No hay participantes
            </p>
            <ul v-for="item in agreement.participants">
              <il>{{ item.firstname }} {{ item.lastname }}</il>
            </ul>
          </div>
        </div>

        <div class="pt-4 border-t-2 border-black">
          <p class="text-sm font-semibold text-gray-700 uppercase mb-3">
            Desarrollo
          </p>
          <p class="text-black font-medium">
            {{ agreement.development.content }}
          </p>
        </div>

        <div class="pt-4 border-t-2 border-black">
          <p class="text-sm font-semibold text-gray-700 uppercase mb-3">
            Detalles de Reunión
          </p>
          <div class="space-y-2">
            <p class="text-sm text-gray-700">
              <span class="font-semibold">Orden:</span>
              {{ agreement.development?.order?.[0] || "-" }}
            </p>
            <p class="text-sm text-gray-700">
              <span class="font-semibold">Fecha Próxima:</span>{{ " " }}
              {{ agreement.development.minute.fechaProx || "No especificada" }}
            </p>
            <p class="text-sm text-gray-700">
              <span class="font-semibold">Fecha Preparación:</span>{{ " " }}
              {{ agreement.development.minute.fechaPrep || "No especificada" }}
            </p>
            <p class="text-sm text-gray-700">
              <span class="font-semibold">Fecha CP:</span>{{ " " }}
              {{ agreement.development.minute.fechaCP || "No especificada" }}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
