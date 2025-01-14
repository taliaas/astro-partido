<template>
  <div class="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
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
              <div class="grid grid-cols-4 gap-4">
                <span class="font-medium text-gray-600">Núcleo:</span>
                {{ acta.core?.name }}
                <span class="font-medium text-gray-600">Secretario General:</span>
                {{ acta.secretarioGeneral }}
                <span class="font-medium text-gray-600">Fecha:</span>
                {{ acta.fecha }}
                <span class="font-medium text-gray-600">Lugar:</span>
                {{ acta.lugar }}
                <span class="font-medium text-gray-600">Hora:</span>
                {{ acta.hora }}
              </div>
            </section>

            <!-- Asistencia -->
            <Section title="Asistencia">
              <p class="text-muted-foreground mb-4">
                Se encuentran presentes {{ acta.presentes }} miembros de un total de {{ total }}
                posibles a asistir para un {{ acta.porcentajeAsistencia }}% de asistencia.
              </p>
              <Table class="w-3/4 ml-8">
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead class="text-center">Presente</TableHead>
                    <TableHead class="text-center">Causa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="miembro in acta.militante" :key="miembro.nro">
                    <TableCell>{{ miembro.id }}</TableCell>
                    <TableCell>{{ miembro.firstname }}</TableCell>
                    <TableCell class="text-center">
                      <Badge v-if="miembro.presente === 'X'" variant="success">Presente</Badge>
                      <Badge v-else-if="miembro.presente === 'Virtual'" variant="info">Virtual</Badge>
                      <span v-else>{{ miembro.presente || "-" }}</span>
                    </TableCell>
                    <TableCell class="text-center">
                      {{ miembro.causa || "-" }}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Section>

            <!-- Orden del día -->
            <section>
              <h2 class="text-xl font-semibold text-gray-800 mb-2">
                Orden del día
              </h2>
              <ol class="list-decimal list-inside space-y-1">
                <li
                    v-for="(item, index) in acta.order"
                    :key="index"
                    class="text-md text-gray-600"
                >
                  {{ item }}
                </li>
              </ol>
            </section>

            <!-- Desarrollo de la reunión -->
            <Section title="Desarrollo de la reunión">
              <h2 class="text-xl font-semibold text-gray-800 mb-2">
                Desarrollo de la reunión
              </h2>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>1. Chequeo de acuerdos</AccordionTrigger>
                  <AccordionContent>
                    <div v-for="(punto, index) in acta.chequeo" :key="index" class="mb-4">
                      <h3 class="text-lg font-medium mb-2">
                        {{ index + 1 }}. {{ punto.titulo }}
                      </h3>
                      <p class="text-muted-foreground" v-html="punto.contenido"></p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>2. Orientaciones del Organismo Superior</AccordionTrigger>
                  <AccordionContent>
                    <p class="text-muted-foreground">{{ acta.orientaciones }}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>3. Análisis</AccordionTrigger>
                  <AccordionContent>
                    <p class="text-muted-foreground">{{ acta.analisis }}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>4. Acuerdos</AccordionTrigger>
                  <AccordionContent>
                    <ul class="space-y-4">
                      <li v-for="(acuerdo, index) in acta.agreements" :key="index" class="border-b pb-4">
                        <div class="font-medium">Acuerdo {{ index + 1 }}:</div>
                        <p class="text-muted-foreground">{{ acuerdo }}</p>
                        <div class="mt-2 text-sm text-muted-foreground">
                          <span class="font-medium">Responsable:</span> {{ acuerdo.responsable }} |
                          <span class="font-medium">Fecha de cumplimiento:</span> {{ acuerdo.fecha }}
                        </div>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger> 5. Salidas al extranjero</AccordionTrigger>
                  <AccordionContent>
                    <ul class="space-y-4">
                      <li v-for="(salida, index) in acta.extranjero" :key="index" class="border-b pb-4">
                        <div class="font-medium">Salida {{ index + 1 }}:</div>
                        <p class="text-muted-foreground">{{ salida }}</p>
                        <div class="mt-2 text-sm text-muted-foreground">
                          <span class="font-medium">País:</span> {{ salida.pais }} |
                          <span class="font-medium">Fecha:</span> {{ salida.fecha }} |
                          <span class="font-medium">Acuerdo:</span> {{ salida.acuerdo }}
                        </div>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Section>

            <!-- Próximas fechas -->
            <section class="">
              <h2 class="text-xl font-semibold text-gray-800 my-4">
                Próximas fechas
              </h2>
              <div class="grid grid-cols-2 gap-4 text-md text-gray-600">
              <span class="font-medium"
              >Fecha de la Próxima Reunión Ordinaria:</span
              >
                {{ acta.fechaProx }}
                <span class="font-medium"
                >Fecha de la Preparación de la Próxima Reunión Ordinaria:</span
                >
                {{ acta.fechaPrep }}
                <span class="font-medium"
                >Fecha del Próximo Círculo de Estudios Políticos:</span
                >
                {{ acta.fechaCP }}
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
import { jsPDF } from 'jspdf'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion'

const { acta } = defineProps<{
  acta: string;
}>();

const infoActa = ref<HTMLElement | null>(null)

  const exportar = () => {
    const pdf = new jsPDF()

    // Título
    pdf.setFontSize(18)
    pdf.text(`Acta ${acta.name} ${acta.id}`, 14, 15)

    // Información General
    pdf.setFontSize(14)
    pdf.text('Información General', 14, 25)
    pdf.setFontSize(10)
    pdf.text(`Núcleo: ${acta.core?.name}`, 14, 35)
    pdf.text(`Secretario General: ${acta.secretarioGeneral}`, 14, 40)
    pdf.text(`Fecha: ${acta.fecha}`, 14, 45)
    pdf.text(`Lugar: ${acta.lugar}`, 14, 50)
    pdf.text(`Hora: ${acta.hora}`, 14, 55)

    // Asistencia
    pdf.setFontSize(14)
    pdf.text('Asistencia', 14, 65)
    pdf.setFontSize(10)
    pdf.text(`Presentes: ${acta.militante})`, 14, 75)

    // Orden del día
    //saltar un renglon
    pdf.setFontSize(14)
    pdf.text('Orden del día', 14, 15)
    pdf.setFontSize(10)
    acta.order.forEach((item, index) => {
      pdf.text(`${index + 1}. ${item}`, 14, 25 + (index * 5))
    })

    // Desarrollo de la reunión
    pdf.setFontSize(14)
    pdf.text('Desarrollo de la reunión', 14, 15)

    // Chequeo de acuerdos
    pdf.setFontSize(12)
    pdf.text('1. Chequeo de acuerdos', 14, 25)
    let yPos = 35


    // Orientaciones y Análisis
    pdf.setFontSize(12)
    pdf.text('2. Orientaciones del Organismo Superior', 14, 15)
    pdf.setFontSize(10)
    const splitOrientaciones = pdf.splitTextToSize(acta.orientaciones, 180)
    pdf.text(splitOrientaciones, 14, 25)

    pdf.setFontSize(12)
    pdf.text('3. Análisis', 14, 25 + (splitOrientaciones.length * 5) + 10)
    pdf.setFontSize(10)

    // Acuerdos
    pdf.setFontSize(14)
    pdf.text('4. Acuerdos', 14, 15)
    yPos = 25
    acta.agreements.forEach((acuerdo, index) => {
      pdf.setFontSize(11)
      pdf.text(`Acuerdo ${index + 1}:`, 14, yPos)
      pdf.setFontSize(10)
      const splitAcuerdo = pdf.splitTextToSize(acuerdo, 180)
      pdf.text(splitAcuerdo, 14, yPos + 5)
      pdf.text(`Responsable: ${acuerdo.responsable} | Fecha de cumplimiento: ${acuerdo.fecha}`, 14, yPos + 10 + (splitAcuerdo.length * 5))
      yPos += 20 + (splitAcuerdo.length * 5)
    })

    // Salidas al extranjero
    pdf.setFontSize(14)
    pdf.text('5. Salidas al extranjero', 14, 15)
    yPos = 25
    acta.extranjero.forEach((salida, index) => {
      pdf.setFontSize(11)
      pdf.text(`Salida ${index + 1}:`, 14, yPos)
      pdf.setFontSize(10)
      pdf.text(`País: ${salida.pais} | Fecha: ${salida.fecha}`, 14, yPos + 5)
      pdf.text(`Acuerdo: ${salida.acuerdo}`, 14, yPos + 10)
      yPos += 20
    })

    // Próximas fechas
    pdf.setFontSize(14)
    pdf.text('Próximas fechas', 14, 15)
    pdf.setFontSize(10)
    pdf.text(`Fecha de la Próxima Reunión Ordinaria: ${acta.fechaProx}`, 14, 25)
    pdf.text(`Fecha de la Preparación de la Próxima Reunión Ordinaria: ${acta.fechaPrep}`, 14, 30)
    pdf.text(`Fecha del Próximo Círculo de Estudios Políticos: ${acta.fechaCP}`, 14, 35)

    // Guardar el PDF
    pdf.save(`Acta ${acta.core?.name}-${acta.fecha}.pdf`)
  }
</script>