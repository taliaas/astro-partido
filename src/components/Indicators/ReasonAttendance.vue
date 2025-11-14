<template>
  <div>
    <!-- Selector de Dashboard -->
    <div class="mb-6">
      <div class="bg-white rounded-lg p-4">
        <div class="flex gap-4">
          <div>
            <h2 class="text-lg font-medium text-gray-900">
              Análisis de Inasistencias
            </h2>
            <p class="text-sm text-gray-500">
              Visualización y gestión de ausencias por comités y núcleos
            </p>
          </div>
        </div>
      </div>
    </div>

    <div></div>

    <!-- Sheet para mostrar detalles de ausentes -->
    <Sheet v-model:open="sheetOpen">
      <SheetContent class="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Detalles de Inasistencias</SheetTitle>
          <SheetDescription v-if="selectedNucleo">
            {{ selectedComite }} - {{ selectedNucleo.name }}
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button @click="sheetOpen = false">Cerrar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Core } from "@/interface/Militante";
import { ref } from "vue";

// Estado para el Sheet
const sheetOpen = ref(false);
const selectedNucleo = ref<Core | null>(null);
const selectedReason = ref<string | null>(null);
const selectedComite = ref<string | null>(null);
</script>

<style scoped>
/* Animaciones para expandir/colapsar secciones */
.collapsible-content-enter-active,
.collapsible-content-leave-active {
  transition: all 0.3s ease-out;
}

.collapsible-content-enter-from,
.collapsible-content-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Transiciones entre dashboards */
.dashboard-enter-active,
.dashboard-leave-active {
  transition: opacity 0.3s ease;
}

.dashboard-enter-from,
.dashboard-leave-to {
  opacity: 0;
}
</style>
