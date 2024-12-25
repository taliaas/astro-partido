<template>
    <div class="min-h-screen bg-gray-50">
      <div class="flex h-full">
        <!-- Left Sidebar with Tabs -->
        <div class="w-64 bg-white border-r border-gray-200 min-h-screen">
          <!-- Header -->
          <div class="p-6 border-b border-gray-200">
            <h1 class="text-xl font-semibold text-gray-900">Cierre del funcionamiento</h1>
          </div>
          
          <!-- Tabs -->
          <div class="relative">
            <div 
              v-for="(tab, index) in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              class="relative"
            >
              <div 
                class="px-6 py-4 cursor-pointer transition-all duration-200 relative z-10 flex items-center space-x-3"
                :class="[
                  activeTab === tab.id 
                    ? 'text-blue-600 bg-gray-200' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                ]"
              >
                <component :is="tab.icon" class="h-5 w-5" />
                <span class="font-medium">{{ tab.name }}</span>
              </div>
              
              <!-- Connector -->
              <div 
                v-if="activeTab === tab.id"
                class="absolute right-0 top-0 bottom-0 w-[1px] bg-gray-50 z-0"
              ></div>
            </div>
          </div>
        </div>
  
        <!-- Main Content Area -->
        <div class="flex-1 relative">
          <!-- Content wrapper with blended background -->
          <div 
            class="absolute inset-0 transition-colors duration-200"
            :class="{'bg-gray-50': activeTab !== null}"
          >
            <!-- Actual content -->
            <div class="p-6">
              <TransitionGroup 
                name="fade" 
                mode="out-in"
              >
                <div 
                  v-if="activeTab === 'attendance'" 
                  key="attendance"
                  class="bg-gray-50 rounded-lg shadow-sm p-6"
                >
                  <Absent />
                </div>
  
                <div 
                  v-if="activeTab === 'computation'" 
                  key="computation"
                  class="bg-gray-50 rounded-lg shadow-sm p-6"
                >
                  <Computo />
                </div>
  
                <div 
                  v-if="activeTab === 'municipality'" 
                  key="municipality"
                  class="bg-gray-50 rounded-lg shadow-sm p-6"
                >
                  
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Computo from '@/components/reportes/Computo.vue';
  import Absent from '@/components/reportes/Absent.vue';
  import { 
    ClipboardCheckIcon, 
    CalculatorIcon,
    BuildingIcon
  } from 'lucide-vue-next'
  
  const tabs = [
    {
      id: 'attendance',
      name: 'Asistencia',
      icon: ClipboardCheckIcon
    },
    {
      id: 'computation',
      name: 'Cómputo',
      icon: CalculatorIcon
    },
    {
      id: 'municipality',
      name: 'Parte municipio',
      icon: BuildingIcon
    }
  ]
  
  const activeTab = ref('attendance')
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* Remove the border between active tab and content */
  .active-tab-connector {
    position: absolute;
    right: -1px;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: white;
  }
  </style>