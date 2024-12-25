<template>
    <Card>
      <CardHeader>
        <CardTitle>KPIs Principales</CardTitle>
        <CardDescription>Indicadores clave de rendimiento identificados</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div v-for="kpi in kpis" :key="kpi.id" class="flex items-center justify-between p-2 border rounded-lg">
            <div>
              <h3 class="font-semibold">{{ kpi.title }}</h3>
              <p class="text-sm text-muted-foreground">{{ kpi.description }}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-blue-500">{{ kpi.value }}</p>
              <p :class="kpi.trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600'" class="text-sm font-semibold">
                {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }} vs mes anterior
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </template>
  
  <script setup>
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  
  const kpis = [
    { id: 1, title: 'Tasa de Conversión', description: 'Ventas / Visitas', value: '3.2%', trend: 0.5 },
    { id: 2, title: 'Satisfacción del Cliente', description: 'NPS Score', value: '72', trend: -2 },
  ]
  </script>