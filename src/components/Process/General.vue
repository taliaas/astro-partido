<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Procesos del funcionamiento</h1>
      </div>
    </div>

    <div class="flex flex-col gap-8 md:flex-row">
      <!-- Barra lateral de navegación -->
      <aside class="md:w-1/4">
        <nav class="grid gap-2 md:sticky md:top-20">
          <a
              v-for="item in navigationItems"
              :key="item.id"
              href="#"
              @click.prevent="activeSection = item.id"
              :class="[
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              activeSection === item.id
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
          >
            <component :is="item.icon" class="h-4 w-4" />
            <span class="text-lg">{{ item.title }}</span>
          </a>
        </nav>
      </aside>

      <div class="flex-1 max-w-7xl">
        <!-- Registro de actividades -->
        <div v-if="activeSection === 'register'" class="space-y-6">
          <Register />
        </div>

        <!-- Gestión de Sanciones  -->
        <div v-if="activeSection === 'sancion'" class="space-y-6">
          <Sanciones />
        </div>

        <!-- Gestión de Traslados  -->
        <div v-if="activeSection === 'traslado'" class="space-y-6">
          <Traslado />
        </div>

        <!-- Gestión de Desactivaciones  -->
        <div v-if="activeSection === 'desactivaciones'" class="space-y-6">
          <Desactivacion />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import {ref} from "vue";
import Register from "../../components/Process/Register.vue"
import Sanciones from "@/components/Process/Sanciones.vue";
import Traslado from "@/components/Process/Traslado.vue";
import Desactivacion from "./Desactivacion.vue"

const activeSection = ref("register");

// Elementos de navegación
const navigationItems = [
  { id: "register", title: "Registro de actividades" },
  { id: "sancion", title: "Sanciones"},
  { id: "traslado", title: "Traslados"},
  {id: "desactivaciones", title: "Desactivaciones"},
]

</script>
