<template>
  <div class="pb-4">
    <h2 class="text-2xl font-bold text-gray-900">
      {{ isComite ? "Cómites" : "Núcleos" }}
    </h2>
    <p class="text-gray-600">
      Administra los {{ isComite ? "cómites" : "núcleos" }} del sistema
    </p>
  </div>

  <div class="rounded-lg border bg-card shadow-sm">
    <div class="p-6 space-y-4">
      <!-- Sección de Comités -->
      <div class="flex justify-between space-x-2">
        <div class="relative flex-1">
          <div
            class="flex items-center gap-2 border px-3 py-2 rounded-md w-full"
          >
            <SearchIcon class="h-4 w-4 text-gray-400" />
            <input
              v-model="searchQuery"
              class="w-full flex-1 border-0 outline-none bg-transparent placeholder:text-gray-400"
              placeholder="Buscar ..."
              @keyup.enter="search"
              type="search"
            />
          </div>
        </div>
        <div class="flex gap-2">
          <Button @click="open = true" class="flex items-center gap-1">
            <PlusIcon class="h-4 w-4 mr-1" />
            Añadir
          </Button>
          <Button variant="outline" @click="openCore">
            {{ isComite ? "Núcleos" : "Cómites" }}
          </Button>
        </div>
      </div>
    </div>
    <div v-if="isComite" class="pb-4">
      <ComiteManage :comites="comites" v-model:open="open" />
    </div>
    <div v-if="!isComite">
      <CoreManage
        :cores
        :militants
        :comites="comites.data"
        v-model:open="open"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ComiteManage from "@/components/settings/comites/ComiteManage.vue";
import CoreManage from "@/components/settings/comites/CoreManage.vue";
import Button from "@/components/ui/button/Button.vue";
import type { Comite, Core, Militant } from "@/interface/Militante";
import { PlusIcon, SearchIcon } from "lucide-vue-next";
import { ref } from "vue";

const { comites, cores, militants } = defineProps<{
  comites: {
    data: Comite[];
  };
  cores: { data: Core[] };
  militants: Militant[];
}>();

const searchQuery = ref("");
const open = ref(false);
const isComite = ref(true);

function openCore() {
  isComite.value = !isComite.value;
}

function search() {}
</script>
