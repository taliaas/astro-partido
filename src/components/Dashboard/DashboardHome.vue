<template>
  <div class="container mx-auto p-6 bg-gray-50 dark:bg-zinc-800">
    <div class="grid gap-6 md:grid-cols-[1fr_300px]">
      <div class="space-y-6">
        <h1 class="text-3xl font-bold text-blue-600 dark:text-blue-400">
          Panel de Control de KPIs
        </h1>
        <div class="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          <Card
            v-for="(card, index) in cards"
            :key="index"
            class="bg-secondary rounded shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 ease-in-out"
          >
            <CardHeader
              class="flex flex-row items-center justify-between space-y-0 pb-2"
            >
              <CardTitle class="text-md font-semibold">{{
                card.title
              }}</CardTitle>
              <component :is="icons[card.icon]" class="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent class="flex items-baseline space-x-4 text-center">
              <div class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ card.value }}
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs v-model="activeTab" class="space-y-4">
          <TabsList class="grid w-full grid-cols-1 md:grid-cols-2 h-auto">
            <TabsTrigger
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
            >
              {{ tab.label }}
            </TabsTrigger>
          </TabsList>
          <TabsContent
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
            class="space-y-4"
          >
            <component :is="tab.component" :documents :kpis />
          </TabsContent>
        </Tabs>
      </div>
      <div class="space-y-6 w-full md:w-[300px] mt-12">
        <RightSidebar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Activity, FileCheck2, Files, FileText } from "lucide-vue-next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Documents from "../Home/Documents.vue";
import KPIs from "../Home/KPIs.vue";
import RightSidebar from "./RightSidebar.vue";

const icons = { Activity, FileCheck2, Files, FileText };

const { documents, kpis, cards } = defineProps<{
  documents: any[];
  kpis: any[];
  cards: any;
}>();

const activeTab = ref("documents");
const updatedData = ref([]);

const tabs = [
  { value: "documents", label: "Documentos", component: Documents },
  { value: "kpis", label: "Análisis de Desempeño", component: KPIs },
];
</script>
