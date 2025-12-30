<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import type { Militant } from "@/interface/Militante";
import FileDown from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";

const { militants } = defineProps<{
  militants: Militant[];
}>();

const exporting = ref(false);

async function exportAll() {
  exporting.value = true;
  try {
    // const url = window.URL.createObjectURL(new Blob([blob]));
    // const link = document.createElement("a");
    // link.href = url;
    // link.setAttribute("download", "militantes_export.xlsx");
    // document.body.appendChild(link);
    // link.click();
    // link.parentNode?.removeChild(link);
    // window.URL.revokeObjectURL(url);
    toast.success("Los militantes fueron exportados correctamente");
  } catch (error) {
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
