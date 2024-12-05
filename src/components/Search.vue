<template>
    <!-- Search and Filters -->
    <div class="m-6 flex items-center gap-4">
        <div class="flex-1 relative">
            <SearchIcon class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Buscar actas..."
                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                v-model="search">
        </div>
        <div class="relative inline-block">
            <select v-model="selected"
                class="appearance-none w-full px-10 py-2 border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="" hidden>Todos</option>
                <option value="desarrollo">Puntos de Orden del Día</option>
                <option value="innovacion">Acuerdos</option>
                <option value="gestion">Particip. Org Sup</option>
                <option value="invitados">Invitados</option>
                <option value="rendicion">Rendición</option>
                <option value="analisis">Análisis de objetivos</option>
            </select>
            <Filter
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
        </div>

    </div>
</template>

<script setup lang="ts">
import { Filter, SearchIcon } from 'lucide-vue-next';
import { ref } from 'vue'

const search = ref('')
const selected = ref('')
</script>