<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div
      class="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div class="p-8">
        <div class="flex justify-between">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">
            {{ acta.name }} {{ acta.id }}
          </h1>
          <Button class="mx-2" variant="outline" @click="exportar">
            <DownloadIcon class="w-4 h-4 text-gray-700" />
          </Button>
        </div>

        <div ref="infoActa" class="space-y-6">
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

          <!-- Asistencia / calcular-->
          <section>
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Asistencia</h2>
            <p class="text-md text-gray-600 mb-2">
              Se encuentran presentes {{ acta.presentes }} miembros de un total
              de {{ acta.totalMiembros }} posibles a asistir para un
              {{ acta.porcentajeAsistencia }}% de asistencia.
            </p>

            <!--Militantes/ Invitados / Participantes -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      No.
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Nombre
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Presente
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Causa
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="miembro in acta.militante"
                    :key="miembro.nro"
                    class="hover:bg-gray-50"
                  >
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ miembro.id }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{ miembro.firstname }}
                    </td>
                    <td
                      class="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      <span
                        v-if="miembro.presente === 'X'"
                        class="text-green-600"
                        >✓</span
                      >
                      <span
                        v-else-if="miembro.presente === 'Virtual'"
                        class="text-blue-600"
                        >Virtual</span
                      >
                      <span v-else>{{ miembro.presente || "-" }}</span>
                    </td>
                    <td
                      class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900"
                    >
                      <span v-if="miembro.causa === ''">{{
                        miembro.causa || "-"
                      }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

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
          <h2 class="text-xl font-semibold text-gray-800 mb-2">
            Desarrollo de la reunión
          </h2>

          <section>
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              1. Chequeo de acuerdos
            </h2>
            <div
              v-for="(punto, index) in acta.chequeo"
              :key="index"
              class="mb-4"
            >
              <h3 class="text-lg font-medium text-gray-700 mb-2">
                {{ index + 1 }}. {{ punto.titulo }}
              </h3>
              <p class="text-md text-gray-600" v-html="punto.contenido"></p>
            </div>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              2. Orientaciones del Organismo Superior
            </h2>
            <div class="mb-4">
              <p class="text-md text-gray-600">{{ acta.orientaciones }}</p>
            </div>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              3. Análisis
            </h2>
            <div class="mb-4">
              <p class="text-md text-gray-600">{{ acta.analisis }}</p>
            </div>
          </section>

          <!-- Acuerdos -->
          <section>
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              4. Acuerdos
            </h2>
            <ul class="space-y-2">
              <li
                v-for="acuerdo in acta.agreements"
                :key="index"
                class="text-md text-gray-600"
              >
                <strong>Acuerdo {{ index }}:</strong> {{ acuerdo }}
                <br />
                <span class="text-gray-500"
                  >Responsable: {{ acuerdo.responsable }} | Fecha de
                  cumplimiento: {{ acuerdo.fecha }}</span
                >
              </li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              5. Salidas al extranjero
            </h2>
            <ul class="space-y-2">
              <li
                v-for="salida in acta.extranjero"
                :key="index"
                class="text-md text-gray-600"
              >
                <span class="text-md text-gray-600">{{ salida }}</span>
                <div>
                  <strong>País :</strong> {{ salida.pais }}
                  <strong>Fecha :</strong> {{ salida.fecha }}
                  <strong>Acuerdo {{ index }}:</strong> {{ salida.acuerdo }}
                </div>
              </li>
            </ul>
          </section>

          <!-- Próximas fechas -->
          <section class="border-t border-gray-300">
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
      </div>
    </div>
  </div>
</template>
{
<script setup lang="ts">
import { DownloadIcon } from "lucide-vue-next";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { ref } from "vue";
import html2canvas from "html2canvas";

const { acta } = defineProps<{
  acta: string;
}>();

const infoActa = ref("");

const exportar = async () => {
  try {
    const canvas = await html2canvas(infoActa.value)
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF("l", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.text("Acta PCC CUJAE", 14, 15);
    pdf.addImage(imgData, 'PNG', 10, 30, pdfWidth - 20, pdfHeight - 20)

    pdf.save(`Acta ${acta.core?.name}-${acta.fecha}.pdf`);
  } catch (error) {
    console.error("Error exporting PDF:", error);
  }
};
</script>