<template>
    <Card>
      <CardHeader>
        <CardTitle>KPIs Principales</CardTitle>
        <CardDescription>Indicadores clave de rendimiento identificados</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div v-for="kpi in kpis" :key="kpi.id" class="flex items-center justify-between p-2 border hover:bg-gray-50 hover:shadow-md rounded-lg">
            <div>
              <h3 class="font-semibold text-xl">{{ kpi.title }}</h3>
              <p class="text-sm text-muted-foreground">{{ kpi.description }}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-blue-500">{{ data.diferencia_agree }}</p>
              <p :class="kpi.trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600'" class="text-sm font-semibold">
                {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }} vs mes anterior
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </template>
  
  <script setup lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import Computo from "@/services/Computo.ts";
  import {onMounted, ref} from "vue"

  const data = ref([])
  const kpis = [
    { id: 1, title: 'Acuerdos', description: 'Comportamiento de acuerdos en el último mes', trend: data.diferencia_agree },
    { id: 2, title: 'Participantes', description: 'Asistencia de participantes', trend: data.value.sum },
    { id: 3, title: 'Invitados', description: 'Asistencia de invitados', trend: data.value.suma }
  ]

  async function getKPIs(){
    const services = new Computo()
    try {
      data.value = await services.getCompare();
    }
    catch (e) {
      console.error(e)
    }
  }

  onMounted(()=>{
    getKPIs()
  })
  </script>