<template>
  <div class="w-64 border-r-2">
    <div class="flex h-screen">
      <!-- Barra lateral -->
      <aside class="bg-blue-700 text-white">
        <div class="flex items-center justify-between p-4">
          <a href="/" class="flex items-center space-x-2">
            <HomeIcon class="w-8 h-8 text-blue-300" />
            <span class="text-xl font-bold">Nombre</span>
          </a>
        </div>
        <nav>
          <ul class="space-y-2 w-64">
            <li v-for="(item, index) in menuItems" :key="index">
              <button
                @click="activeTab = item.id"
                class="w-full text-left py-2 px-4 rounded transition duration-200 ease-in-out"
                :class="activeTab === item.id ? 'bg-blue-500' : 'hover:bg-blue-500'"
              >
                <component :is="item.icon" class="inline-block mr-2" />
                {{ item.name }}
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { HomeIcon, UsersIcon, CogIcon, ShieldIcon, FileTextIcon } from "lucide-vue-next";

const activeTab = ref("usuarios");

const menuItems = ref([
  { id: "usuarios", name: "Usuarios del Sistema", icon: UsersIcon },
  { id: "general", name: "Configuraciones Generales", icon: CogIcon },
  { id: "permisos", name: "Permisos y Roles", icon: ShieldIcon },
  { id: "documentos", name: "Configuración de Documentos", icon: FileTextIcon },
]);
</script>
