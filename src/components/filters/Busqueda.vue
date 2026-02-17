<script setup lang="ts">
import { format } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-vue-next";
import { ref, onMounted, computed } from "vue";
import Filters from "@/components/filters/filters.vue";
import { API_URL } from "astro:env/client";

interface CurrentUser {
  userId: number;      
  roleId: number;     
  coreId?: string;    
  name: string;       
}

const { actas, limit, page, cores, searchTerm, currentUser, hasActiveFilters, showCoreFilter  } = defineProps<{
  actas: any;
  limit: number;
  page: number;
  cores: any;
  searchTerm: string;
  currentUser: CurrentUser | null;
  hasActiveFilters: boolean;
  showCoreFilter: boolean;
}>();

const found = ref(actas?.numFound || 0);
const currentPage = ref(actas?.currentPage || Number(page) || 1);
const totalPages = ref(actas?.totalPages || Math.ceil(found.value / limit));
const currentSearchTerm = ref(searchTerm);
const expandedActas = ref<number[]>([]);

const ADMIN_ROLE_ID = 1; 
const COMITE_MEMBER_ROLE_ID = 4; 

// Determinar si el usuario tiene acceso total
const hasFullAccess = computed(() => {
  if (!currentUser) return false;
  return currentUser.roleId === ADMIN_ROLE_ID || currentUser.roleId === COMITE_MEMBER_ROLE_ID;
});

// Obtener el núcleo del usuario
const userCoreName = computed(() => {
  if (!currentUser || !currentUser.coreId || !cores) return null;
  const userCore = cores.find((c: any) => c.id === currentUser.coreId);
  return userCore?.name || null;
});

// Mostrar resultados solo si hay filtros activos
const showResults = computed(() => {
  return hasActiveFilters;
});

// Obtener los términos de búsqueda activos
const activeSearchTerms = computed(() => {
  if (typeof window === 'undefined') return [];
  
  const urlParams = new URLSearchParams(window.location.search);
  const terms: string[] = [];
  
  if (urlParams.get('text')) terms.push(urlParams.get('text')!);
  if (urlParams.get('doc_type')) {
    const docType = urlParams.get('doc_type');
    if (docType === 'ro') terms.push('Reunión Ordinaria');
    if (docType === 'cp') terms.push('Círculo Político');
  }
  if (hasFullAccess.value && urlParams.get('core')) terms.push(urlParams.get('core')!);
  if (urlParams.get('dateFrom') || urlParams.get('dateTo')) {
    const from = urlParams.get('dateFrom') || '...';
    const to = urlParams.get('dateTo') || '...';
    terms.push(`Fecha: ${from} - ${to}`);
  }
  
  return terms;
});

function toggleActa(id: number) {
  const index = expandedActas.value.indexOf(id);
  if (index === -1) expandedActas.value.push(id);
  else expandedActas.value.splice(index, 1);
}

function isExpanded(id: number) {
  return expandedActas.value.includes(id);
}

function openActa(acta: any, event?: Event) {
  if (event) {
    event.preventDefault();
  }
  
  const isLoadedDocument = acta.name && (
    acta.name.toLowerCase().endsWith('.pdf') || 
    acta.name.toLowerCase().endsWith('.html') ||
    acta.name.toLowerCase().endsWith('.htm') ||
    acta.name.toLowerCase().endsWith('.docx') ||
    acta.name.toLowerCase().endsWith('.doc')
  );
  
  if (isLoadedDocument) {
    window.open(`${API_URL}/minute/${acta.id}/file`, '_blank');
  } else {
    const docTypeMap: Record<string, string> = {
      'Ordinaria': 'ro',
      'ro': 'ro',
      'Circulo Politico': 'cp',
      'Círculo Político': 'cp',
      'cp': 'cp',
      'Extraordinaria': 'ex',
      'ex': 'ex'
    };
    
    const routeType = docTypeMap[acta.doc_type];
    
    if (!routeType) {
      return;
    }
    
    if (routeType === 'ro') {
      window.location.href = `/minutes/ro/${acta.id}`;
    } else if (routeType === 'cp' || routeType === 'ex') {
      window.location.href = `/minutes/cp/${acta.id}`;
    }
  }
}

function getRelevantSnippet(text: string | string[], searchTerm: string, contextChars: number = 150): string {
  if (!searchTerm || !text) return '';
  
  const fullText = Array.isArray(text) ? text.join(' ') : text;
  const lowerText = fullText.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  const index = lowerText.indexOf(lowerTerm);
  
  if (index === -1) {
    return fullText.substring(0, contextChars * 2) + '...';
  }
  
  const start = Math.max(0, index - contextChars);
  const end = Math.min(fullText.length, index + searchTerm.length + contextChars);
  
  let snippet = fullText.substring(start, end);
  
  if (start > 0) snippet = '...' + snippet;
  if (end < fullText.length) snippet = snippet + '...';
  
  return snippet;
}

function highlightTerm(text: string, searchTerm: string): string {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">$1</mark>');
}

const processedActas = computed(() => {
  if (!actas?.docs) return [];
  
  return actas.docs.map((acta: any) => ({
    ...acta,
    snippet: getRelevantSnippet(acta.text, currentSearchTerm.value),
    highlightedSnippet: highlightTerm(
      getRelevantSnippet(acta.text, currentSearchTerm.value),
      currentSearchTerm.value
    )
  }));
});

onMounted(() => {
  if (typeof window !== "undefined" && !currentSearchTerm.value) {
    const urlParams = new URLSearchParams(window.location.search);
    currentSearchTerm.value =
      urlParams.get("text") || urlParams.get("indicators") || "";
  }
});

function buildPaginationUrl(newPage: number) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("page", newPage.toString());
  urlParams.set("limit", limit.toString());
  return `/busqueda?${urlParams.toString()}`;
}

function goToNextPage() {
  if (currentPage.value < totalPages.value) {
    window.location.href = buildPaginationUrl(currentPage.value + 1);
  }
}

function goToPreviousPage() {
  if (currentPage.value > 1) {
    window.location.href = buildPaginationUrl(currentPage.value - 1);
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:bg-zinc-800">
    <div class="flex">
      <Filters 
        :cores="cores" 
        :search-term="currentSearchTerm"
        :current-user="currentUser"
        :show-core-filter="showCoreFilter"
      />
      <div class="max-w-[1600px] mx-auto p-6 flex-1">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <!-- Header -->
          <div class="p-8 border-b">
            <h2 class="font-bold text-3xl">Resultado de la búsqueda</h2>

            <!-- Mensaje cuando no hay filtros aplicados -->
            <p v-if="!showResults" class="text-md text-gray-500">
              Por favor, selecciona al menos un filtro para realizar la búsqueda
            </p>
            
            <!-- Mensajes cuando hay filtros aplicados -->
            <template v-else>
              <!-- Mostrar términos de búsqueda activos -->
              <div v-if="activeSearchTerms.length > 0" class="mt-2 mb-3">
                <p class="text-sm text-gray-600 mb-2">Buscando por:</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(term, index) in activeSearchTerms"
                    :key="index"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                  >
                    {{ term }}
                  </span>
                </div>
              </div>

              <p v-if="found === 0" class="text-md text-gray-500 mt-3">
                0 coincidencias encontradas
              </p>
              <p v-else-if="found === 1" class="text-md text-gray-500 mt-3">
                {{ found }} coincidencia encontrada
              </p>
              <p v-else class="text-md text-gray-500 mt-3">
                {{ found }} coincidencias encontradas
              </p>
              
              <!-- Mostrar filtro activo de núcleo para usuarios restringidos -->
              <p v-if="!hasFullAccess && userCoreName" class="text-sm text-blue-600 mt-2">
                Mostrando solo actas de: <strong>{{ userCoreName }}</strong>
              </p>
            </template>
          </div>

          <!-- Results -->
          <div v-if="showResults" class="space-y-4">
            <div
              v-for="acta in processedActas"
              :key="acta.id"
              class="p-6 border-b border-gray-200 pb-6"
            >
              <div class="flex justify-between items-start mb-2">
                <a
                  class="text-lg font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  href="#"
                  @click.prevent="openActa(acta)"
                >
                  {{ acta.name }}
                </a>
              </div>

              <div class="text-green-700 text-sm mb-2">
                {{ acta.core }}, {{ format(acta.creation_date, "yyyy-MM-dd") }}
              </div>

              <div 
                class="text-gray-700 text-sm mb-3 leading-relaxed"
                v-html="acta.highlightedSnippet || 'Sin contenido disponible'"
              >
              </div>

              <transition name="accordion">
                <div
                  v-if="isExpanded(acta.id)"
                  class="mt-2 p-4 border-l-4 border-blue-500 bg-gray-50 dark:bg-zinc-700 rounded acta-detail"
                >
                  <p><strong>ID:</strong> {{ acta.id }}</p>
                  <p><strong>Tipo:</strong> {{ acta.doc_type }}</p>
                  <p><strong>Texto completo:</strong> {{ Array.isArray(acta.text) ? acta.text.join(' ') : acta.text || "Sin texto disponible" }}</p>
                  <p><strong>Core:</strong> {{ acta.core }}</p>
                  <p><strong>Fecha de creación:</strong> {{ format(acta.creation_date, "yyyy-MM-dd") }}</p>
                </div>
              </transition>
            </div>

            <!-- Mensaje cuando no hay resultados -->
            <div v-if="found === 0" class="border border-b-gray-300 text-center text-gray-500 font-medium p-8">
              No hay coincidencias
            </div>
          </div>
          
          <!-- Paginación - Solo mostrar si hay filtros Y hay resultados -->
          <div v-if="showResults && found > 0" class="flex justify-between items-center border-t border-gray-200 p-4">
            <div class="text-sm text-gray-600">
              Página {{ currentPage }} de {{ totalPages }}
            </div>

            <div class="space-x-4 flex justify-end">
              <button
                @click="goToPreviousPage"
                type="button"
                :disabled="currentPage <= 1"
                class="pagination-btn"
                :class="{ 'disabled': currentPage <= 1 }"
              >
                <ArrowLeft class="w-4 h-4" /> Anterior
              </button>

              <button
                @click="goToNextPage"
                type="button"
                :disabled="currentPage >= totalPages"
                class="pagination-btn"
                :class="{ 'disabled': currentPage >= totalPages }"
              >
                Siguiente <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clickable {
  cursor: pointer;
  color: #61666b;
}
.clickable:hover {
  color: #0c0e0f;
}

.pagination-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
  font-size: 0.875rem;
  background-color: #f9fafb;
  color: #111827;
  transition: all 0.2s ease;
  cursor: pointer;
}

.pagination-btn:hover:not(.disabled) {
  background-color: #2563eb;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
}

.pagination-btn:active:not(.disabled) {
  transform: scale(0.98);
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f3f4f6;
}

.acta-detail {
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
  transform: scaleY(0.95);
}
.accordion-enter-to,
.accordion-leave-from {
  max-height: 500px;
  opacity: 1;
  transform: scaleY(1);
}
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(mark) {
  font-weight: 600;
  padding: 2px 4px;
  border-radius: 3px;
}
</style>