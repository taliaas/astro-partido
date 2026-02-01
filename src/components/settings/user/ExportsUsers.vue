<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Button from "@/components/ui/button/Button.vue";
import type { User } from "@/interface/Militante";
import { FileDown } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";
import ExcelJS from "exceljs";

const { users } = defineProps<{
  users: User[];
}>();

enum typeDoc {
  E = "excel",
  P = "pdf",
  D = "docx",
}

const exporting = ref(false);
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

function exportAll(type: typeDoc) {
  if (type === typeDoc.D) {
  } else if (type === typeDoc.E) {
    exportExcel();
  } else if (type === typeDoc.P) {
  }
}
import jsPDF from "jspdf";
async function exportExcel() {
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

async function exportPDF() {
  const doc = new jsPDF();

  // Título principal
  doc.setFontSize(18);
  doc.text("Listado de Usuarios", 105, 20, { align: "center" });

  let y = 40; // posición inicial en Y

  users.forEach((user, index) => {
    doc.setFontSize(14);
    doc.text(`Usuario #${index + 1}`, 20, y);
    y += 8;

    // Separador entre usuarios
    (y += 4), doc.setDrawColor(150);
    doc.line(20, y, 190, y);
    y += 10;

    // Si se pasa del final de la página, crear nueva
    if (y > 270) {
      doc.addPage();
      y = 30;
    }
  });

  // Guardar PDF
  doc.save("usuarios.pdf");
}

async function exportDocx() {}
</script>
<template>
  <Popover>
    <PopoverTrigger>
      <Button variant="outline" type="button">
        <FileDown class="size-4" />Exportar</Button
      >
    </PopoverTrigger>
    <PopoverContent>
      <div class="grid gap-4">
        <div class="space-y-2">
          <h4 class="font-medium leading-none">Exportar usuarios</h4>
          <p class="text-sm text-muted-foreground">
            Seleccione el tipo de documento
          </p>
        </div>
        <div class="flex gap-2 justify-between">
          <Button
            type="button"
            variant="outline"
            class="cursor-pointer"
            @click="exportAll(typeDoc.P)"
            :disabled="exporting"
          >
            <span v-if="exporting">Exportando pdf...</span>
            <span v-else>Pdf</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            class="cursor-pointer"
            @click="exportAll(typeDoc.E)"
            :disabled="exporting"
          >
            <span v-if="exporting">Exportando excel...</span>
            <span v-else>Excel</span></Button
          >
          <Button
            type="button"
            variant="outline"
            class="cursor-pointer"
            @click="exportAll(typeDoc.D)"
            :disabled="exporting"
          >
            <span v-if="exporting">Exportando docx...</span>
            <span v-else>Docx</span></Button
          >
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
