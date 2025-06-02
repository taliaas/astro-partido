<template>
  <div v-if="searchStore.showSidePanel">
    <Sheet>
      <SheetHeader>Búsqueda avanzada</SheetHeader>
      <button
        @click="closePanel"
        class="h-6 w-6 flex items-center justify-center rounded-md hover:bg-gray-100"
      >
        <XIcon class="h-4 w-4" />
      </button>
      <SheetContent>
        <div>
          <Label>Núcleo</Label>
          <select></select>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { useSearchStore } from "@/utils/store.ts";
import {Sheet, SheetContent, SheetHeader} from "@/components/ui/sheet";
import { XIcon } from "lucide-vue-next";
import {Label} from "@/components/ui/label";
import {Select} from "@/components/ui/select";

const searchStore = useSearchStore();

const closePanel = () => {
  searchStore.showSidePanel = false;
};
</script>