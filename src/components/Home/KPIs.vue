<template>
  <Card class="bg-secondary">
    <CardHeader>
      <CardTitle>KPIs Principales</CardTitle>
      <CardDescription>Indicadores clave de rendimiento del mes actual y comparación con el anterior mes</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div v-for="data in updatedData" :key="data.id"
             class="flex items-center justify-between p-2 border hover:bg-gray-50 hover:shadow-sm rounded-lg">
          <div>
            <h3 class="font-semibold text-xl">{{ data.title }}</h3>
            <p class="text-sm text-muted-foreground">{{ data.description }}</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-blue-500">{{ data.porcen }} </p>
            <p :class="data.trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600'"
               class="text-sm font-semibold">
              {{ data.trend > 0 ? '+' : '' }}{{ data.trend }} vs mes anterior
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"

const {kpis: updatedData} = defineProps<{ kpis: any[] }>()

</script>