<template>
  <div class="pb-4">
    <h2 class="text-2xl font-bold text-gray-900">Militantes</h2>
    <p class="text-gray-600">Administra los militantes del sistema</p>
  </div>
  <div
    class="container mx-auto p-6 space-y-4 border bg-white rounded-md shadow-xl"
  >
    <div class="flex justify-end">
      <div class="flex justify-end gap-2">
        <button
          @click="openAddMemberModal"
          class="inline-flex items-center justify-center bg-button rounded-md text-white px-4 py-2"
        >
          Añadir
        </button>
        <button
          @click="downloadMili"
          class="flex items-center gap-2 border px-4 py-2 rounded-md hover:bg-secondary"
        >
          <DownloadIcon class="w-4 h-4" />
          Exportar
        </button>
      </div>
    </div>
    <!-- Sheet_container and Add -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
    >
      <div class="flex-1 relative w-full sm:w-80">
        <Search
          class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
        />
        <Input
          v-model="searchQuery"
          type="search"
          placeholder="Buscar miembros..."
          class="flex h-10 w-full rounded-md border border-Input bg-background px-3 py-2 pl-8 text-md ring-offset-background file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>

    <!-- Members Table -->
    <div class="rounded-md border">
      <table class="w-full caption-bottom text-md">
        <thead class="[&_tr]:border-b">
          <tr
            class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
          >
            <th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
            >
              Nombre
            </th>
            <th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
            >
              Correo
            </th>
            <th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
            >
              Núcleo
            </th>
            <th
              class="h-12 px-4 text-center align-middle font-medium text-muted-foreground"
            >
              Organización
            </th>
            <th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
            >
              Estado
            </th>
            <th
              class="h-12 px-4 text-center align-middle font-medium text-muted-foreground"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="[&_tr:last-child]:border-0">
          <tr
            v-for="member in filteredMembers"
            :key="member.id"
            class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
          >
            <td class="p-4 align-middle">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
                >
                  <span class="text-md font-medium">{{
                    getInitials(member)
                  }}</span>
                </div>
                <div>
                  <div class="font-medium">
                    {{ member.firstname }} {{ member.lastname }}
                  </div>
                </div>
              </div>
            </td>
            <td class="p-4 align-middle">{{ member.email }}</td>
            <td class="p-4 align-middle">{{ member.core.name }}</td>
            <td class="p-4 align-middle text-center capitalize">
              {{ member.organization }}
            </td>
            <td class="p-4 align-middle">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  member.estado
                    ? 'bg-green-50 text-green-700 border border-green-300'
                    : 'bg-red-50 text-red-700 border border-red-300',
                ]"
              >
                {{ member.estado ? "Activo" : "Inactivo" }}
              </span>
            </td>
            <td class="p-4 text-center align-middle">
              <DropdownMenu>
                <DropdownMenuTrigger class="focus:outline-none">
                  <Button variant="ghost" size="icon" class="rounded-full">
                    <MoreVerticalIcon class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="handleViewDetails(member)">
                    <Eye class="h-4 w-4" />
                    Detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="openEditMemberModal(member)">
                    <Pencil class="h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
          <tr v-if="filteredMembers.length === 0">
            <td colspan="6" class="p-4 text-center text-muted-foreground">
              No hay militantes.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between py-4">
      <div class="text-md text-muted-foreground">
        Mostrando <span class="font-medium">{{ page }}</span> de
        <span class="font-medium">{{ militantes.total }}</span> página(s)
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          @click="previousPage"
          :disabled="currentPage === 1"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          @click="nextPage"
          :disabled="currentPage === totalPages"
          :class="{
            'opacity-50 cursor-not-allowed': currentPage === totalPages,
          }"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>

    <!-- Member Form Modal -->
    <div
      v-if="showMemberModal"
      class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
    >
      <MilitanteForm :currentMember :cores :close />
    </div>
    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black/50" @click="closeModal"></div>

      <!-- Modal Content -->
      <div
        class="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="p-6 border-b">
          <h2 class="text-2xl font-semibold">Detalles del Militante</h2>
          <p class="text-muted-foreground mt-1">
            Información completa de {{ selectedMilitante?.firstname }}
            {{ selectedMilitante?.lastname }}
          </p>
        </div>

        <div class="p-6 space-y-6" v-if="selectedMilitante">
          <!-- Información Personal -->
          <div class="bg-white shadow-sm rounded-lg border">
            <div class="p-4 border-b">
              <h3 class="text-lg font-semibold flex items-center gap-2">
                <UsersIcon class="w-5 h-5" />
                Información Personal
              </h3>
            </div>
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label class="text-sm font-medium text-muted-foreground"
                  >Nombre</Label
                >
                <p class="text-lg font-semibold">
                  {{ selectedMilitante.firstname }}
                </p>
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground"
                  >Apellido</Label
                >
                <p class="text-lg font-semibold">
                  {{ selectedMilitante.lastname }}
                </p>
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground"
                  >Carnet de Identidad</Label
                >
                <p class="text-lg">{{ selectedMilitante.ci }}</p>
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground"
                  >Estado</Label
                >
                <div class="mt-1">
                  <span
                    :class="
                      selectedMilitante.estado
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    "
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  >
                    {{ selectedMilitante.estado ? "Activo" : "Inactivo" }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Información de Contacto -->
          <div class="bg-white shadow-sm rounded-lg border">
            <div class="p-4 border-b">
              <h3 class="text-lg font-semibold flex items-center gap-2">
                <MailIcon class="w-5 h-5" />
                Información de Contacto
              </h3>
            </div>
            <div class="p-4 space-y-4">
              <div class="flex items-center gap-3">
                <MailIcon class="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label class="text-sm font-medium text-muted-foreground"
                    >Email</Label
                  >
                  <p>{{ selectedMilitante.email }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <PhoneIcon class="w-4 h-4 text-muted-foreground" />
                <div>
                  <Label class="text-sm font-medium text-muted-foreground"
                    >Teléfono</Label
                  >
                  <p>{{ selectedMilitante.phone }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <MapPinIcon class="w-4 h-4 text-muted-foreground mt-1" />
                <div>
                  <Label class="text-sm font-medium text-muted-foreground"
                    >Dirección</Label
                  >
                  <p>{{ selectedMilitante.address }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Información Organizacional -->
          <div class="bg-white shadow-sm rounded-lg border">
            <div class="p-4 border-b">
              <h3 class="text-lg font-semibold flex items-center gap-2">
                <BuildingIcon class="w-5 h-5" />
                Información Organizacional
              </h3>
            </div>
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label class="text-sm font-medium text-muted-foreground"
                  >Organización</Label
                >
                <p class="text-lg font-semibold">
                  {{ selectedMilitante.organization }}
                </p>
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground"
                  >Núcleo</Label
                >
                <p class="text-lg font-semibold">
                  {{ selectedMilitante.core.name }}
                </p>
              </div>
            </div>
          </div>

          <!-- Traslados -->
          <div class="bg-white shadow-sm rounded-lg border">
            <div class="p-4 border-b">
              <h3 class="text-lg font-semibold flex items-center gap-2">
                <ArrowRightLeftIcon class="w-5 h-5" />
                Historial de Traslados ({{
                  selectedMilitante.traslados.length
                }})
              </h3>
            </div>
            <div class="p-4">
              <div
                v-if="selectedMilitante.traslados.length > 0"
                class="space-y-4"
              >
                <div
                  v-for="traslado in selectedMilitante.traslados"
                  :key="traslado.id"
                  class="border rounded-lg p-4"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <p class="font-semibold">
                        {{ traslado.origen }} → {{ traslado.destino }}
                      </p>
                      <p class="text-sm text-muted-foreground">
                        Fecha: {{ format(traslado.fecha, "yyyy-MM-dd") }}
                      </p>
                    </div>
                    <span
                      class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                    >
                      {{ traslado.estado }}
                    </span>
                  </div>
                  <p class="text-sm">
                    <span class="font-medium">Motivo:</span>
                    {{ traslado.details }}
                  </p>
                </div>
              </div>
              <p v-else class="text-muted-foreground text-center py-4">
                No hay traslados registrados
              </p>
            </div>
          </div>

          <!-- Sanciones -->
          <div class="bg-white shadow-sm rounded-lg border">
            <div class="p-4 border-b">
              <h3 class="text-lg font-semibold flex items-center gap-2">
                <AlertTriangleIcon class="w-5 h-5" />
                Historial de Sanciones ({{
                  selectedMilitante.sanciones.length
                }})
              </h3>
            </div>
            <div class="p-4">
              <div
                v-if="selectedMilitante.sanciones.length > 0"
                class="space-y-4"
              >
                <div
                  v-for="sancion in selectedMilitante.sanciones"
                  :key="sancion.id"
                  class="border rounded-lg p-4"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <p class="font-semibold">Causa: {{ sancion.causa }}</p>
                      <p class="text-sm text-muted-foreground">
                        Fecha: {{ format(sancion.fecha, "yyyy-MM-dd") }}
                      </p>
                    </div>
                    <div class="flex gap-2">
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      >
                        {{ sancion.severidad }}
                      </span>
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      >
                        {{ sancion.estado }}
                      </span>
                    </div>
                  </div>
                  <p class="text-sm">
                    <span class="font-medium">Descripción:</span>
                    {{ sancion.details }}
                  </p>
                </div>
              </div>
              <p v-else class="text-muted-foreground text-center py-4">
                No hay sanciones registradas
              </p>
            </div>
          </div>
        </div>

        <div class="p-6 border-t flex justify-end gap-2">
          <button
            @click="closeModal"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium border px-4 py-2"
          >
            Cerrar
          </button>
          <button
            @click="exportDetails"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import DropdownMenu from "@/components/ui/dropdown-menu/DropdownMenu.vue";
import DropdownMenuContent from "@/components/ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuItem from "@/components/ui/dropdown-menu/DropdownMenuItem.vue";
import DropdownMenuTrigger from "@/components/ui/dropdown-menu/DropdownMenuTrigger.vue";
import { navigate } from "astro:transitions/client";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  Eye,
  MoreVerticalIcon,
  Pencil,
  Search,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import MilitanteForm from "@/components/settings/militantes/militanteForm.vue";
import type { Militantes } from "@/interface/Militante";

const { militantes, page, cores } = defineProps<{
  militantes: { data: Militantes[]; total: number; page: number };
  page: number;
  cores: any;
}>();

// UI state
const searchQuery = ref("");
const showMemberModal = ref(false);
const isEditing = ref(false);
const isModalOpen = ref(false);
const selectCore = ref("");
const totalPages = militantes.total;
const currentPage = ref(page);

const currentMember = ref<Militantes | null>(null);

const selectedMilitante = ref<Militantes>({
  id: 0,
  firstname: "",
  lastname: "",
  ci: "",
  email: "",
  organization: "",
  estado: true,
  address: "",
  phone: "",
  core: {
    id: "",
    name: "",
  },
  traslados: [],
  sanciones: [],
  desactivaciones: [],
});
// Computed properties
const filteredMembers = computed(() => {
  if (!searchQuery.value) {
    return militantes.data;
  }
  if (!Array.isArray(militantes.data)) return [];
  const query = searchQuery.value.toLowerCase();
  return militantes?.data?.filter(
    (member: any) =>
      member.firstname.toLowerCase().includes(query) ||
      member.lastname.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.organization.toLowerCase().includes(query) ||
      member.core.name.toLowerCase().includes(query)
  );
});

// Methods
const getInitials = (member: any) => {
  return `${member.firstname.charAt(0)}${member.lastname.charAt(0)}`;
};

const openAddMemberModal = () => {
  isEditing.value = false;
  showMemberModal.value = true;
};

async function exportDetails() {
  if (!selectedMilitante.value) {
    toast.error("No hay militante seleccionado");
    return;
  }
  const m = selectedMilitante.value;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Detalles del Militante", 14, 16);

  // Información Personal
  doc.setFontSize(12);
  doc.text("Información Personal", 14, 26);
  doc.setFontSize(10);
  doc.text(`Nombre: ${m.firstname || ""} ${m.lastname || ""}`, 14, 34);
  doc.text(`Carnet de Identidad: ${m.ci || ""}`, 14, 40);
  doc.text(`Estado: ${m.estado ? "Activo" : "Inactivo"}`, 14, 46);

  // Información de Contacto
  doc.setFontSize(12);
  doc.text("Información de Contacto", 14, 56);
  doc.setFontSize(10);
  doc.text(`Email: ${m.email || ""}`, 14, 64);
  doc.text(`Teléfono: ${m.phone || ""}`, 14, 70);
  doc.text(`Dirección: ${m.address || ""}`, 14, 76);

  // Información Organizacional
  doc.setFontSize(12);
  doc.text("Información Organizacional", 14, 86);
  doc.setFontSize(10);
  doc.text(`Organización: ${m.organization || ""}`, 14, 94);
  doc.text(`Núcleo: ${m.core?.name || ""}`, 14, 100);

  let y = 110;
  // Traslados
  doc.setFontSize(12);
  doc.text("Historial de Traslados", 14, y);
  y += 6;
  doc.setFontSize(10);
  if (Array.isArray(m.traslados) && m.traslados.length > 0) {
    m.traslados.forEach((t: any, idx: number) => {
      doc.text(
        `${idx + 1}. ${t.origen || ""} → ${t.destino || ""} | Fecha: ${t.fecha ? format(t.fecha, "yyyy-MM-dd") : ""} | Estado: ${t.estado || ""} | Motivo: ${t.details || ""}`,
        14,
        y
      );
      y += 6;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
  } else {
    doc.text("No hay traslados registrados", 14, y);
    y += 6;
  }

  // Sanciones
  y += 6;
  doc.setFontSize(12);
  doc.text("Historial de Sanciones", 14, y);
  y += 6;
  doc.setFontSize(10);
  if (Array.isArray(m.sanciones) && m.sanciones.length > 0) {
    m.sanciones.forEach((s: any, idx: number) => {
      doc.text(
        `${idx + 1}. Causa: ${s.causa || ""} | Fecha: ${s.fecha ? format(s.fecha, "yyyy-MM-dd") : ""} | Severidad: ${s.severidad || ""} | Estado: ${s.estado || ""} | Descripción: ${s.details || ""}`,
        14,
        y
      );
      y += 6;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
  } else {
    doc.text("No hay sanciones registradas", 14, y);
    y += 6;
  }

  doc.save(`militante_${m.firstname || ""}_${m.lastname || ""}.pdf`);
  toast.success("Detalles exportados correctamente");
}

async function downloadMili() {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Listado de Militantes", 14, 16);

  const rows = filteredMembers.value.map((member) => [
    `${member.firstname} ${member.lastname}`,
    member.email,
    member.core?.name || "",
    member.organization,
    member.estado ? "Activo" : "Inactivo",
    member.phone || "",
    member.address || "",
  ]);

  autoTable(doc, {
    head: [
      [
        "Nombre",
        "Correo",
        "Núcleo",
        "Organización",
        "Estado",
        "Teléfono",
        "Dirección",
      ],
    ],
    body: rows,
    startY: 22,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  doc.save("militantes.pdf");
  toast.success("Militantes exportados correctamente");
}

const openEditMemberModal = (member: any) => {
  isEditing.value = true;
  currentMember.value = member;
  showMemberModal.value = true;
};

const handleViewDetails = (militante: any) => {
  selectedMilitante.value = militante;
  isModalOpen.value = true;
};

const close = () => {
  showMemberModal.value = false
  currentMember.value = null
}

const closeModal = () => {
  isModalOpen.value = false;
  selectedMilitante.value = {
    id: 0,
    firstname: "",
    lastname: "",
    ci: "",
    email: "",
    organization: "",
    estado: true,
    address: "",
    phone: "",
    core: {
      id: "",
      name: "",
    },
    traslados: [],
    sanciones: [],
    desactivaciones: [],
  };
};

function nextPage() {
  if (currentPage.value < totalPages) {
    currentPage.value++;
    navigate(
      `/settings/militants?core=${selectCore.value}&page=${currentPage.value}`
    );
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    navigate(
      `/settings/militants?core=${selectCore.value}&page=${currentPage.value}`
    );
  }
}
</script>
