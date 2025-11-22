<template>
  <div class="space-x-4">
    <Button variant="outline" type="menu" @click="exportToExcel()">
      <Download />
      {{ loading ? "Exportando..." : "Exportar" }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import type { Computo } from "@/interface/Indicadores";
import { buildExcel } from "@/utils/excel";
import { Download } from "lucide-vue-next";
import { ref } from "vue";

const { computos, month } = defineProps<{
  computos: Computo[];
  month: string;
}>();
const loading = ref(false);

// Función básica de exportación
const exportToExcel = async (filename: string = "Asistencia.xlsx") => {
  try {
    loading.value = true;
    const workbook = buildExcel(computos, month);
    // Generar y descargar
    const buffer = await workbook.xlsx.writeBuffer();
    downloadExcel(buffer, filename);
    loading.value = false;
  } catch (error) {
    console.error("Error al exportar Excel:", error);
    throw error;
  }
};

// Función para descargar el archivo
const downloadExcel = (buffer: ArrayBuffer, filename: string) => {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
</script>
