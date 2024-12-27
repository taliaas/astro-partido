<template>
    <Card>
      <CardHeader>
        <CardTitle>Documentos Recientes</CardTitle>
        <CardDescription>Últimos documentos procesados por el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="flex items-center">
            <Input type="search" placeholder="Buscar documentos..." class="max-w-sm mr-2 rounded border-gray-300" />
            <Button variant="secondary" class="rounded border-gray-300 bg-blue-600 text-white shadow-md">
              <Search class="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
          <div v-for="doc in documents" :key="doc.id" class="border rounded-lg p-4">
            <h3 class="font-semibold mb-2"> Acta Ordinaria {{ doc.id }}</h3>
            <p class="text-sm text-muted-foreground mb-2">{{ doc.fecha }}</p>
            <div class="flex space-x-2">
              <Button variant="outline" @click="openMinute" class="rounded border-gray-300 shadow-md" size="sm">Ver Detalles</Button>
              <Button variant="outline" class="rounded border-gray-300 shadow-md" size="sm">Descargar</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </template>
  
  <script setup lang="ts">
  import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
  import {Button} from "@/components/ui/button"
  import {Input} from "@/components/ui/input"
  import {Search} from 'lucide-vue-next'
  import OrdinaryService from "@/services/OrdinaryService.ts";
  import {onMounted, ref } from "vue";

  const documents = ref([])

  async function getMinute() {
    const service = new OrdinaryService()
    try {
      documents.value = await service.getLatestMinute()
    }
    catch (e) {
      console.error(e)
    }
  }

  async function openMinute(){
    
  }

  onMounted(
      getMinute
  )
  </script>