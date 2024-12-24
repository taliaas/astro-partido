<template>
  <div class="container mx-auto p-6 bg-gray-50 dark:bg-zinc-800">
    <div class="grid gap-6 md:grid-cols-[1fr_300px]">
      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-blue-600 dark:text-blue-400">Panel de Control de KPIs</h1>
        
        <div class="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          <Card v-for="(card, index) in cards" :key="index" 
            class="bg-white rounded shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 ease-in-out">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-md font-semibold">{{ card.title }}</CardTitle>
              <component :is="card.icon" class="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent class="flex items-baseline space-x-4">
              <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ card.value }}</div>
              <p class="text-sm font-medium" :class="card.subtext.color">{{ card.subtext.text }}</p>
            </CardContent>
          </Card>
        </div>

       <MenuDash />
      </div>
      
      <div class="space-y-6 w-full md:w-[300px] mt-12">
        <RightSidebar />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
Activity,
FileCheck2,
Files,
FileText
} from 'lucide-vue-next'
import { ref } from 'vue'
import MenuDash from '../Dashboard/MenuDash.vue'
import RightSidebar from '../layout/RightSidebar.vue'

const cards = [
  { 
    title: 'Documentos Pendientes', 
    value: '12', 
    subtext: { text: '4 nuevos hoy', color: 'text-blue-500' }, 
    icon: FileText 
  },
  { 
    title: 'Documentos Procesados', 
    value: '45', 
    subtext: { text: '+15% este mes', color: 'text-green-500' }, 
    icon: FileCheck2 
  },
  { 
    title: 'Total de Documentos', 
    value: '57', 
    subtext: { text: '+5% desde ayer', color: 'text-green-500' }, 
    icon: Files 
  },
  { 
    title: 'KPIs Identificados', 
    value: '24', 
    subtext: { text: '+2 esta semana', color: 'text-blue-500' }, 
    icon: Activity 
  },
]


</script>

