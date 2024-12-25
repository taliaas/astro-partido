<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Header -->
    <header >
      <div class="mx-auto px-4">
          <div class="flex justify-center p-4">
            <span class="text-2xl font-semibold text-blue-600">Ayuda del Sistema</span>
          </div>
        </div>
    </header>

    <!-- New Card-based Navigation -->
    <div class="mx-auto max-w-7xl px-4 py-8">
      <!-- Section Navigation Cards -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <button
            v-for="section in sections"
            :key="section.id"
            @click="currentSection = section.id"
            :class="[
            'group relative overflow-hidden rounded-xl border p-6 transition-all duration-300',
            currentSection === section.id
              ? 'border-blue-500 bg-blue-50 shadow-lg'
              : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-md'
          ]"
        >
          <div class="relative z-10">
            <component
                :is="section.icon"
                :class="[
                'h-8 w-8 mb-4 transition-colors',
                currentSection === section.id
                  ? 'text-blue-500'
                  : 'text-gray-400 group-hover:text-blue-400'
              ]"
            />
            <h3 class="mb-2 font-bold text-gray-900">{{ section.title }}</h3>
            <p class="text-sm text-gray-500">{{ section.description }}</p>
          </div>

        </button>
      </div>

      <!-- Content Area -->
      <div class="mt-8">
        <div v-if="currentStepContent" class="rounded-xl border border-gray-200 bg-white p-8">
          <div class="grid gap-8 lg:grid-cols-2">
            <!-- Content Side -->
            <div class="space-y-6">
              <div>
                <h2 class="text-2xl font-semibold text-gray-900">{{ currentStepContent.title }}</h2>
                <p class="mt-2 text-gray-600">{{ currentStepContent.description }}</p>
              </div>

              <div class="space-y-4">
                <h3 class="font-medium text-gray-900">Pasos Importantes</h3>
                <ul class="space-y-3">
                  <li
                      v-for="(point, index) in currentStepContent.points"
                      :key="index"
                      class="flex items-start rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                  >
                    <CheckCircleIcon class="mr-3 h-5 w-5 text-blue-500" />
                    <span class="text-gray-600">{{ point }}</span>
                  </li>
                </ul>
              </div>

              <!-- Step Navigation -->
              <div class="flex items-center justify-between space-x-4 pt-6">
                <button
                    v-if="previousStep"
                    @click="currentStep = previousStep.id"
                    class="flex items-center space-x-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                >
                  <ArrowLeftIcon class="h-4 w-4" />
                  <span>{{ previousStep.title }}</span>
                </button>
                <button
                    v-if="nextStep"
                    @click="currentStep = nextStep.id"
                    class="ml-auto flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600"
                >
                  <span>{{ nextStep.title }}</span>
                  <ArrowRightIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Visual Side -->
            <div class="space-y-6">
              <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <img
                    :src="currentStepContent.image"
                    :alt="currentStepContent.title"
                    class="w-full object-cover"
                />
                <div class="p-4">
                  <p class="text-sm text-gray-500">
                    {{ currentStepContent.imageCaption || 'Visualización del paso actual' }}
                  </p>
                </div>
              </div>

              <!-- Quick Steps -->
              <div class="rounded-xl border border-gray-200 p-4">
                <h4 class="mb-4 font-medium text-gray-900">Acciones Rápidas</h4>
                <div class="grid grid-cols-2 gap-3">
                  <button
                      v-for="step in currentSteps"
                      :key="step.id"
                      @click="currentStep = step.id"
                      :class="[
                      'flex items-center space-x-2 rounded-lg p-3 text-sm transition-colors',
                      currentStep === step.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    ]"
                  >
                    <component :is="step.icon" class="h-4 w-4" />
                    <span>{{ step.title }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChartBarIcon,
  CheckCircleIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  SettingsIcon
} from 'lucide-vue-next'

const sections = [
  {
    id: 'inicio',
    title: 'Inicio',
    description: 'Comience aquí para aprender los conceptos básicos del sistema',
    icon: LayoutDashboardIcon
  },
  {
    id: 'funcionamiento',
    title: 'Funcionamiento',
    description: 'Aprenda cómo configurar y utilizar las funciones principales',
    icon: SettingsIcon
  },
  {
    id: 'analisis',
    title: 'Análisis',
    description: 'Explore las herramientas de análisis de datos y KPIs',
    icon: ChartBarIcon
  },
  {
    id: 'reportes',
    title: 'Reportes',
    description: 'Genere y personalice sus informes y reportes',
    icon: FileTextIcon
  }
]

const steps = {
  'inicio': [
    {
      id: 'overview',
      title: 'Visión General',
      icon: LayoutDashboardIcon,
      content: {
        title: 'Plataforma de Análisis de KPIs',
        description: 'Bienvenido a la plataforma de análisis de KPIs. Aprenda a utilizar las herramientas para monitorear y analizar sus indicadores clave de rendimiento.',
        points: [
          'Dashboard personalizable con widgets arrastrables',
          'Visualización de datos en tiempo real con actualizaciones automáticas',
          'Sistema de alertas y notificaciones configurables',
          'Exportación de reportes en múltiples formatos'
        ],
        image: '/public/logo-cujae.png',
        imageCaption: 'Vista general del dashboard principal'
      }
    }
  ],
  'funcionamiento': [
    {
      id: 'kpi-setup',
      title: 'Configuración de KPIs',
      icon: SettingsIcon,
      content: {
        title: 'Configurar sus KPIs',
        description: 'Aprenda a configurar y personalizar sus indicadores clave de rendimiento según sus necesidades específicas.',
        points: [
          'Definición de métricas personalizadas',
          'Establecimiento de objetivos y metas',
          'Configuración de períodos de medición',
          'Definición de umbrales de alerta'
        ],
        image: '/placeholder.svg?height=300&width=400',
        imageCaption: 'Pantalla de configuración de indicadores'
      }
    }
  ],
  'analisis': [
    {
      id: 'data-analysis',
      title: 'Análisis de Datos',
      icon: ChartBarIcon,
      content: {
        title: 'Análisis de Indicadores',
        description: 'Explore las herramientas de análisis para obtener insights valiosos de sus KPIs.',
        points: [
          'Análisis de tendencias históricas',
          'Comparativas temporales y benchmarking',
          'Filtros avanzados y segmentación',
          'Herramientas de análisis predictivo'
        ],
        image: 'public/logo.jpg',
        imageCaption: 'Panel de análisis de datos'
      }
    }
  ],
  'reportes': [
    {
      id: 'reports',
      title: 'Generación de Reportes',
      icon: FileTextIcon,
      content: {
        title: 'Reportes y Exportación',
        description: 'Aprenda a generar y personalizar reportes con sus KPIs más importantes.',
        points: [
          'Creación de plantillas personalizadas',
          'Exportación en formatos PDF, Excel y más',
          'Programación de reportes automáticos',
          'Sistema de distribución automática'
        ],
        image: '/placeholder.svg?height=300&width=400',
        imageCaption: 'Sistema de generación de reportes'
      }
    }
  ]
}

const currentSection = ref('inicio')
const currentStep = ref('overview')

const currentSteps = computed(() => steps[currentSection.value] || [])

const currentStepContent = computed(() => {
  const step = currentSteps.value.find(s => s.id === currentStep.value)
  return step?.content
})

const currentStepIndex = computed(() => {
  return currentSteps.value.findIndex(s => s.id === currentStep.value)
})

const previousStep = computed(() => {
  if (currentStepIndex.value > 0) {
    return currentSteps.value[currentStepIndex.value - 1]
  }
  return null
})

const nextStep = computed(() => {
  if (currentStepIndex.value < currentSteps.value.length - 1) {
    return currentSteps.value[currentStepIndex.value + 1]
  }
  return null
})
</script>