<template>
    <div class="container mx-auto p-6 bg-background">
      <div class="grid gap-6 md:grid-cols-[1fr_300px]">
        <div class="space-y-6">
          <h1 class="text-3xl font-bold text-blue-600">Panel de Control de KPIs</h1>
          
          <div class="grid gap-2 md:grid-cols-2 lg:grid-cols-4 ">
            <Card v-for="(card, index) in cards" :key="index">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-md font-semibold">{{ card.title }}</CardTitle>
                <component :is="card.icon" class="h-6 w-6 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div class="text-3xl font-bold">{{ card.value }}</div>
                <p class="text-sm text-blue-400 font-medium">{{ card.subtext }}</p>
              </CardContent>
            </Card>
          </div>
  
          <Tabs v-model="activeTab" class="space-y-4">
            <TabsList class="grid w-full grid-cols-1 md:grid-cols-4 h-auto">
              <TabsTrigger v-for="tab in tabs" :key="tab.value" :value="tab.value" class="bg-gray-200 p-2 border">
                {{ tab.label }}
              </TabsTrigger>
            </TabsList>
            <TabsContent v-for="tab in tabs" :key="tab.value" class="rounded m-2 space-y-4" :value="tab.value">
              <component :is="tab.component" />
            </TabsContent>
          </Tabs>
        </div>
        
        <div class="space-y-6 flex flex-col w-96 mt-12 p-4 ml-20">
          <RightSidebar />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { UploadCloud, BarChart2, PieChart, LineChart } from 'lucide-vue-next'
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
  import Overview from './Overview.vue'
  import Documents from './Documents.vue'
  import KPIs from './KPIs.vue'
  import Visualizations from './Visualizations.vue'
import RightSidebar from '../layout/RightSidebar.vue'
  
  const activeTab = ref('overview')
  
  const cards = [
    { title: 'Documentos Pendientes', value: '12', subtext: '4 nuevos hoy', icon: UploadCloud },
    { title: 'Documentos Procesados', value: '45', subtext: '+15% este mes', icon: BarChart2 },
    { title: 'Total de Documentos', value: '57', subtext: '+5% desde ayer', icon: PieChart },
    { title: 'KPIs Identificados', value: '24', subtext: '+2 esta semana', icon: LineChart },
  ]
  
  const tabs = [
    { value: 'overview', label: 'Vista General', component: Overview },
    { value: 'documents', label: 'Documentos', component: Documents },
    { value: 'kpis', label: 'KPIs', component: KPIs },
    { value: 'visualizations', label: 'Visualizaciones', component: Visualizations },
  ]
  </script>