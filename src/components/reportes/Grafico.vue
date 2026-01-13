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
            {{
              session.user.role.name !== roleEnum.Cmte
                ? `${session.user.militant.core.name} CUJAE`
                : "Comité UJC CUJAE"
            }}
          </p>
        </div>

        <div
          class="mb-8 rounded-lg border bg-white dark:bg-zinc-800 dark:border-gray-400 p-6 shadow-sm"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold">Filtros</h3>
            <Button
              @click="isFilterVisible = !isFilterVisible"
              variant="outline"
            >
              <span>{{
                isFilterVisible ? "Ocultar filtros" : "Mostrar filtros"
              }}</span>
              <ChevronDownIcon
                :class="{ 'rotate-180 transform': isFilterVisible }"
                class="h-5 w-5 transition-transform duration-200"
              />
            </Button>
          </div>

          <div class="grid gap-6 md:grid-cols-3" v-show="isFilterVisible">
            <div class="space-y-2">
              <Label>Indicadores</Label>
              <Select v-model="selectedIndicator">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Seleccione un indicador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="(item, key) in indicators"
                    :key="key"
                    :value="key"
                  >
                    {{ item.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Periodo</Label>
              <Select v-model="selectedPeriod">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Seleccione un periodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semestre 1</SelectItem>
                  <SelectItem value="2">Semestre 2</SelectItem>
                  <SelectItem value="3">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Año</Label>
              <Input
                id="year"
                type="number"
                v-model="selectedYear"
                :max="current_year"
                @click="$event.target.select()"
              />
            </div>
          </div>
        </div>

        <div class="rounded-lg border bg-white dark:bg-zinc-800 p-6 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold">Comportamiento de Indicadores</h3>
            <Button @click="exportToPDF"> Exportar </Button>
          </div>
          <div v-if="barIndicators.includes(selectedIndicator)">
            <BarChart :data="barData" :options="stackedChartOptions" />
          </div>
          <div v-else ref="chartContainer" class="h-[400px] w-full">
            <LineChart
              class="dark:text-white"
              :data="lineData"
              :options="lineChartOptions"
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
import { ChevronDownIcon } from "lucide-vue-next";
import { indicators } from "@/utils/indicators";
import { toast } from "vue-sonner";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { navigate } from "astro:transitions/client";
import { roleEnum } from "@/enum/roleEnum";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const {
  data: indData,
  year,
  session,
} = defineProps<{
  data: Record<string, number[]>;
  year: number;
  session: any;
}>();

const isFilterVisible = ref(true);
const selectedIndicator = ref("ptos");
const current_year = new Date().getFullYear();
const selectedYear = ref(year);
const selectedPeriod = ref("1");
const chartContainer = ref(null);
const barIndicators = [
  "atencionFEU",
  "atencionUJC",
  "funcionamientoSindicato",
  "rendicionMilitante",
  "rendicionDirigente",
  "rendicionOrganizacionesYOtros",
];

const barData = ref<ChartData<"bar">>({ labels: [], datasets: [] });
const lineData = ref<ChartData<"line">>({ labels: [], datasets: [] });

const selectedIndicatorText = computed(() => {
  const entry = Object.entries(indicators).find(
    ([key]) => key === selectedIndicator.value
  );
  return entry?.[1]?.name ?? "";
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

  try {
    const yearData = indData[selectedIndicator.value];
    const semesterData =
      selectedPeriod.value === "1"
        ? yearData.slice(0, 6)
        : selectedPeriod.value === "2"
          ? yearData.slice(6, 12)
          : yearData;

    barData.value = {
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
            },
            {
              label: "Atención UJC",
              data: indData["atencionUJC"],
              borderColor: colors[1].border,
              backgroundColor: colors[1].bg,
            },
            {
              label: "Funcionamiento del Sindicato",
              data: indData["funcionamientoSindicato"],
              borderColor: colors[2].border,
              backgroundColor: colors[2].bg,
            },
          ]
        : [
              "rendicionMilitante",
              "rendicionDirigente",
              "rendicionOrganizacionesYOtros",
            ].includes(selectedIndicator.value)
          ? [
              {
                label: "Rendición de militantes",
                data: indData["rendicionMilitante"],
                borderColor: colors[0].border,
                backgroundColor: colors[0].bg,
              },
              {
                label: "Rendición de dirigentes",
                data: indData["rendicionDirigente"],
                borderColor: colors[1].border,
                backgroundColor: colors[1].bg,
              },
              {
                label: "Rendición de organizaciones y otros",
                data: indData["rendicionOrganizacionesYOtros"],
                borderColor: colors[2].border,
                backgroundColor: colors[2].bg,
              },
            ]
          : [
              {
                label: selectedIndicatorText.value,
                data: semesterData,
                borderColor: colors[0].border,
                backgroundColor: colors[0].bg,
              },
            ],
    };
    lineData.value = {
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
              "rendicionMilitante",
              "rendicionDirigente",
              "rendicionOrganizacionesYOtros",
            ].includes(selectedIndicator.value)
          ? [
              {
                label: "Rendición de militantes",
                data: indData["rendicionMilitante"],
                borderColor: colors[0].border,
                backgroundColor: colors[0].bg,
                tension: 0.4,
                fill: true,
              },
              {
                label: "Rendición de dirigentes",
                data: indData["rendicionDirigente"],
                borderColor: colors[1].border,
                backgroundColor: colors[1].bg,
                tension: 0.4,
                fill: true,
              },
              {
                label: "Rendición de organizaciones y otros",
                data: indData["rendicionOrganizacionesYOtros"],
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
    barData.value = {
      labels: months,
      datasets: [
        {
          label: selectedIndicatorText.value,
          data: [],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
        },
      ],
    };
    lineData.value = {
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
    toast.error("Error al cargar el indicador", { duration: 5000 });
  }
};

const lineChartOptions = {
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
      position: "top" as const,
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
  },
};

const stackedChartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      stacked: true,
      ticks: {
        stepSize: 2,
      },
      grid: {
        display: true,
        color: "rgba(0, 0, 0, 0.05)",
      },
    },
    x: {
      stacked: true,
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
  },
};

const exportToPDF = async () => {
  try {
    if (!chartContainer.value) {
      toast.error("No se pudo encontrar el gráfico para exportar.");
      return;
    }
    const canvas = await html2canvas(chartContainer.value as HTMLElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("l", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.text("Estado del Funcionamiento PCC CUJAE", 14, 15);

    pdf.text(
      `Indicador: ${selectedIndicatorText.value} - Año: ${selectedYear.value} - Semestre: ${selectedPeriod.value}`,
      14,
      25
    );
    pdf.addImage(imgData, "PNG", 10, 30, pdfWidth - 20, pdfHeight - 20);

    pdf.save(
      `estado-funcionamiento-${selectedYear.value}-S${selectedPeriod.value}.pdf`
    );
  } catch (error) {
    console.error("Error exporting PDF:", error);
  }
};

// Watch for changes in filters
watch([selectedYear, selectedIndicator, selectedPeriod], () => {
  fetchData();
});

// Watch for changes in selectedYear to update the URL query param
watch(selectedYear, (newYear) => {
  navigate(`/reports?year=${newYear}`);
});

watch(barData, () => console.log(barData.value));
watch(lineData, () => console.log(lineData.value));

// Initial data fetch
onMounted(() => {
  fetchData();
});
</script>
