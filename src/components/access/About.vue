<template>
  <div class="min-h-screen bg-gray-50 w-full">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-linear-to-br from-blue-600 to-blue-800 py-20 sm:py-32">
      <div class="absolute inset-0 bg-blue-800 opacity-50"></div>
      <div
        class="absolute inset-0 bg-grid-white/[0.2] bg-grid-16 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.1))]">
      </div>
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-white">
            Sistema Motor
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-xl text-blue-100 sm:text-2xl">
            Plataforma avanzada para la gestión y análisis de actas del Partido Comunista
          </p>
          <div class="mt-10 flex justify-center gap-x-6">
            <a href="#features"
              class="rounded-md bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Explorar Características
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div id="features" class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <!-- Overview Section -->
      <div class="mb-20 text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Gestión Integral de Datos
        </h2>
        <p class="mx-auto mt-4 max-w-3xl text-xl text-gray-600">
          Una solución completa para la captura, análisis y visualización de información crucial
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <!-- Feature Cards -->
        <div v-for="(feature, index) in features" :key="index"
          class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl">
          <div
            class="absolute inset-0 bg-linear-to-br from-blue-50 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          </div>
          <div class="relative z-10">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
              <component :is="feature.icon" class="h-6 w-6" />
            </div>
            <h3 class="mt-6 text-xl font-semibold text-gray-900">
              {{ feature.title }}
            </h3>
            <p class="mt-2 text-gray-600">
              {{ feature.description }}
            </p>
            <ul class="mt-4 space-y-3">
              <li v-for="(point, pointIndex) in feature.points" :key="pointIndex" class="flex items-start">
                <CheckIcon class="mr-2 h-5 w-5 shrink-0 text-blue-500" />
                <span class="text-sm text-gray-600">{{ point }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Technical Advantages -->
      <div class="mt-24 border-2 rounded m-2 p-4 bg-gray-100">
        <h2 class="mb-12 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Ventajas Técnicas
        </h2>
        <div class="grid gap-8 md:grid-cols-2">
          <div v-for="(advantage, index) in advantages" :key="index"
            class="rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
            <div class="flex items-center">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <component :is="advantage.icon" class="h-6 w-6 text-blue-600" />
              </div>
              <h3 class="ml-4 text-lg font-semibold text-gray-900">
                {{ advantage.title }}
              </h3>
            </div>
            <p class="mt-4 text-gray-600">{{ advantage.description }}</p>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="mt-24 overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-blue-800 shadow-2xl">
        <div class="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between lg:py-20">
          <div>
            <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Comience a utilizar Motor hoy
            </h2>
            <p class="mt-4 max-w-2xl text-lg text-blue-100">
              Descubra cómo Motor puede transformar la gestión de actas y mejorar la eficiencia en su organización
            </p>
          </div>
          <div class="mt-8 flex lg:mt-0 lg:shrink-0">
            <div class="inline-flex rounded-md shadow">
              <a href="/register"
                class="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-blue-600 hover:bg-blue-50">
                Comenzar ahora
              </a>
            </div>
            <div class="ml-3 inline-flex">

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ClipboardIcon,
  BarChart3Icon,
  BellIcon,
  CalendarIcon,
  ShieldCheckIcon,
  LayersIcon,
  LinkIcon,
  MonitorIcon,
  CheckIcon
} from 'lucide-vue-next'

const features = [
  {
    title: 'Captura de Datos',
    description: 'Sistema dual de entrada de datos que maximiza la eficiencia y precisión',
    icon: ClipboardIcon,
    points: [
      'Formulario interactivo para registro manual',
      'Carga automática desde fuentes oficiales',
      'Validación en tiempo real de datos'
    ]
  },
  {
    title: 'Análisis y Visualización',
    description: 'Herramientas avanzadas para el análisis y visualización de datos',
    icon: BarChart3Icon,
    points: [
      'Generación automática de tablas de balance',
      'Gráficos dinámicos interactivos',
      'Identificación de tendencias y patrones'
    ]
  },
  {
    title: 'Sistema de Alertas',
    description: 'Monitoreo continuo y notificaciones personalizadas',
    icon: BellIcon,
    points: [
      'Detección de indicadores negativos',
      'Alertas personalizables',
      'Notificaciones en tiempo real'
    ]
  },
  {
    title: 'Calendario Integrado',
    description: 'Gestión eficiente de reuniones y eventos',
    icon: CalendarIcon,
    points: [
      'Planificación de reuniones',
      'Recordatorios automáticos',
      'Sincronización con calendarios externos'
    ]
  },
  {
    title: 'Generación de Reportes',
    description: 'Creación automatizada de informes detallados',
    icon: LayersIcon,
    points: [
      'Reportes personalizables',
      'Exportación en múltiples formatos',
      'Programación de informes periódicos'
    ]
  },
  {
    title: 'Visualización de Datos',
    description: 'Representación gráfica intuitiva de la información',
    icon: MonitorIcon,
    points: [
      'Gráficos interactivos',
      'Dashboards personalizables',
      'Análisis comparativo'
    ]
  }
]

const advantages = [
  {
    title: 'Interfaz Intuitiva',
    description: 'Diseño moderno y fácil de usar que permite un acceso rápido a todas las funcionalidades del sistema.',
    icon: MonitorIcon
  },
  {
    title: 'Seguridad Robusta',
    description: 'Implementación de medidas de seguridad avanzadas para proteger la integridad de los datos sensibles.',
    icon: ShieldCheckIcon
  },
  {
    title: 'Escalabilidad',
    description: 'Arquitectura modular diseñada para crecer y adaptarse a las necesidades cambiantes de la organización.',
    icon: LayersIcon
  },
  {
    title: 'Integración',
    description: 'Capacidad de sincronización con otras plataformas y sistemas utilizados por la organización.',
    icon: LinkIcon
  }
]
</script>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>