<template>
    <div class="container mx-auto p-6 bg-background">
      <div class="grid gap-6 md:grid-cols-[1fr_300px]">
        <div class="space-y-6">
          <h1 class="text-3xl font-bold text-primary">Panel de Control de KPIs</h1>
          
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card v-for="(card, index) in cards" :key="index">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">{{ card.title }}</CardTitle>
                <component :is="card.icon" class="h-4 w-4" :class="card.iconClass" />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">{{ card.value }}</div>
                <p class="text-xs text-muted-foreground">{{ card.subtext }}</p>
              </CardContent>
            </Card>
          </div>
  
          <Tabs v-model="activeTab" class="space-y-4">
            <TabsList class="grid w-full grid-cols-1 md:grid-cols-4 h-auto">
              <TabsTrigger v-for="tab in tabs" :key="tab.value" :value="tab.value">
                {{ tab.label }}
              </TabsTrigger>
            </TabsList>
            <TabsContent v-for="tab in tabs" :key="tab.value" :value="tab.value" class="space-y-4">
              <component :is="tab.component" />
            </TabsContent>
          </Tabs>
        </div>
        
        <div class="space-y-6">
        
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
//import RightSidebar from './layout/RightSidebar.vue' <!-- Right Sidebar --><RightSidebar client:load />
  
  const activeTab = ref('overview')
  
  const cards = [
    { title: 'Documentos Pendientes', value: '12', subtext: '4 nuevos hoy', icon: UploadCloud, iconClass: 'text-accent' },
    { title: 'Documentos Procesados', value: '45', subtext: '+15% este mes', icon: BarChart2, iconClass: 'text-secondary' },
    { title: 'Total Documentos', value: '57', subtext: '+5% desde ayer', icon: PieChart, iconClass: 'text-primary' },
    { title: 'KPIs Identificados', value: '24', subtext: '+2 esta semana', icon: LineChart, iconClass: 'text-muted-foreground' },
  ]
  
  const tabs = [
    { value: 'overview', label: 'Vista General', component: Overview },
    { value: 'documents', label: 'Documentos', component: Documents },
    { value: 'kpis', label: 'KPIs', component: KPIs },
    { value: 'visualizations', label: 'Visualizaciones', component: Visualizations },
  ]
  </script>