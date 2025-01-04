<template>
    <Card>
      <CardHeader>
        <CardTitle>KPIs Principales</CardTitle>
        <CardDescription>Indicadores clave de rendimiento identificados</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div v-for="data in updatedData" :key="data.id" class="flex items-center justify-between p-2 border hover:bg-gray-50 hover:shadow-sm rounded-lg">
            <div>
              <h3 class="font-semibold text-xl">{{ data.title }}</h3>
              <p class="text-sm text-muted-foreground">{{data.description}}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-blue-500">{{data.porcen}} %</p>
              <p :class="data.trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600'" class="text-sm font-semibold">
                {{ data.trend > 0 ? '+' : '' }}{{ data.trend }} vs mes anterior
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

  const updatedData = ref([])
  const data = ref([
    { id: 1, title: 'Acuerdos', name: 'acuerdos', description: 'Comportamiento de acuerdos en el último mes', porcen: 2 , trend: 0 },
    { id: 2, title: 'Participantes', name: 'participantes', description: 'Asistencia de participantes', porcen: 3 , trend: 0 },
    { id: 3, title: 'Invitados', name: 'invitados', description: 'Asistencia de invitados', porcen: 4 , trend: 0 }
  ])

  async function getKPIs(){
    const services = new Computo()
    const kpis = ref([])
    try {
      kpis.value = await services.getCompare();
      console.log(kpis.value)
      updatedData.value = data.value.map(item => {
        const kpiValue = kpis.value.difference[item.name];
        console.log(kpiValue);
        if (kpiValue !== undefined) {
          return { ...item, trend: kpiValue };
        }
        return item;
      });
      console.log(updatedData);
    }
    catch (e) {
      console.error(e)
    }
  }

  onMounted(()=>{
    getKPIs()
  })
  </script>