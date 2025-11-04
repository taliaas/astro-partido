<template>
  <div class="p-4">
    <div class="rounded-md border">
      <table class="w-full text-md">
        <thead>
          <tr class="border-b bg-muted/50 font-semibold">
            <th class="h-10 px-4 text-left">Nombre</th>
            <th class="h-10 px-4 text-center">Secretario General</th>
            <th class="h-10 px-4 text-center">Secretario del Funcionamiento</th>
            <th class="h-10 px-4 text-center">Militantes</th>
            <th class="h-10 px-4 text-center">Estado</th>
            <th class="h-10 px-4 text-left w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="cores.data.length === 0">
            <td colspan="3" class="p-4 text-center text-muted-foreground">
              No hay núcleos registrados.
            </td>
          </tr>

          <tr v-for="core in cores.data" :key="core.id" class="p-2">
            <td class="h-10 px-4 text-left">{{ core.name }}</td>
            <td class="h-10 px-4 text-center">
              {{ core.generalSecretary.firstname }}
              {{ core.generalSecretary.lastname }}
            </td>
            <td class="h-10 px-4 text-center">
              {{ core.operationSecretary.firstname }}
              {{ core.operationSecretary.lastname }}
            </td>
            <td class="h-10 px-4 text-center">
              <Badge variant="outline">{{ core?.militants?.length }}</Badge>
            </td>
            <td class="h-10 px-4 text-center">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  core.disabled
                    ? 'bg-red-50 text-red-700 border border-red-300'
                    : 'bg-green-50 text-green-700 border border-green-300',
                ]"
              >
                {{ core.disabled ? "Inactivo" : "Activo" }}
              </span>
            </td>
            <td class="h-10 px-4 text-left w-[50px]">
              <div class="relative">
                <Button
                  variant="ghost"
                  class="rounded-full"
                  size="icon"
                  @click="openDetails"
                >
                  <MoreVerticalIcon class="h-4 w-4" />
                </Button>
                <div
                  v-if="open"
                  class="absolute right-0 z-10 mt-2 w-56 rounded-md border bg-background shadow-lg"
                >
                  <div
                    class="py-2 px-3 text-sm font-medium text-muted-foreground border-b bg-muted"
                  >
                    Acciones
                  </div>
                  <div class="py-1">
                    <a
                      href="#"
                      class="px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"
                      @click.prevent="handleEditCore()"
                    >
                      <EditIcon class="h-4 w-4" />
                      Editar
                    </a>

                    <div class="border-t my-1"></div>
                    <a
                      href="#"
                      class="px-4 py-2 text-sm text-red-600 hover:bg-muted flex items-center gap-2"
                      @click.prevent="handleDeleteCore(core.id)"
                    >
                      <Trash2Icon class="h-4 w-4" />
                      Eliminar
                    </a>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import Badge from "@/components/ui/badge/Badge.vue";
import Button from "@/components/ui/button/Button.vue";
import type { Core, Militant } from "@/interface/Militante";
import { ActionError, actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { EditIcon, MoreVerticalIcon, Trash2Icon } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";

const { cores, militants } = defineProps<{
  cores: { data: Core[] };
  militants: Militant[];
}>();

const openModal = defineModel<boolean>("open");

const isEditing = ref(false);
const isCreate = ref(false);
const isLoading = ref(false);
const open = ref(false);

const handleEditCore = () => {
  isEditing.value = true;
};

const handleDeleteCore = async (coreId: string) => {
  const { error } = await actions.core.deleteCore(coreId);
  if (error instanceof ActionError) {
    console.error(error);
    toast.error("Error al eliminar el núcleo");
  } else {
    toast.success("El núcleo se eliminó con éxito");
    navigate("");
  }
};

function openDetails() {
  open.value = !open.value;
}
</script>
