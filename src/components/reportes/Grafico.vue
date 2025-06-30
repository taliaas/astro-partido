<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-zinc-800">
    <div class="max-w-[1600px] mx-auto p-6">
      <!-- Main Card -->
      <div>
        <div class="mb-8 text-center">
          <h2 class="text-2xl font-medium text-gray-900 dark:text-white">
            Estado del Funcionamiento PCC CUJAE
          </h2>
          <p class="text-gray-600 text-lg dark:text-gray-300 font-semibold">
            Comité UJC CUJAE
          </p>
        </div>

        <div
          class="mb-8 rounded-lg border bg-white dark:bg-zinc-800 dark:border-gray-400 p-6 shadow-sm"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Filtros</h3>
            <button
              @click="isFilterVisible = !isFilterVisible"
              class="flex items-center space-x-2 rounded px-4 py-2 text-sm font-medium hover:bg-gray-100"
            >
              <span>{{
                isFilterVisible ? "Ocultar filtros" : "Mostrar filtros"
              }}</span>
              <ChevronDownIcon
                :class="{ 'rotate-180 transform': isFilterVisible }"
                class="h-5 w-5 transition-transform duration-200"
              />
            </button>
          </div>

          <div class="grid gap-6 md:grid-cols-3" v-show="isFilterVisible">
            <div class="space-y-2">
              <label
                class="text-md font-medium text-gray-700 dark:text-gray-300"
                >Indicadores</label
              >
              <select
                v-model="selectedIndicator"
                class="w-full rounded-md border border-gray-300 p-2 text-sm"
              >
                <option
                  v-for="indicador in indicators"
                  :key="indicador.key"
                  :value="indicador.name"
                >
                  {{ indicador.name }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label
                class="text-md font-medium dark:text-gray-300 text-gray-700"
                >Periodo</label
              >
              <select
                v-model="selectedPeriod"
                class="w-full rounded-md border border-gray-300 p-2 text-sm"
              >
                <option value="1">Semestre 1</option>
                <option value="2">Semestre 2</option>
                <option value="3">Anual</option>
              </select>
            </div>

            <div class="space-y-2">
              <label
                class="text-md font-medium dark:text-gray-300 text-gray-700"
                >Año</label
              >
              <input
                type="number"
                v-model="selectedYear"
                :max="current_year"
                class="w-full rounded-md border border-gray-300 p-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div class="rounded-lg border bg-white dark:bg-zinc-800 p-6 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold">Comportamiento de Indicadores</h3>
            <button
              @click="exportToPDF"
              class="inline-flex items-center rounded-md bg-button px-4 py-2 text-sm font-medium text-white"
            >
              Exportar
            </button>
          </div>

          <div ref="chartContainer" class="h-[400px] w-full">
            <LineChart
              class="dark:text-white"
              :data="chartData"
              :options="chartOptions"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { ChartData } from "chart.js";
import {
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
import { Line as LineChart } from "vue-chartjs";
import { ChevronDownIcon } from "lucide-vue-next";
import StatusService from "@/services/StatusService.ts";
import {indicators} from "@/lib/indicadoresKey.ts";
import {toast} from "vue-sonner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);
const isFilterVisible = ref(true);
const selectedIndicator = ref("Orden del Día");
const current_year = new Date().getFullYear();
const selectedYear = ref(2025);
const selectedPeriod = ref("1");
const chartContainer = ref(null);

const chartData = ref<ChartData<"line">>({ labels: [], datasets: [] });

const selectedIndicatorText = computed(() => {
  return (
    indicators.find((indicator) => indicator.name === selectedIndicator.value) || "N/A"
  );
});

const colors = [
  { border: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
  { border: "#ae3bf6", bg: "rgba(149,59,246,0.1)" },
  { border: "#3bf67c", bg: "rgba(59,246,90,0.1)" },
];

//limpiar el grafico si da error y notificar
const fetchData = async () => {
  const months =
    selectedPeriod.value === "1"
      ? ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]
      : selectedPeriod.value === "2"
        ? ["Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        : [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic",
          ];
  const service = new StatusService();
  try {
    const { data: indData } = await service.getYear(selectedYear.value);
    const yearData = indData[selectedIndicator.value];

    const semesterData =
      selectedPeriod.value === "1"
        ? yearData.slice(0, 6)
        : selectedPeriod.value === "2"
          ? yearData.slice(6, 12)
          : yearData;

    chartData.value = {
      labels: months,
      datasets: [
        "atencionFEU",
        "atencionUJC",
        "funcionamientoSindicato",
      ].includes(selectedIndicator.value)
        ? [
            {
              label: "Atención FEU",
              data: indData["atencionFEU"],
              borderColor: colors[0].border,
              backgroundColor: colors[0].bg,
              tension: 0.4,
              fill: true,
            },
            {
              label: "Atención UJC",
              data: indData["atencionUJC"],
              borderColor: colors[1].border,
              backgroundColor: colors[1].bg,
              tension: 0.4,
              fill: true,
            },
            {
              label: "Funcionamiento del Sindicato",
              data: indData["funcionamientoSindicato"],
              borderColor: colors[2].border,
              backgroundColor: colors[2].bg,
              tension: 0.4,
              fill: true,
            },
          ]
        : [
            {
              label: selectedIndicatorText.value,
              data: semesterData,
              borderColor: colors[0].border,
              backgroundColor: colors[0].bg,
              tension: 0.4,
              fill: true,
            },
          ],
    };
  } catch (error) {
    console.log(error);
    chartData.value = {
      labels: months,
      datasets: [
        {
          label: selectedIndicatorText.value,
          data: [],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
    toast.error("Error al cargar el indicador", "error");
  }
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,

      ticks: {
        stepSize: 2,
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
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
  },
};

const exportToPDF = async () => {
  try {
    const canvas = await html2canvas(chartContainer.value);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("l", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.text("Estado del Funcionamiento PCC CUJAE", 14, 15);

    pdf.text(
      `Indicador: ${selectedIndicatorText.value} - Año: ${selectedYear.value} - Semestre: ${selectedPeriod.value}`,
      14,
      25,
    );
    pdf.addImage(imgData, "PNG", 10, 30, pdfWidth - 20, pdfHeight - 20);

    pdf.save(
      `estado-funcionamiento-${selectedYear.value}-S${selectedPeriod.value}.pdf`,
    );
  } catch (error) {
    console.error("Error exporting PDF:", error);
  }
};
// Watch for changes in filters
watch([selectedYear, selectedIndicator, selectedPeriod], () => {
  fetchData();
});

// Initial data fetch
onMounted(() => {
  fetchData();
});
</script>
