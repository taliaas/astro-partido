<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import ScrollArea from "@/components/ui/scroll-area/ScrollArea.vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SheetOverlay from "@/components/ui/sheet/SheetOverlay.vue";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { categories, indicators } from "@/utils/indicators";
import { useUrlSearchParams } from "@vueuse/core";
import { navigate } from "astro:transitions/client";
import { BarChart3, EyeIcon, Search } from "lucide-vue-next";
import { computed, ref } from "vue";

const searchTerm = ref("");
const selectedCategory = ref("");
const { computo } = defineProps<{
  computo: {
    id: number;
    year: number;
    month: number;
    indicators: any[];
    minute: any;
  };
}>();
const searchParams = useUrlSearchParams("history");

const getValueIndicators = (key: string) => {
  return computo?.indicators.find((i) => i.key === key).value;
};
const getTextIndicators = (key: string) => {
  return computo?.indicators.find((i) => i.key === key).text;
};

function openGraphic() {
  navigate("/analisis_indicador/chart");
}

// Computed para filtrar indicadores
const filteredIndicators = computed(() => {
  const indEntries = Object.entries(indicators)
    .filter(
      ([_, value]) =>
        !selectedCategory.value || value.category === selectedCategory.value
    )
    .filter(([_, value]) => {
      const search = searchTerm.value.trim().toLowerCase();
      if (!search) return true;
      return (
        value.name.toLowerCase().includes(search) ||
        value.description.toLowerCase().includes(search)
      );
    });
  return Object.fromEntries(indEntries);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-[1600px] mx-auto space-y-2">
      <div class="flex flex-col space-y-6">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Indicadores</h1>
          <p class="text-muted-foreground">
            Lista de indicadores del sistema filtrados por categoría y fecha
          </p>
        </div>
        <!-- Filtros -->
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Búsqueda -->
          <div class="relative flex-1">
            <Search
              class="absolute left-2 top-2.5 size-4 text-muted-foreground"
            />
            <Input
              v-model="searchTerm"
              placeholder="Buscar indicadores..."
              class="pl-8 h-full"
            />
          </div>
          <div>
            <Select
              v-model="selectedCategory"
              class="w-full rounded-md border border-gray-300 p-2 text-sm"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las categorías</SelectItem>
                <SelectItem
                  v-for="category of categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex gap-2">
            <Input
              type="month"
              @change="navigate('')"
              v-model="searchParams.fecha"
              class="border p-2 rounded-md border-gray-300"
            />
            <Button variant="outline" @click="openGraphic">
              <BarChart3 class="size-4" />
              Ver Gráfico
            </Button>
          </div>
        </div>
      </div>
      <div class="shadow-md p-4 rounded-md border">
        <div class="rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Indicador</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead class="text-center">Valor</TableHead>
                <TableHead class="text-center">Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="computo?.indicators?.length === 0">
                <TableCell
                  colspan="4"
                  class="text-center py-8 text-2xl text-muted-foreground"
                >
                  No se encontraron indicadores con los filtros aplicados
                </TableCell>
              </TableRow>
              <TableRow
                v-else
                v-for="(indicator, key) in filteredIndicators"
                :key="key"
              >
                <TableCell>
                  {{ indicator.name }}
                </TableCell>
                <TableCell>
                  {{ indicator.category }}
                </TableCell>
                <TableCell>
                  {{ indicator.description }}
                </TableCell>
                <TableCell class="text-center">
                  {{ getValueIndicators(key as any) ?? "-" }}
                </TableCell>
                <TableCell class="flex justify-center">
                  <Sheet>
                    <SheetTrigger><EyeIcon class="size-4" /></SheetTrigger>
                    <SheetContent class="space-y-4">
                      <SheetHeader class="space-y-2">
                        <SheetTitle class="text-2xl">
                          {{ indicator.name }}</SheetTitle
                        >
                        <SheetDescription class="@container">
                          <Label class="text-lg text-muted-foreground px-4">
                            Detalles
                          </Label>
                          <ScrollArea class="h-[90cqh] @h-3 w-full">
                            <p class="text-lg text-justify">
                              {{
                                getTextIndicators(key as any) ?? "No encontrado"
                              }}
                            </p>
                          </ScrollArea>
                        </SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                    <SheetOverlay className="fixed inset-0 bg-transparent" />
                  </Sheet>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>
