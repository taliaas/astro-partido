<template>
    <div class="w-64 border-l bg-white p-4 hidden xl:block">
        <!-- Institutional Logos -->
        <div class="mb-8 space-y-4">
            <h3 class="text-sm font-medium text-gray-500">Instituciones</h3>
            <div class="space-y-4">
                <div class="flex justify-center">
                    <img src="/src/img/pcc-1020x642.jpg" alt="Logo PCC" class="h-15" />
                </div>
                <div class="flex justify-center gap-4">
                    <img src="/src/img/download.jpeg" alt="Logo CUJAE" class="h-10" />
                </div>
            </div>
        </div>

        <!-- Quick Access -->
        <div class="mb-8">
            <h3 class="mb-4 text-sm font-medium text-gray-500">Acceso Rápido</h3>
            <div class="grid grid-cols-2 gap-2">
                <button
                    class="flex flex-col items-center p-3 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <FileText class="h-5 w-5 mb-1" />
                    Plantillas
                </button>
                <button
                    class="flex flex-col items-center p-3 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <Users class="h-5 w-5 mb-1" />
                    Directorio
                </button>
                <button
                    class="flex flex-col items-center p-3 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <HelpCircle class="h-5 w-5 mb-1" />
                    Ayuda
                </button>
                <button
                    class="flex flex-col items-center p-3 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <BookOpen class="h-5 w-5 mb-1" />
                    Manual
                </button>
            </div>
        </div>

        <!-- Recent Activity -->
        <div>
            <h3 class="mb-4 text-sm font-medium text-gray-500">Actividad Reciente</h3>
            <div class="space-y-4">
                <div v-for="activity in recentActivity" :key="activity.id" class="flex gap-3">
                    <div :class="`rounded-full p-2 ${activity.iconBg}`">
                        <component :is="activity.icon" class="h-4 w-4" :class="activity.iconColor" />
                    </div>
                    <div>
                        <p class="text-sm text-gray-900">{{ activity.message }}</p>
                        <p class="text-xs text-gray-500">{{ activity.time }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    FileText,
    Users,
    HelpCircle,
    BookOpen,
    ActivitySquare,
    Upload,
    Edit,
    Download
} from 'lucide-vue-next'

const recentActivity = [
    {
        id: 1,
        icon: Upload,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        message: 'Nueva acta subida',
        time: 'Hace 5 minutos'
    },
    {
        id: 2,
        icon: Edit,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        message: 'Documento editado',
        time: 'Hace 15 minutos'
    },
    {
        id: 3,
        icon: Download,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        message: 'Informe descargado',
        time: 'Hace 30 minutos'
    }
]
</script>