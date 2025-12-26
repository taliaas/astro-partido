<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Comite, Core, Militant } from "@/interface/Militante";
import {
  Building2,
  Eye,
  MoreHorizontal,
  Pencil,
  PlusIcon,
  Trash2,
} from "lucide-vue-next";
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

const militantByComite = (comiteId: string) => {
  const cores = comites.data.find((comite) => comite.id === comiteId)?.cores;
  return cores?.reduce((sum, item) => sum + item.militants.length, 0) || 0;
};
</script>
<template>
  <div class="pb-4 flex justify-between">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">
        Gestión de Comités y Núcleos
      </h2>
      <p class="text-gray-600">
        Administra comités, núcleos y sus militantes asociados
      </p>
    </div>
    <Button @click="open = true" class="flex items-center gap-1">
      <PlusIcon class="h-4 w-4 mr-1" />
      Nuevo Comité
    </Button>
  </div>
  <Card>
    <CardContent>
      <div
        class="flex cursor-pointer items-center justify-between p-6 transition-colors hover:bg-muted/50"
        v-for="comite in comites.data"
      >
        <div class="flex items-center gap-4">
          <Building2 class="h-5 w-5 text-primary" />
          <div class="items-center gap-3">
            <h3 class="text-lg font-semibold">{{ comite.name }}</h3>

            <p class="text-muted-foreground">
              {{ comite.cores.length }} núcleo(s) •
              {{ militantByComite(comite.id) }} militante(s)
            </p>
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" class="rounded-md">
                <MoreHorizontal class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye class="mr-2 h-4 w-4" />
                Ver
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil class="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem class="text-destructive">
                <Trash2 class="mr-2 h-4 w-4 text-destructive" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
