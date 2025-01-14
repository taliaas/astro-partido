<template>
  <div class="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto shadow-md">
      <Card class="w-full">
        <CardHeader>
          <div class="flex justify-between items-center">
            <CardTitle class="text-3xl font-bold">
              {{ acta.name }} {{ acta.id }}
            </CardTitle>
            <Button variant="outline" @click="exportar">
              <DownloadIcon class="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div ref="infoActa" class="space-y-8">
            <!-- Información General -->
            <section>
              <h2 class="text-xl font-semibold text-gray-800 mb-2">
                Información General
              </h2>
              <div class="flex gap-4">
                <div class="card">
                  <span class="font-medium text-gray-700">Núcleo:</span>
                  {{ acta.core?.name }}
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Lugar:</span>
                  {{ acta.lugar }}
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Fecha:</span>
                  {{ acta.fecha }}
                </div>
                <div class="card">
                  <span class="font-medium text-gray-700">Hora:</span>
                  {{ acta.hora }}
                </div>
              </div>
            </section>

            <!-- Asistencia -->
            <Section title="Asistencia">
              <p class="mb-4 text-md text-gray-700">
                Se encuentran presentes {{ presentes }} miembros de un total de {{ acta.total }}
                posibles a asistir para un {{ acta.porciento }}% de asistencia.
              </p>
              <div v-if="acta.causa.length !== 0">
                <h3 class="font-medium text-gray-700 my-4">Causas: </h3>
                <div v-for="(causa, index) in acta.causa" :key="index" class="mb-4">
                  <p>{{causa}}</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 text-md text-gray-700">
                <div class="flex">
                  <h3 class="font-medium text-gray-700">Total de trabajadores:</h3>
                  <p class="ml-8">{{ acta.total_trabajador }}</p>
                </div>
                <div class="flex">
                  <h3 class="font-medium text-gray-700">Por el organismo superior:</h3>
                  <p class="ml-8">{{ acta.total_organismo }}</p>
                </div>
              </div>
            </Section>

            <!-- Orden del día -->
            <section>
              <h2 class="text-xl font-semibold text-gray-800 mb-2">
                Tema evaluado en la reunión
              </h2>
              <p>{{ acta.tema }}</p>
            </section>

            <!-- Desarrollo de la reunión -->
            <Section title="Planteamientos">
              <h2 class="text-xl font-semibold text-gray-800 mb-2">
                Principales planteamientos realizados
              </h2>
              <div v-for="(punto, index) in acta.planteamientos" :key="index" class="mb-4">
                <p>{{ punto }}</p>
              </div>
            </Section>
            <Section title="Valoracion">
              <h2 class="text-xl font-semibold text-gray-800 mb-2">
                Valoración
              </h2>
              <p>{{ acta.valoracion }}</p>
            </Section>

            <!-- Próximas fechas -->
            <section class="">
              <h2 class="text-xl font-semibold text-gray-800 my-4">
                Firma del orientador político y el secretario del núcleo.
              </h2>
              <div class="grid grid-cols-2 gap-4 text-md text-gray-700">
                <span>{{ acta.name_orientador }}</span>
                <span>{{ acta.name_secretario }}</span>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DownloadIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { jsPDF } from "jspdf";

const { acta } = defineProps<{
  acta: string;
}>();

const presentes = 12;
const infoActa = ref<HTMLElement | null>(null)

const exportar = () => {
  const pdf = new jsPDF()
  let yPos = 90

  // Título
  pdf.setFontSize(18)
  pdf.text(`${acta.name} ${acta.id}`, 14, 15)

  // Información General
  pdf.setFontSize(14)
  pdf.text('Información General', 14, 25)
  pdf.setFontSize(10)
  pdf.text(`Núcleo: ${acta.core?.name}`, 14, 35)
  pdf.text(`Fecha: ${acta.fecha}`, 14, 40)
  pdf.text(`Lugar: ${acta.lugar}`, 14, 45)
  pdf.text(`Hora: ${acta.hora}`, 14, 50)

  // Asistencia
  pdf.setFontSize(14)
  pdf.text('Asistencia', 14, 60)
  pdf.setFontSize(10)
  pdf.text(`Total: ${acta.total}`, 14, 70)
  pdf.text(`Ausentes: ${acta.ausentes}`, 14, 75)
  pdf.text(`Presentes: ${presentes}`, 14, 80 )
  pdf.text(`Total de trabajadores presentes: ${acta.total_trabajador}`, 14, 85 )
  pdf.text(`Por el organismo superior: ${acta.total_organismo}`, 14, 90 )
  // acta.causas.forEach((causa) => {
  //   pdf.setFontSize(10)
  //   const splitCausa = pdf.splitTextToSize(causa, 180)
  //   pdf.text(splitCausa, 14, yPos+5)
  //   yPos += 20 + (splitCausa.length * 5)
  // })

  // Tema
  yPos += 5
  pdf.setFontSize(14)
  pdf.text('Tema evaluado en la reunión:', 14, yPos+5)
  pdf.setFontSize(10)
  const split = pdf.splitTextToSize(`${acta.tema}`, 180)
  pdf.text(split, 14, yPos+10)

// Planteamiento
  pdf.setFontSize(14)
  pdf.text('Principales planteamientos realizados: ', 14, 120)
  yPos = 125
  acta.planteamientos.forEach((planteam) => {
    pdf.setFontSize(10)
    const splitAcuerdo = pdf.splitTextToSize(planteam, 180)
    pdf.text(splitAcuerdo, 14, yPos + 5)
    yPos += 20 + (splitAcuerdo.length * 5)
  })

  //Valoracion
  pdf.setFontSize(14)
  pdf.text('Valoración de la reunión: ', 14, yPos+5)
  pdf.setFontSize(10)
  yPos += 5
  pdf.text(`${acta.valoracion}`, 14, yPos+5 )

  yPos += 10
  pdf.setFontSize(12)
  pdf.text(`Orientador político:`, 14, yPos+5)
  pdf.setFontSize(10)
  pdf.text(`${acta.name_orientador}`, 14, yPos+10)
  yPos += 15
  pdf.setFontSize(12)
  pdf.text(`Secretario del núcleo:`, 14, yPos+5)
  pdf.setFontSize(10)
  pdf.text(`${acta.name_secretario}`, 14, yPos+10)

  // Guardar el PDF
  pdf.save(`Acta ${acta.core?.name}-${acta.fecha}.pdf`)
}
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .card {
    @apply border flex flex-col rounded-lg p-2 px-4 w-fit text-gray-600 min-w-32;
  }
}
</style>