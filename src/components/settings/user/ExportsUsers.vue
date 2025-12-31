<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import type { User } from "@/interface/Militante";
import { FileDown } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";
import ExcelJS from "exceljs";

const { users } = defineProps<{
  users: User[];
}>();

const exporting = ref(false);

async function exportAll() {
  exporting.value = true;
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Usuarios");

    // Define headers based on User interface
    const headers = [
      "ID",
      "Nombre",
      "Email",
      "Militante",
      "Núcleo",
      "Rol",
      "Último Login",
      "Estado",
    ];

    // Add headers
    worksheet.addRow(headers);

    // Style headers
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    // Add data rows
    users.forEach((user) => {
      const row = [
        user.id,
        user.name || "-",
        user.email || "-",
        user.militant.firstname || "" + " " + user.militant.lastname || "",
        user.militant.core?.name || "-",
        user.role.name || "-",
        user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "-",
        user.status || "-",
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

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create blob and download
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "usuarios_export.xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("Los usuarios fueron exportados correctamente");
  } catch (error) {
    console.error("Error exporting users:", error);
    toast.error("Error al exportar los usuarios");
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
