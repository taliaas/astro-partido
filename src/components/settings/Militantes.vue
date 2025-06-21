<template>
  <div class="container mx-auto py-8 px-6 border bg-white rounded-md shadow-xl">
    <!-- Sheet_container and Add -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
    >
      <div class="flex-1 relative w-full sm:w-80">
        <Search
          class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
        />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Buscar miembros..."
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-md ring-offset-background file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <select
        v-model="selectCore"
        class="rounded-md border px-3 py-2 mx-1.5 text-md"
      >
        <option value="">Todos los núcleos</option>
        <option v-for="nucleo in cores" :key="nucleo.id" :value="nucleo.name">
          {{ nucleo.name }}
        </option>
      </select>
      <button
        @click="openAddMemberModal"
        class="inline-flex items-center justify-center bg-button rounded-md text-white h-10 px-4 py-2"
      >
        Añadir
      </button>
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
                  <div class="text-md text-muted-foreground">
                    {{ member.phone }}
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
        <span class="font-medium">{{ militantes.total }}</span> páginas
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="inline-flex items-center justify-center rounded-md text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          Anterior
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="inline-flex items-center justify-center rounded-md text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          :class="{
            'opacity-50 cursor-not-allowed': currentPage === totalPages,
          }"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Member Form Modal -->
    <div
      v-if="showMemberModal"
      class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
    >
      <div
        class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg"
      >
        <div class="flex flex-col space-y-1.5 text-center sm:text-left py-2">
          <h2 class="text-xl font-semibold leading-none tracking-tight">
            {{ isEditing ? "Editar militante" : "Añadir militante" }}
          </h2>
          <p class="text-md text-muted-foreground">
            {{
              isEditing
                ? "Actualizar la información de los militantes"
                : "Complete los datos para agregar un nuevo militante"
            }}
          </p>
        </div>
        <form @submit.prevent="saveMember" class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label
                for="firstname"
                class="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >Nombre</label
              >
              <input
                id="firstname"
                v-model="currentMember.firstname"
                type="text"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Nombre"
                required
              />
            </div>
            <div class="space-y-2">
              <label
                for="lastname"
                class="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >Apellidos</label
              >
              <input
                id="lastname"
                v-model="currentMember.lastname"
                type="text"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Apellidos"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <label
              for="email"
              class="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >Correo</label
            >
            <input
              id="email"
              v-model="currentMember.email"
              type="email"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Correo"
              required
            />
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label
                for="organization"
                class="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >Organización</label
              >
              <select
                id="organization"
                v-model="currentMember.organization"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="" disabled>Seleccione la organización</option>
                <option value="PCC">PCC</option>
                <option value="UJC">UJC</option>
              </select>
            </div>
            <div class="space-y-2">
              <label
                for="core"
                class="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >Núcleo</label
              >
              <select
                id="core"
                v-model="currentMember.core.id"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="" disabled>Seleccione el núcleo</option>
                <option
                  v-for="nucleo in cores"
                  :key="nucleo.id"
                  :value="nucleo.id"
                >
                  {{ nucleo.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label
                for="phone"
                class="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >Teléfono</label
              >
              <input
                id="phone"
                v-model="currentMember.phone"
                type="text"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Número de teléfono"
                required
              />
            </div>
            <div class="space-y-2">
              <label
                for="status"
                class="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >Estado</label
              >
              <div class="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked="true"
                  data-state="checked"
                  value="on"
                  @click="currentMember.estado = !currentMember.estado"
                  class="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  :class="{ 'bg-primary': currentMember.estado }"
                >
                  <CheckIcon
                    v-if="currentMember.estado"
                    class="h-3 w-3 text-white"
                  />
                </button>
                <label
                  for="status"
                  class="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {{ currentMember.estado ? "Activo" : "Inactivo" }}
                </label>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label
              for="address"
              class="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >Dirección</label
            >
            <input
              id="address"
              v-model="currentMember.address"
              type="text"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Dirección"
              required
            />
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="closeMemberModal"
              class="inline-flex items-center justify-center rounded-md text-md font-medium disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="inline-flex items-center justify-center rounded-md text-md font-medium disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-2"
            >
              {{ isEditing ? "Actualizar" : "Añadir militante" }}
            </button>
          </div>
        </form>
      </div>
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
                <label class="text-sm font-medium text-muted-foreground"
                  >Nombre</label
                >
                <p class="text-lg font-semibold">
                  {{ selectedMilitante.firstname }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground"
                  >Apellido</label
                >
                <p class="text-lg font-semibold">
                  {{ selectedMilitante.lastname }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground"
                  >Cédula de Identidad</label
                >
                <p class="text-lg">{{ selectedMilitante.ci }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground"
                  >Estado</label
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
                  <label class="text-sm font-medium text-muted-foreground"
                    >Email</label
                  >
                  <p>{{ selectedMilitante.email }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <PhoneIcon class="w-4 h-4 text-muted-foreground" />
                <div>
                  <label class="text-sm font-medium text-muted-foreground"
                    >Teléfono</label
                  >
                  <p>{{ selectedMilitante.phone }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <MapPinIcon class="w-4 h-4 text-muted-foreground mt-1" />
                <div>
                  <label class="text-sm font-medium text-muted-foreground"
                    >Dirección</label
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
                <label class="text-sm font-medium text-muted-foreground"
                  >Organización</label
                >
                <p class="text-lg font-semibold">
                  {{ selectedMilitante.organization }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground"
                  >Núcleo</label
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

        <div class="p-6 border-t flex justify-end">
          <button
            @click="closeModal"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Cerrar
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
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { format } from "date-fns";
import {
  CheckIcon,
  Eye,
  MoreVerticalIcon,
  Pencil,
  Search,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

// UI state
const searchQuery = ref("");
const showMemberModal = ref(false);
const isEditing = ref(false);
const isModalOpen = ref(false);
const selectCore = ref("");

const selectedMilitante = ref({
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
  },
});

const { militantes, page, cores } = defineProps<{
  militantes: any;
  page: number;
  cores: any;
}>();

const totalPages = militantes.total;
const currentPage = ref(page);
const currentMember = ref({
  id: 0,
  firstname: "",
  lastname: "",
  email: "",
  organization: "",
  estado: true,
  address: "",
  phone: "",
  core: {
    id: "",
    name: "",
  },
});

// Computed properties
const filteredMembers = computed(() => {
  if (!searchQuery.value) {
    return militantes.data;
  }
  if (!Array.isArray(militantes.data)) return [];
  const query = searchQuery.value.toLowerCase();
  return militantes.data.filter(
    (member: any) =>
      member.firstname.toLowerCase().includes(query) ||
      member.lastname.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.organization.toLowerCase().includes(query) ||
      member.core.name.toLowerCase().includes(query),
  );
});

// Methods
const getInitials = (member: any) => {
  return `${member.firstname.charAt(0)}${member.lastname.charAt(0)}`;
};

const openAddMemberModal = () => {
  isEditing.value = false;
  resetCurrentMember();
  showMemberModal.value = true;
};

const openEditMemberModal = (member: any) => {
  isEditing.value = true;
  currentMember.value = member;
  showMemberModal.value = true;
};

const closeMemberModal = () => {
  showMemberModal.value = false;
  resetCurrentMember();
};

const handleViewDetails = (militante: any) => {
  selectedMilitante.value = militante;
  isModalOpen.value = true;
  console.log("Entró", isModalOpen.value, selectedMilitante.value);
};

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
    },
  };
};

const resetCurrentMember = () => {
  currentMember.value = {
    id: 0,
    firstname: "",
    lastname: "",
    email: "",
    organization: "",
    estado: true,
    address: "",
    phone: "",
    core: {
      id: "",
      name: "",
    },
  };
};

const saveMember = async () => {
  try {
    if (isEditing.value) {
      await actions.militants.updateMember(currentMember.value as any);
      toast.success("Sanción actualizada correctamente");
    } else {
      await actions.militants.createMember(currentMember.value as any);
      toast.success("Sanción actualizada correctamente");
    }
    closeMemberModal();
    navigate("");
  } catch (error) {
    throw new Error("Error al guardar al usuario");
  }
};

function nextPage() {
  if (currentPage.value < totalPages) {
    currentPage.value++;
    navigate(
      `/settings/militants?core=${selectCore.value}&page=${currentPage.value}`,
    );
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    navigate(
      `/settings/militants?core=${selectCore.value}&page=${currentPage.value}`,
    );
  }
}
</script>
