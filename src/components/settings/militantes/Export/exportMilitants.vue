<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import type { Militant } from "@/interface/Militante";
import { FileDown } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";
import ExcelJS from "exceljs";

const { militants } = defineProps<{
  militants: Militant[];
}>();

const exporting = ref(false);

async function exportAll() {
  exporting.value = true;
  try {
    const workbook = new ExcelJS.Workbook();

    // Group militants by core
    const militantsByCore = militants.reduce(
      (acc, militant) => {
        const coreName = militant.core?.name || "Sin Núcleo";
        if (!acc[coreName]) {
          acc[coreName] = [];
        }
        acc[coreName].push(militant);
        return acc;
      },
      {} as Record<string, Militant[]>
    );

    // Define headers based on Militant interface
    const headers = [
      "ID",
      "Nombre",
      "Apellido",
      "CI",
      "Email",
      "Organización",
      "Dirección",
      "Teléfono",
      "Sexo",
      "Raza",
      "Religión",
      "Nivel Escolar",
      "Clasificación",
      "Trabajo",
      "Cuenta Propia",
      "Fundador",
      "Fecha",
      "CIPCC",
      "Militante Doble",
      "Expediente",
    ];

    // Create a worksheet for each core
    Object.entries(militantsByCore).forEach(([coreName, coreMilitants]) => {
      const worksheet = workbook.addWorksheet(coreName);

      // Add headers
      worksheet.addRow(headers);

      // Style headers
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: "center" };

      // Add data rows for this core
      coreMilitants.forEach((militant) => {
        const row = [
          militant.id,
          militant.firstname || "-",
          militant.lastname || "-",
          militant.ci || "-",
          militant.email || "-",
          militant.organization || "-",
          militant.address || "-",
          militant.phone || "-",
          militant.sexo || "-",
          militant.raza || "-",
          militant.religion || "-",
          militant.nivel_escolar || "-",
          militant.clasificacion || "-",
          militant.work || "-",
          militant.cuenta_propia ? "Sí" : "No",
          militant.fundador ? "Sí" : "No",
          militant.date ? new Date(militant.date).toLocaleDateString() : "-",
          militant.CIPCC || "-",
          militant.militant_doble ? "Sí" : "No",
          militant.expediente || "-",
        ];
        worksheet.addRow(row);
      });

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        if (typeof column.eachCell === "function") {
          column.eachCell({ includeEmpty: true }, (cell) => {
            const columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) {
              maxLength = columnLength;
            }
          });
        }
        column.width = Math.min(maxLength + 2, 50); // Max width of 50
      });
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create blob and download
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "militantes_export.xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("Los militantes fueron exportados correctamente");
  } catch (error) {
    console.error("Error exporting militants:", error);
    toast.error("Error al exportar los militantes");
  } finally {
    exporting.value = false;
  }
}
</script>
<template>
  <Button
    class="cursor-pointer"
    variant="outline"
    @click="exportAll"
    :disabled="exporting"
  >
    <FileDown class="size-4" />
    <span v-if="exporting">Exportando ...</span>
    <span v-else>Exportar todo</span>
  </Button>
</template>
