<script setup lang="ts">
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import Label from "@/components/ui/label/Label.vue";
import Select from "@/components/ui/select/Select.vue";
import SelectContent from "@/components/ui/select/SelectContent.vue";
import SelectGroup from "@/components/ui/select/SelectGroup.vue";
import SelectItem from "@/components/ui/select/SelectItem.vue";
import SelectTrigger from "@/components/ui/select/SelectTrigger.vue";
import SelectValue from "@/components/ui/select/SelectValue.vue";
import { indicators, type Indicators } from "@/utils/indicators";
import { useUrlSearchParams } from "@vueuse/core";
import { navigate } from "astro:transitions/client";
import type { ChartData, ChartOptions } from "chart.js";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line as LineChart, Bar as BarChart } from "vue-chartjs";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataComputo {
  mes: string;
  previous: number;
  current: number;
}

const { computo } = defineProps<{
  computo: DataComputo[];
}>();

const searchParams = useUrlSearchParams("history");
const indicator = indicators[searchParams.key as keyof Indicators];
const handleKey = (value: any) => {
  navigate("?key=" + value);
};

const chartData = {
  labels: computo.map((c) => c.mes),
  datasets: [
    {
      label: "Anterior",
      borderColor: "#3B82F6",
      background: "rgba(59, 130, 246, 0.1)",
      data: computo.map((s) => s.previous),
    },
    {
      label: "Actual",
      borderColor: "#BBDCE5",
      background: "rgba(59, 130, 246, 0.1)",
      data: computo.map((s) => s.current),
    },
  ],
};
const lineChartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,

      ticks: {
        stepSize: 1,
      },
      grid: {
        display: true,
        color: "rgba(0, 0, 0, 0.05)",
      },
    },
    x: {
      grid: {
        display: true,
      },
    },
  },
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        pointStyle: "line",
        padding: 20,
      },
    },
  },
};

const data = {
  labels: computo.map((c) => c.mes),
  datasets: [
    {
      label: "",
      backgroundColor: "#3B82F6",
      data: computo.map((s) => s.previous),
    },
    {
      label: "Actual",
      backgroundColor: "#BBDCE5",
      data: computo.map((s) => s.current),
    },
  ],
}
const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
      grid: {
        display: true,
        color: "rgba(0, 0, 0, 0.05)",
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};
</script>

<template>
  <div class="max-w-[1600px] mx-auto space-y-2">
    <div class="flex">
      <div class="flex gap-4 space-y-2">
        <h1 class="text-2xl font-semibold text-gray-900">
          Análisis Gráfico del Núcleo
        </h1>
      </div>
    </div>
    <div class="space-y-4">
      <!-- Tendencia Temporal podria comparar un ano con el otro -->
      <Card>
        <CardHeader>
          <div class="p-4 rounded">
            <div class="space-y-2">
              <Label
                class="text-md font-medium text-gray-700 dark:text-gray-300"
                >Indicadores</Label
              >
              <Select
                :default-value="searchParams.key"
                @update:model-value="handleKey($event)"
              >
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <template v-for="(value, key) in indicators" :key="key">
                      <SelectItem v-if="'chartType' in value" :value="key">
                        {{ value.name }}
                      </SelectItem>
                    </template>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <!-- Aquí iría el gráfico de línea para la tendencia temporal -->
          <div
            v-if="
              indicator &&
              'chartType' in indicator &&
              indicator.chartType === 'line'
            "
            class="h-[400px] w-full"
          >
            <LineChart :data="chartData" :options="lineChartOptions" />
          </div>
          <div
            v-if="
              indicator &&
              'chartType' in indicator &&
              indicator.chartType === 'bar'
            "
          >
            <BarChart
              :data="data" :options="options"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
