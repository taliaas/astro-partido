<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Eye,
  MoreVerticalIcon,
  Pencil,
  PlusIcon,
  XIcon,
  Download,
  ChevronLeft,
  ChevronRight,
  FileDown,
  HelpCircle,
} from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/index.js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button/index.js";
import { toast } from "vue-sonner";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { useUrlSearchParams } from "@vueuse/core";

const {
  sanciones,
  members,
  cores,
  page: initialPage,
} = defineProps<{
  sanciones: any;
  members: any[];
  cores: any[];
  page: number;
}>();

const searchTerm = ref("");
const showDetailsModal = ref(false);
const showModal = ref(false);
const showHelpModal = ref(false); //Estado para el modal de ayuda
const isEditing = ref(false);
const isLoading = ref(false);
const selectNucleo = ref("");
const statusFilter = ref("");
const searchParams = useUrlSearchParams();

//Datos de ayuda para las causas de sanciones
interface CausaSancion {
  titulo: string;
  descripcion: string;
  causas: string[];
  nota?: string;
}

const CAUSAS_SANCIONES: Record<string, CausaSancion> = {
  AMONESTACION: {
    titulo: "Amonestación",
    descripcion:
      "La sanción de amonestación es aplicable cuando el militante incurre en faltas o infracciones leves:",
    causas: [
      "Ausencias y llegadas tarde injustificadas al trabajo",
      "Incumplimiento con los deberes y el contenido de la labor específica",
      "Prestación incorrecta y deficiente de los servicios",
      "Falta de calidad en el trabajo que realiza",
      "Violaciones y descontrol sin grandes perjuicios en la gestión administrativa o política",
      "Falta de eficiencia en la labor de dirección",
      "Demoras injustificadas en el cumplimiento de las obligaciones tributarias",
      "No asistir sin justificación a reuniones del núcleo, reuniones de estudio y a otras actividades",
      "Demorarse injustificadamente en abonar la cotización",
      "No conservar correctamente el carné del Partido",
      "Violar las normas de traslado",
      "Mantener una conducta social inadecuada sin graves consecuencias",
      "Infringir lo establecido en materia de telecomunicaciones, las TIC y en el uso del espectro radioeléctrico nacional, sin que se produzca afectación a la entidad, al Partido o al país",
    ],
  },
  SEPARACION_CARGO: {
    titulo: "Separación del Cargo en el Partido",
    descripcion:
      "Esta sanción es aplicable cuando un militante, miembro de un organismo de dirección o que ocupe un cargo, comete faltas como:",
    causas: [
      "Adoptar medidas unipersonales erróneas",
      "No promover la necesaria dirección colectiva",
      "Impedir, dificultar o no ejercer la crítica",
      "No cumplir u obstaculizar la política trazada en la formación, selección, ubicación, promoción y superación de los cuadros",
      "Usar métodos de dirección autoritarios, ajenos al Partido",
      "Abusar de la autoridad que le confiere el cargo y aplicar métodos incorrectos",
      "Incumplir tareas por irresponsabilidad",
      "Actuar con negligencia o cometer faltas leves reiteradas en su puesto de trabajo",
      "Otras faltas similares que afecten su autoridad ante los militantes con los cuales trabaja o ante la masa de los no militantes que le rodean",
    ],
  },
  SUSPENSION_TEMPORAL: {
    titulo: "Suspensión Temporal de Derechos del Militante",
    descripcion:
      "Esta sanción es aplicable al militante que incurre en la infracción de los Estatutos, o comete otras faltas que demuestren que no ha comprendido cabalmente sus responsabilidades:",
    causas: [
      "Ausencias y llegadas tarde reiteradas e injustificadas al trabajo",
      "Incumplimiento frecuente de los deberes y del contenido de la labor específica",
      "Prestación incorrecta y deficiente de los servicios en forma repetida",
      "Falta de calidad por deficiencias en el trabajo",
      "Violaciones y descontrol en la dirección administrativa o política",
      "Deficiencias, incumplimientos o falta de exigencia en la labor de dirección administrativa o política",
      "Incumplimientos reiterados de las obligaciones tributarias",
      "Incumplir en forma injustificada y repetida las actividades internas del Partido",
      "Violar las normas de traslado e incurrir en otros factores agravantes que muestren una actitud negligente o de desinterés",
      "Observar una conducta social inadecuada que afecte su prestigio por incumplimientos, negligencias en las actividades de la defensa y seguridad nacional y sociales",
      "Violar sin graves consecuencias la legalidad socialista",
      "Ser irreflexivo de forma reiterativa ante la crítica, o ejercerla para con los demás de forma agresiva u ofensiva",
      "La falta de valentía política para enfrentar las manifestaciones que debilitan la ideología de la Revolución, en el espacio físico y digital",
      "Infringir lo establecido en materia de telecomunicaciones, las TIC y en el uso del espectro radioeléctrico nacional, sin graves afectaciones a la entidad, al Partido o al país",
    ],
    nota: "El militante suspendido no tendrá derecho, durante el plazo de vigencia, a ejercer el voto en las decisiones partidistas ni a desempeñar o ser elegido para ocupar cargos en el Partido. Esta sanción se puede adoptar por un período no mayor de un año ni menor de tres meses.",
  },
  SEPARACION_FILAS: {
    titulo: "Separación de las Filas del Partido",
    descripcion:
      "Este tipo de sanción se aplica cuando el militante incurrió en algunos de los errores siguientes:",
    causas: [
      "Negligencia o irresponsabilidad grave de sus actividades laborales, estudiantiles, de la defensa y seguridad nacional o sociales",
      "Incumplimiento de acuerdos que motiven graves perjuicios para el funcionamiento o el prestigio del Partido",
      "Dejarse arrastrar a fracciones u otras actividades de este tipo que tiendan a dividir al Partido",
      "Mantener una conducta no acorde con la moral socialista",
      "Haber cometido hechos que lo demeriten en el concepto público, haya sido o no sancionado legal o administrativamente por estos hechos",
      "Cometer fraude o alterar datos en el desempeño de sus funciones",
      "Negarse sin una justificación de peso a cumplir tareas importantes que le asigne el Partido",
      "Evadir sistemáticamente sus obligaciones tributarias",
      "Aprovechar su posición y jerarquía para obtener prebendas o privilegios para él, su familia o amigos",
      "Conocer y no denunciar hechos graves de corrupción o de otras violaciones graves de la legalidad",
      "Demostrar cobardía política y no enfrentar las manifestaciones que debilitan la ideología de la Revolución, en el espacio físico y el digital",
      "Infringir lo establecido en materia de telecomunicaciones, las TIC y en el uso del espectro radioeléctrico nacional, con graves afectaciones a la entidad, al Partido o al país",
      "Cuando el militante infringe los Estatutos del Partido Comunista de Cuba o las leyes del Estado, en forma tal que su conducta sea incompatible con su permanencia en las filas del Partido",
      "Cuando el militante reincide en la comisión de faltas previamente sancionadas y demuestra con su actitud que no está dispuesto a enmendar su conducta",
      "Militantes que siendo cuadros del Partido, del Gobierno, de entidades administrativas y empresariales, de la UJC y de las organizaciones de masas, planteen o demuestren con hechos su decisión de no continuar como militantes, o adopten otra ciudadanía",
    ],
    nota: "El militante a quien se le aplique esta sanción pierde su antigüedad en el Partido.",
  },
  EXPULSION: {
    titulo: "Expulsión de las Filas del Partido",
    descripcion: "Esta sanción será aplicable en los casos más graves:",
    causas: [
      "Traición",
      "Deserción",
      "Organización o participación activa en fracciones o actividades de este tipo que tiendan a dividir al Partido",
      "Comisión de delitos graves",
      "Corrupción u otra conducta social contraria a la moral y la legalidad socialista, a los cuales haya inducido conscientemente a otras personas",
      "Conductas que impliquen el desmerecimiento en el concepto público y una justa repulsa social",
      "Infringir lo establecido en materia de telecomunicaciones, las TIC y en el uso del espectro radioeléctrico nacional, con afectaciones muy graves a la entidad, al Partido o al país",
    ],
  },
};

//Paginación
const currentPage = ref(initialPage || 1);
const hasNextPage = ref(sanciones?.total || 1);

const EstadoSancion = [
  "PENDIENTE",
  "APROBADA_NUCLEO",
  "APROBADA_COMITE_PARTIDO",
  "APROBADA_COMITE_MUNICIPAL",
  "DENEGADA_NUCLEO",
  "DENEGADA_COMITE_PARTIDO",
  "DENEGADA_COMITE_MUNICIPAL",
  "CUMPLIDA",
] as const;

// Función para obtener estados disponibles según el tipo de sanción
const getAvailableEstados = (severidad: string) => {
  if (severidad === "AMONESTACION") {
    return ["DENEGADA_NUCLEO", "APROBADA_NUCLEO"];
  } else {
    return [
      "DENEGADA_NUCLEO",
      "DENEGADA_COMITE_PARTIDO",
      "DENEGADA_COMITE_MUNICIPAL",
      "APROBADA_NUCLEO",
      "APROBADA_COMITE_PARTIDO",
      "APROBADA_COMITE_MUNICIPAL",
    ];
  }
};

// Función para obtener el label legible del estado
const getEstadoLabel = (estado: string) => {
  const labels: Record<string, string> = {
    PENDIENTE: "Pendiente",
    APROBADA_NUCLEO: "Aprobada por el Núcleo",
    APROBADA_COMITE_MUNICIPAL: "Aprobada por el Comité Municipal",
    APROBADA_COMITE_PARTIDO: "Aprobada por el Comité del Partido",
    DENEGADA_NUCLEO: "Denegada por el Núcleo",
    DENEGADA_COMITE_PARTIDO: "Denegada por el Comité del Partido",
    DENEGADA_COMITE_MUNICIPAL: "Denegada por el Comité Municipal",
    CUMPLIDA: "Cumplida",
  };
  return labels[estado] || estado;
};

// Función para obtener clases CSS según el estado
const getEstadoBadgeClass = (estado: string) => {
  const classes: Record<string, string> = {
    PENDIENTE: "bg-gray-100 text-gray-800",
    APROBADA_NUCLEO: "bg-blue-100 text-blue-800",
    APROBADA_COMITE_MUNICIPAL: "bg-blue-100 text-blue-800",
    APROBADA_COMITE_PARTIDO: "bg-blue-100 text-blue-800",
    DENEGADA_NUCLEO: "bg-red-100 text-red-800",
    DENEGADA_COMITE_PARTIDO: "bg-red-200 text-red-900",
    DENEGADA_COMITE_MUNICIPAL: "bg-red-300 text-red-950",
    CUMPLIDA: "bg-green-100 text-green-800",
  };
  return classes[estado] || "bg-gray-100 text-gray-800";
};

// Función para obtener el label legible de la severidad
const getSeveridadLabel = (severidad: string) => {
  const labels: Record<string, string> = {
    AMONESTACION: "Amonestación",
    SEPARACION_CARGO: "Separación del cargo",
    SUSPENSION_TEMPORAL: "Suspensión temporal de derechos",
    SEPARACION_FILAS: "Separación de las filas",
    EXPULSION: "Expulsión",
  };
  return labels[severidad] || severidad;
};

// Función para formatear fecha en la TABLA y DETALLES
const formatDate = (date: string | Date) => {
  try {
    const dateStr = typeof date === "string" ? date : date.toISOString();
    const [year, month, day] = dateStr.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return "";
  }
};

// Función para formatear fecha en el MODAL DE EDICIÓN
const formatDateForEdit = (date: string | Date) => {
  try {
    const dateStr = typeof date === "string" ? date : date.toISOString();
    return dateStr.split("T")[0];
  } catch {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
};

const currentSanction = ref<{
  id?: number;
  causa: string;
  fecha: string;
  severidad: string;
  duracion: number;
  estado: (typeof EstadoSancion)[number];
  militante: {
    id: number | string;
    firstname?: string;
    lastname?: string;
  };
}>({
  causa: "",
  fecha: "",
  severidad: "",
  duracion: 0,
  estado: "PENDIENTE",
  militante: { id: "" },
});

const selectSanction = ref({
  causa: "",
  fecha: "",
  severidad: "AMONESTACION",
  duracion: 0,
  estado: "PENDIENTE" as (typeof EstadoSancion)[number],
  militante: {
    id: "",
    firstname: "",
    lastname: "",
    ci: "",
    core: { name: "" },
  },
});

const filteredSanctions = computed(() => {
  return sanciones?.data.filter((sanction: any) => {
    const matchesSearch =
      sanction?.militante.firstname
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase()) ||
      sanction.militante.lastname
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase());
    const matchedCores =
      selectNucleo.value === "" ||
      sanction?.militante.core.id === selectNucleo.value;
    const matchesStatus =
      statusFilter.value === "" || sanction.estado === statusFilter.value;
    return matchesSearch && matchesStatus && matchedCores;
  });
});

const openAddModal = () => {
  isEditing.value = false;
  currentSanction.value = {
    militante: { id: "" },
    causa: "",
    fecha: "",
    severidad: "",
    duracion: 0,
    estado: "PENDIENTE",
  };
  showModal.value = true;
};

const openDetails = (sancion: any) => {
  selectSanction.value = { ...sancion };
  showDetailsModal.value = true;
};

const editSanction = (sanction: any) => {
  isEditing.value = true;
  currentSanction.value = {
    ...sanction,
    fecha: formatDateForEdit(sanction.fecha),
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectSanction.value = {
    militante: {
      id: "",
      firstname: "",
      lastname: "",
      ci: "",
      core: { name: "" },
    },
    causa: "",
    fecha: "",
    severidad: "AMONESTACION",
    duracion: 0,
    estado: "PENDIENTE" as (typeof EstadoSancion)[number],
  };
};

//Función para cerrar el modal de ayuda
const closeHelpModal = () => {
  showHelpModal.value = false;
};

const saveSanction = async () => {
  isLoading.value = true;
  try {
    if (
      !currentSanction.value.militante.id ||
      currentSanction.value.militante.id === ""
    ) {
      toast.error("Debe seleccionar un militante");
      isLoading.value = false;
      return;
    }

    if (!currentSanction.value.severidad) {
      toast.error("Debe seleccionar un tipo de sanción");
      isLoading.value = false;
      return;
    }

    if (currentSanction.value.duracion <= 0) {
      toast.error("Debe seleccionar una duración válida");
      isLoading.value = false;
      return;
    }
    const fechaLocal = currentSanction.value.fecha;
    const fechaISO = `${fechaLocal}T12:00:00.000Z`;
    const sancionData = {
      ...currentSanction.value,
      fecha: fechaISO,
      militante: {
        id: Number(currentSanction.value.militante.id),
      },
    };

    console.log("Datos a enviar:", sancionData);

    if (isEditing.value) {
      await actions.sancion.updateSancion(sancionData as any);
      toast.success("Sanción actualizada correctamente");
    } else {
      await actions.sancion.createSancion(sancionData as any);
      toast.success("Sanción creada correctamente");
    }
    closeModal();
    navigate("");
  } catch (error: any) {
    console.error("Error completo:", error);
    toast.error(error?.message || "Error al guardar la sanción");
  } finally {
    isLoading.value = false;
  }
};

const exportar = async (id: number) => {
  try {
    toast.info("Generando PDF...");
    const result = await actions.sancion.exportSancion({ id });

    if (result.error) {
      toast.error(result.error.message || "Error al exportar");
      return;
    }

    const byteCharacters = atob(result.data.pdf);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.data.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Sanción exportada correctamente");
  } catch (error) {
    console.error("Error:", error);
    toast.error("No se pudo exportar la sanción");
  }
};

const exportarListado = async () => {
  try {
    toast.info("Generando listado de sanciones...");

    const result = await actions.sancion.exportListadoSanciones({
      estado: statusFilter.value || undefined,
      nucleoId: selectNucleo.value ? String(selectNucleo.value) : undefined,
    });

    if (result.error) {
      toast.error(result.error.message || "Error al exportar listado");
      return;
    }

    const byteCharacters = atob(result.data.pdf);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.data.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Listado exportado correctamente");
  } catch (error) {
    console.error("Error:", error);
    toast.error("No se pudo exportar el listado");
  }
};

// Funciones de paginación
function goToNextPage() {
  const query = new URLSearchParams(searchParams as any);
  const nextPage = Number(currentPage.value) + 1;
  if (currentPage.value < hasNextPage.value) {
    currentPage.value = nextPage;
    query.set("page", String(nextPage));
    navigate("?" + query.toString());
  }
}

function goToPreviousPage() {
  const query = new URLSearchParams(searchParams as any);
  const prevPage = Number(currentPage.value) - 1;
  if (currentPage.value > 1) {
    currentPage.value = prevPage;
    query.set("page", String(prevPage));
    navigate("?" + query.toString());
  }
}

const handleFilterByValue = (filter: string, value: any) => {
  const query = new URLSearchParams(searchParams as any);

  if (filter === "limit") {
    query.set("page", "1");
    currentPage.value = 1;
  }

  if (value && value !== "all") {
    query.set(filter, value);
  } else {
    query.delete(filter);
  }

  navigate("?" + query.toString());
};
</script>

<template>
  <div class="p-2 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gestión de Sanciones</h2>
        <p class="text-gray-600">
          Administra las sanciones disciplinarias de los miembros
        </p>
      </div>
      <div class="flex gap-2">
        <Button
          @click="exportarListado"
          variant="outline"
          class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:bg-gray-100"
        >
          <FileDown class="size-4" />
          Exportar Listado
        </Button>

        <Button
          @click="openAddModal"
          class="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:bg-primary/90"
        >
          <PlusIcon class="size-4" />
          Nueva Sanción
        </Button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg border shadow-sm">
      <div class="flex gap-4 items-center flex-wrap">
        <div class="flex-1 min-w-[250px]">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por nombre del miembro..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Todos los estados</option>
          <option v-for="stat in EstadoSancion" :key="stat" :value="stat">
            {{ getEstadoLabel(stat) }}
          </option>
        </select>
        <select
          v-model="selectNucleo"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Todos los núcleos</option>
          <option v-for="nucleo in cores" :key="nucleo.id" :value="nucleo.id">
            {{ nucleo.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Lista de Sanciones -->
    <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Militante
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tipo
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha Inicio
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Duración
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Núcleo
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="sanction in filteredSanctions"
              :key="sanction.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">
                  {{ sanction.militante.firstname }}
                  {{ sanction.militante.lastname }}
                </div>
              </td>
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span class="text-sm text-gray-900">
                  {{ getSeveridadLabel(sanction.severidad) }}
                </span>
              </td>
              <td
                class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900"
              >
                {{ formatDate(sanction.fecha) }}
              </td>
              <td
                class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900"
              >
                {{
                  sanction.duracion > 1
                    ? `${sanction.duracion} meses`
                    : `${sanction.duracion} mes`
                }}
              </td>
              <td
                class="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900"
              >
                {{ sanction.militante.core.name }}
              </td>
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getEstadoBadgeClass(sanction.estado)"
                >
                  {{ getEstadoLabel(sanction.estado) }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-lg font-medium space-x-2 text-center"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger class="focus:outline-none">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="rounded-full hover:bg-gray-100"
                    >
                      <MoreVerticalIcon class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      @click="openDetails(sanction)"
                      class="cursor-pointer"
                    >
                      <Eye class="h-4 w-4 mr-2" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="editSanction(sanction)"
                      class="cursor-pointer"
                    >
                      <Pencil class="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      @click="exportar(sanction.id)"
                      class="cursor-pointer"
                    >
                      <Download class="h-4 w-4 mr-2" />
                      Exportar PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          v-if="!filteredSanctions?.length"
          class="text-center py-12 text-gray-500"
        >
          <p class="text-lg">No hay sanciones registradas</p>
          <p class="text-sm mt-2">
            Usa el botón "Nueva Sanción" para agregar una
          </p>
        </div>
      </div>

      <!-- Paginación -->
      <div class="flex justify-between p-4 border-t">
        <div v-if="sanciones?.total === 0"></div>
        <div
          v-else
          class="flex text-md text-muted-foreground items-center gap-2"
        >
          <div>
            Mostrando <span class="font-medium">{{ currentPage || 1 }}</span> de
            <span class="font-medium">{{ sanciones?.total || 1 }}</span> páginas
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <Button
            size="icon"
            :disabled="currentPage === 1"
            variant="outline"
            @click="goToPreviousPage"
          >
            <ChevronLeft />
          </Button>
          <Button
            size="icon"
            :disabled="currentPage >= hasNextPage"
            variant="outline"
            @click="goToNextPage"
          >
            <ChevronRight />
          </Button>

          <div>
            <Select
              :default-value="searchParams.limit ?? '10'"
              @update:model-value="handleFilterByValue('limit', $event)"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para Agregar/Editar Sanción -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEditing ? "Editar Sanción" : "Nueva Sanción" }}
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>

        <form @submit.prevent="saveSanction" class="space-y-4">
          <!-- Militante -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Militante <span class="text-red-500">*</span>
            </label>
            <input
              v-if="isEditing"
              type="text"
              :value="`${currentSanction.militante?.firstname || ''} ${currentSanction.militante?.lastname || ''}`"
              disabled
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700"
            />
            <select
              v-else
              v-model="currentSanction.militante.id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Seleccionar militante</option>
              <option
                v-for="member in members"
                :key="member.id"
                :value="member.id"
              >
                {{ member.firstname }} {{ member.lastname }}
              </option>
            </select>
          </div>

          <!-- Tipo de Sanción -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Sanción <span class="text-red-500">*</span>
            </label>
            <select
              v-model="currentSanction.severidad"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Seleccione el tipo de sanción</option>
              <option value="AMONESTACION">Amonestación</option>
              <option value="SEPARACION_CARGO">Separación del cargo</option>
              <option value="SUSPENSION_TEMPORAL">
                Suspensión temporal de derechos
              </option>
              <option value="SEPARACION_FILAS">Separación de las filas</option>
              <option value="EXPULSION">Expulsión</option>
            </select>
          </div>

          <!-- Causa CON ICONO DE AYUDA -->
          <div>
            <div class="flex items-center gap-2 mb-1">
              <label class="block text-sm font-medium text-gray-700">
                Causa de la sanción <span class="text-red-500">*</span>
              </label>
              <button
                type="button"
                @click="showHelpModal = true"
                class="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                title="Ayuda"
              >
                <HelpCircle class="h-5 w-5" />
              </button>
            </div>
            <textarea
              v-model="currentSanction.causa"
              required
              rows="3"
              placeholder="Describe detalladamente la causa de la sanción..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
              Haz clic en el icono de ayuda
              <HelpCircle class="inline h-3 w-3 text-red-500" /> para ver las
              causas según el tipo de sanción
            </p>
          </div>

          <!-- Fecha y Duración -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio <span class="text-red-500">*</span>
              </label>
              <input
                v-model="currentSanction.fecha"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Duración <span class="text-red-500">*</span>
              </label>
              <select
                v-model="currentSanction.duracion"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="0">Seleccionar</option>
                <option value="1">1 mes</option>
                <option value="3">3 meses</option>
                <option value="6">6 meses</option>
                <option value="12">1 año</option>
              </select>
            </div>
          </div>

          <!-- Campo de Estado (solo visible en modo edición) -->
          <div
            v-if="isEditing"
            class="bg-blue-50 border border-blue-200 rounded-md p-3"
          >
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Estado <span class="text-red-500">*</span>
            </label>
            <select
              v-model="currentSanction.estado"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option
                v-for="estado in getAvailableEstados(currentSanction.severidad)"
                :key="estado"
                :value="estado"
              >
                {{ getEstadoLabel(estado) }}
              </option>
            </select>
            <p class="text-xs text-gray-600 mt-2">
              <strong>Nota:</strong> Los estados disponibles dependen del tipo
              de sanción seleccionado. El estado "CUMPLIDA" se asignará
              automáticamente al finalizar el período.
            </p>
          </div>

          <!-- Botones -->
          <div class="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              @click="closeModal"
              variant="secondary"
              class="px-4 py-2"
            >
              Cancelar
            </Button>
            <Button type="submit" :disabled="isLoading" class="px-4 py-2">
              <span v-if="isLoading">Guardando...</span>
              <span v-else>{{
                isEditing ? "Actualizar" : "Crear Sanción"
              }}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Ayuda para Causas de Sanciones -->
    <div
      v-if="showHelpModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
      @click.self="closeHelpModal"
    >
      <div
        class="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[85vh] flex flex-col"
        @click.stop
      >
        <!-- Header del Modal de Ayuda -->
        <div
          class="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-lg"
        >
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              Guía de Causas para Sanciones
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              Selecciona y copia el texto que necesites
            </p>
          </div>
          <button
            @click="closeHelpModal"
            class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            title="Cerrar"
          >
            <XIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Contenido del Modal de Ayuda con Scroll -->
        <div class="overflow-y-auto p-6 space-y-6">
          <div
            v-for="(data, key) in CAUSAS_SANCIONES"
            :key="key"
            class="border rounded-lg p-5 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <h4 class="text-lg font-bold text-primary mb-2">
              {{ data.titulo }}
            </h4>
            <p class="text-sm text-gray-700 mb-3 italic">
              {{ data.descripcion }}
            </p>

            <ul class="space-y-2 mb-3">
              <li
                v-for="(causa, index) in data.causas"
                :key="index"
                class="text-sm text-gray-800 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary before:font-bold hover:text-gray-900 cursor-text select-text"
              >
                {{ causa }}
              </li>
            </ul>

            <div
              v-if="data.nota"
              class="bg-blue-50 border-l-4 border-blue-400 p-3 mt-3"
            >
              <p class="text-xs text-blue-800">
                <strong>Nota:</strong> {{ data.nota }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer del Modal de Ayuda -->
        <div class="border-t p-4 bg-gray-50 rounded-b-lg">
          <p class="text-xs text-gray-600 text-center">
            Tip: Selecciona el texto deseado, cópialo (Ctrl+C) y pégalo (Ctrl+V)
            en el campo "Causa de la sanción"
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeDetailsModal"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">
            Detalles de la Sanción
          </h3>
          <button
            @click="closeDetailsModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>

        <div v-if="selectSanction" class="space-y-5">
          <!-- Información del Militante -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-semibold text-gray-700 mb-3">
              Información del Militante
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Nombre completo</label
                >
                <p class="text-base text-gray-900 font-medium">
                  {{ selectSanction.militante.firstname }}
                  {{ selectSanction.militante.lastname }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >CI</label
                >
                <p class="text-base text-gray-900">
                  {{ selectSanction.militante.ci }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Núcleo</label
                >
                <p class="text-base text-gray-900">
                  {{ selectSanction.militante.core?.name || "N/A" }}
                </p>
              </div>
            </div>
          </div>

          <!-- Detalles de la Sanción -->
          <div>
            <h4 class="font-semibold text-gray-700 mb-3">
              Detalles de la Sanción
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Tipo de Sanción</label
                >
                <p class="text-base text-gray-900 font-medium">
                  {{ getSeveridadLabel(selectSanction.severidad) }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Estado</label
                >
                <span
                  class="inline-block px-3 py-1 text-sm font-medium rounded-full"
                  :class="getEstadoBadgeClass(selectSanction.estado)"
                >
                  {{ getEstadoLabel(selectSanction.estado) }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Fecha de Inicio</label
                >
                <p class="text-base text-gray-900">
                  {{ formatDate(selectSanction.fecha) }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Duración</label
                >
                <p class="text-base text-gray-900">
                  {{
                    selectSanction.duracion > 1
                      ? `${selectSanction.duracion} meses`
                      : `${selectSanction.duracion} mes`
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- Causa -->
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-2"
              >Causa de la Sanción</label
            >
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-base text-gray-900 whitespace-pre-wrap">
                {{ selectSanction.causa }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-6 border-t">
          <Button
            @click="closeDetailsModal"
            variant="secondary"
            class="px-6 py-2"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
