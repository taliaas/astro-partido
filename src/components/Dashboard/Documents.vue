<template>
    <Card>
      <CardHeader>
        <CardTitle>Documentos Recientes</CardTitle>
        <CardDescription>Últimos documentos procesados por el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="flex items-center">
            <Input type="search" placeholder="Buscar documentos..." class="max-w-sm mr-2" />
            <Button variant="secondary">
              <Search class="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
          <div v-for="doc in documents" :key="doc.id" class="border rounded-lg p-4">
            <h3 class="font-semibold mb-2">{{ doc.title }}</h3>
            <p class="text-sm text-muted-foreground mb-2">{{ doc.date }}</p>
            <div class="flex space-x-2">
              <Button variant="outline" size="sm">Ver Detalles</Button>
              <Button variant="outline" size="sm">Descargar</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </template>
  
  <script setup>
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { Search } from 'lucide-vue-next'
  
  const documents = [
    { id: 1, title: 'Informe Anual 2023', date: 'Procesado el 15/04/2024' },
    { id: 2, title: 'Reporte Trimestral Q1 2024', date: 'Procesado el 10/04/2024' },
  ]
  </script>