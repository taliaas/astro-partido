<script setup lang="ts">
import { ref } from "vue";
import { indicators, categories } from "@/lib/indicadoresKey.ts";
import { Search } from "lucide-vue-next";
import Input from "@/components/ui/input/Input.vue";
import Table from "@/components/ui/table/Table.vue";
import TableHeader from "@/components/ui/table/TableHeader.vue";
import TableRow from "@/components/ui/table/TableRow.vue";
import TableHead from "@/components/ui/table/TableHead.vue";
import TableBody from "@/components/ui/table/TableBody.vue";
import TableCell from "@/components/ui/table/TableCell.vue";
import { computed } from "vue";

const searchTerm = ref("");
const selectedCategory = ref("");
const fecha = ref("2025-07");
const { computo } = defineProps<{
  computo: any;
}>();

const getComputo = (key: string) => {
  const value = fecha.value;
  const [year, month] = value.split("-");

  const c = computo.find(
    (item: any) => item.month == month && item.year == year
  );
  const ind = c?.indicators?.find((i: any) => i.key === key)?.value;
  return ind;
};

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
            <select
              v-model="selectedCategory"
              class="w-full rounded-md border border-gray-300 p-2 text-sm"
            >
              <option value="">Todas las categorías</option>
              <option
                v-for="category of categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>

          <div class="flex flex-col">
            <input
              type="month"
              v-model="fecha"
              class="border p-2 rounded-md border-gray-300"
            />
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
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="computo.length === 0">
                <TableCell
                  colspan="4"
                  class="text-center py-8 text-muted-foreground"
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
                  {{ getComputo(key + "") ?? "-" }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>
