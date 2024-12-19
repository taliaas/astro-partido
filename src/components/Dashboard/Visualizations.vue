<template>
    <Card>
      <CardHeader>
        <CardTitle>Visualizaciones Disponibles</CardTitle>
        <CardDescription>Gráficos y dashboards personalizables</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-2">
          <div v-for="chart in charts" :key="chart.id" class="border rounded-lg p-4">
            <h3 class="font-semibold mb-2">{{ chart.title }}</h3>
            <p class="text-sm text-muted-foreground mb-2">{{ chart.type }}</p>
            <Button variant="outline">Ver Gráfico</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </template>
  
  <script setup>
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import { Button } from "@/components/ui/button"
  
  const charts = [
    { id: 1, title: 'Tendencias de Ventas', type: 'Gráfico de líneas' },
    { id: 2, title: 'Distribución de Gastos', type: 'Gráfico circular' },
  ]
  </script>