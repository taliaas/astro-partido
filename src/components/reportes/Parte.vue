<template>
  <div class="max-w-6xl mx-auto space-y-6 p-4">
    <div>
      <h2 class="text-2xl font-semibold text-center mb-4">Parte Municipio PCC Marianao</h2>
      <div class="flex flex-col sm:flex-row gap-2 mb-6">
        <div class="relative flex-grow">
          <Search class="left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 absolute" />
          <input
              v-model="search"
              placeholder="Buscar categoría o sector..."
              class="w-full p-2 border text-base pl-10 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div class="flex items-center gap-2">
          <input
              type="month"
              v-model="selectedMonth"
              class="rounded-md border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Categorías desplegables -->
      <div class="space-y-3">
        <div
            v-for="(category, index) in filteredCategories"
            :key="index"
            class="overflow-hidden"
        >
          <Collapsible>
            <CollapsibleTrigger
                class="flex items-center group w-full justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center">
                <span class="text-gray-800">{{ category.name }}</span>
                <Badge variant="outline" class="ml-2 bg-gray-100 text-gray-700">
                  {{ category.sectors.length }}
                </Badge>
              </div>
              <ChevronDownIcon
                  class="h-5 w-5 text-gray-500 group-data-[state=open]:rotate-180 transition-transform"
              />
            </CollapsibleTrigger>
            <CollapsibleContent class="bg-white border border-t-0 border-gray-200 rounded-b-lg shadow-sm">
              <div class="divide-y divide-gray-100">
                <div
                    v-for="(sector, sectorIndex) in category.sectors"
                    :key="sectorIndex"
                    class="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium text-gray-800">{{ sector }}</span>
                      <HoverCard v-if="hasNote(category.name, sector)">
                        <HoverCardTrigger>
                          <div class="flex items-center justify-center w-5 h-5 rounded-full text-blue-600 cursor-pointer">
                            <AlertCircleIcon class="w-4 h-4" />
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent class="w-80">
                          <div class="text-sm">
                            <h4 class="font-medium mb-1">Nota informativa</h4>
                            <p class="text-gray-600">{{ getNote(category.name, sector) }}</p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <div class="flex items-center gap-2">
                      <Badge
                          :variant="getValue(category.name, sector) > 0 ? 'default' : 'outline'"
                          :class="getValueClass(category.name, sector)"
                      >
                        {{ getValue(category.name, sector) }}
                      </Badge>
                      <span v-if="isPercentage(category.name, sector)" class="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <!-- Sin resultados -->
      <div v-if="filteredCategories.length === 0" class="text-center py-10">
        <FileSearchIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-semibold text-gray-900">No se encontraron resultados</h3>
        <p class="mt-1 text-sm text-gray-500">
          No hay categorías que coincidan con tu búsqueda.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon, Search, AlertCircleIcon, FileSearchIcon } from "lucide-vue-next";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { ref, computed } from "vue";

interface ColumnData {
  name: string;
  sectors: string[];
}

const search = ref("");
const selectedMonth = ref("2024-03");

// Datos de categorías y sectores
const Categories = ref<ColumnData[]>([
  {
    name: "Organizaciones de Base y Militantes (SICOM)",
    sectors: ["Núcleos SICOM", "Comités PCC SICOM", "Total Org Base (Núcleos + Ctés) SICOM", "Total de Efectivos SICOM"]
  },
  {
    name: "Núcleos Mixtos",
    sectors: ["Total de Núcleos Mixtos", "Núcleos Mixtos con 3 o más Milit UJC", "Milit PCC en Núcleos Mixtos", "Milit UJC en Núcleos Mixtos"]
  },
  {
    name: "Reuniones Realizadas y Asistencia en Núcleos del Partido",
    sectors: [
      "Reuniones Ordinarias de Núcleos Planificadas",
      "Reuniones Ordinarias de Núcleos Efect.",
      "Reun Ordinarias de Núcleos NO Efect",
      "% Reun Efectuadas",
      "Total de Militantes A Asistir Art 17 Reglamento OB",
      "Milit que Asisten",
      "% Asistencia",
      "Milit Ausentes",
      "De ellos: Injustificados",
      "Injustificados Analizados",
      "Analizados con medidas",
      "Total Justificados",
      "De ellos: Problemas Personales, otros",
      "Enfermos/ Licencias",
      "Trabajando",
      "Reuniones en las que se cumple con el Art. 22",
      "% del total de reuniones"
    ]
  },
  {
    name: "Invitados a reuniones de Núcleos del Partido",
    sectors: [
      "Invitados de la UJC",
      "Inv. Trabaj",
      "Invitados S. Sindical",
      "Invitados Administrativos",
      "Total de Invitados",
      "Núcleos que NO invitan a no militantes en el semestre (Dato de JUNIO)",
      "% Contra el total de Núcleos"
    ]
  },
  {
    name: "Rendiciones de cuentas",
    sectors: [
      "Militantes que rinden cuenta (Todos en el año)",
      "% del total",
      "De Ellos: Dirigentes administrativos rinden ctas",
      "% Dirig Adm rinden cuentas"
    ]
  },
  {
    name: "Temas de análisis en los Núcleos del Partido",
    sectors: [
      "Núcleos q atienden C/B UJC (Dato JUNIO)",
      "De ellos: reuniones donde se analiza el tema UJC (acumulado)",
      "%",
      "Núcleos que atienden C/B UJC y en el semestre NO evalúan este tema 1 vez en el trimestre",
      "% de núcleos que en el trimestre evalúa Tema UJC",
      "Núcleos con S/Sindical (Dato JUNIO)",
      "De ellos: Reuniones donde analizan tema S/Sindical (acumulado)",
      "%",
      "Núcleos con S/Sindical y en el Semestre NO evalúan este tema 1 vez en el trimestre",
      "% de núcleos que en el trimestre evaluaron Tema Sindical",
      "Núcleos que deben análizar Política Cuadros (Dato JUNIO)",
      "Núcleos que analizan Política Cuadros (acumulado)",
      "%",
      "Núcleos que en el Semestre NO evaúan Política de Cuadros 1 vez en el Trimestre",
      "% de núcleos que en el trimestre evaluaron Política de Cuadros",
      "Núcleos q Analizan Actividad fundam.",
      "% Contra Reuniones Efectuadas",
      "Activ. Fund sin Acuerdo",
      "% que no adoptan acuerdos de AF"
    ]
  },
  {
    name: "Análisis del Tema Enfrentamiento al Delito en el Municipio",
    sectors: [
      "Núcleos aprobados mensual analiz Delito",
      "Núcleos analizan Delito",
      "%",
      "Total de Núcleos q en el Semestre NO analizaron tema DELITO de los obligados hacerlo (Acumula)",
      "% de núcleos que NO evaluaron tema delito cada mes obligado hacerlo",
      "Total de Núcleos en General que evalúan delito"
    ]
  },
  {
    name: "Datos en los 6 meses",
    sectors: [
      "Reunión Ordinaria de Núcleo NO Visitada 1 vez en el Semestre RSB 669",
      "% de Núcleos a los que no se les llegó a la reunión ordinaria 1 vez en el Semestre",
      "Reunión Ordinaria de Ctés NO Visitada 2 veces en el Semestre RSB 669",
      "% de Comités a los que no se les llegó a la reunión ordinaria 2 veces en el Semestre"
    ]
  },
  {
    name: "Participación de los Funcionarios y Coordinadores Políticos",
    sectors: [
      "Participación en Reunión Ordinaria de Núcleos",
      "Participación en Reunión Ordinaria de Comités",
      "Reunión Extraordinaria O/B",
      "Reunión de Estudios Pol.",
      "Reunión de Afiliados o Asociados",
      "Reunión de CB o Cté UJC",
      "Reunión de Consejo Dirección",
      "Reunión de Comisiones de Cuadros",
      "Total participación"
    ]
  },
  {
    name: "Participación de los Primeros Secretarios y Miembros de los Burós Ejecutivos",
    sectors: [
      "Participación en Reunión Ordinaria de Núcleos",
      "Participación en Reunión Ordinaria de Comités",
      "Reunión de Extraord. O/B Núcleos y Ctés",
      "Reunión de Estudios Políticos",
      "Reunión de Afiliados o Asociados",
      "Reunión de CB o Cté UJC",
      "Reunión de Consejo Dirección",
      "Reunión de Comisión Cuadros",
      "Total Participación PS y MB",
      "Total General de Participac. Cuadros"
    ]
  },
  {
    name: "Reuniones de Secretarios Generales de Núcleos del Partido",
    sectors: [
      "Secretarios Generales Núcleos a Asistir",
      "Asisten a la Reunión Secretarios Generales",
      "% Asist Reunión Sec Generales",
      "Sec Gen Ausentes",
      "Sec Gen Analizados",
      "Sec Gen Con Medidas",
      "Sec Gen No Idoneos (no acumula)",
      "Sec Gen Renovados de los no idóneos",
      "% Sec Gen Renovados (de los no idóneos)"
    ]
  }
]);

// Datos simulados para cada sector
const sectorData = ref({
  // Organizaciones de Base y Militantes (SICOM)
  "Núcleos SICOM": 24,
  "Comités PCC SICOM": 4,
  "Total Org Base (Núcleos + Ctés) SICOM": 28,
  "Total de Efectivos SICOM": 315,

  // Núcleos Mixtos
  "Total de Núcleos Mixtos": 1,
  "Núcleos Mixtos con 3 o más Milit UJC": 0,
  "Milit PCC en Núcleos Mixtos": 16,
  "Milit UJC en Núcleos Mixtos": 2,

  // Otros sectores con valores simulados
  "Reuniones Ordinarias de Núcleos Planificadas": 45,
  "Reuniones Ordinarias de Núcleos Efect.": 42,
  "Reun Ordinarias de Núcleos NO Efect": 3,
  "% Reun Efectuadas": 93,
  "Total de Militantes A Asistir Art 17 Reglamento OB": 320,
  "Milit que Asisten": 290,
  "% Asistencia": 91,
  "Milit Ausentes": 30,
  "De ellos: Injustificados": 5,
  "Injustificados Analizados": 5,
  "Analizados con medidas": 2,
  "Total Justificados": 25,
  "De ellos: Problemas Personales, otros": 10,
  "Enfermos/ Licencias": 8,
  "Trabajando": 7,
  "Reuniones en las que se cumple con el Art. 22": 40,
  "% del total de reuniones": 95,
});

// Notas adicionales para algunos sectores
const sectorNotes = ref({
  "Total de Núcleos Mixtos": "Artículo 3. Se podrán constituir núcleos mixtos con militantes del Partido y de la Unión de Jóvenes Comunistas en los centros de trabajo donde existan pocos militantes de la organización juvenil o se considere conveniente para el trabajo político-ideológico.",
  "Milit PCC en Núcleos Mixtos": "El secretario general del núcleo mixto será en todos los casos militante del Partido.",
  "% Reun Efectuadas": "Se considera efectuada cuando asiste más del 75% de los militantes.",
  "Reuniones en las que se cumple con el Art. 22": "El Artículo 22 establece que las reuniones deben ser preparadas con antelación y contar con una agenda definida.",
  "Núcleos que deben análizar Política Cuadros (Dato JUNIO)": "Dato que se recoge semestralmente en junio y diciembre.",
  "Sec Gen No Idoneos (no acumula)": "Este dato no se acumula mes a mes, representa el estado actual.",
});

// Sectores que representan porcentajes
const percentageSectors = [
  "% Reun Efectuadas",
  "% Asistencia",
  "% del total de reuniones",
  "% Contra el total de Núcleos",
  "% del total",
  "% Dirig Adm rinden cuentas",
  "%",
  "% de núcleos que en el trimestre evalúa Tema UJC",
  "% de núcleos que en el trimestre evaluaron Tema Sindical",
  "% de núcleos que en el trimestre evaluaron Política de Cuadros",
  "% Contra Reuniones Efectuadas",
  "% que no adoptan acuerdos de AF",
  "% de núcleos que NO evaluaron tema delito cada mes obligado hacerlo",
  "% de Núcleos a los que no se les llegó a la reunión ordinaria 1 vez en el Semestre",
  "% de Comités a los que no se les llegó a la reunión ordinaria 2 veces en el Semestre",
  "% Asist Reunión Sec Generales",
  "% Sec Gen Renovados (de los no idóneos)"
];

// Filtrar categorías según la búsqueda
const filteredCategories = computed(() => {
  if (!search.value) return Categories.value;

  const searchTerm = search.value.toLowerCase();

  return Categories.value.filter(category => {
    // Buscar en el nombre de la categoría
    if (category.name.toLowerCase().includes(searchTerm)) return true;

    // Buscar en los sectores de la categoría
    return category.sectors.some(sector =>
        sector.toLowerCase().includes(searchTerm)
    );
  });
});

// Verificar si un sector tiene nota adicional
const hasNote = (categoryName: string, sector: string) => {
  return sectorNotes.value[sector] !== undefined;
};

// Obtener la nota de un sector
const getNote = (categoryName: string, sector: string) => {
  return sectorNotes.value[sector] || "";
};

// Obtener el valor de un sector
const getValue = (categoryName: string, sector: string) => {
  return sectorData.value[sector] !== undefined ? sectorData.value[sector] : 0;
};

// Verificar si un sector representa un porcentaje
const isPercentage = (categoryName: string, sector: string) => {
  return percentageSectors.includes(sector);
};

// Obtener la clase CSS para el valor según su tipo
const getValueClass = (categoryName: string, sector: string) => {
  const value = getValue(categoryName, sector);

  if (isPercentage(categoryName, sector)) {
    if (value >= 90) return "bg-green-100 text-green-800";
    if (value >= 70) return "bg-green-50 text-green-600";
    if (value >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  }

  return value > 0 ? "bg-blue-100 text-blue-800" : "text-gray-500";
};
</script>