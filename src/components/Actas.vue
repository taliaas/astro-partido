<template>
    <div class="min-h-screen bg-gray-100 p-8">
        <div class="max-w-7xl mx-auto bg-white rounded shadow-lg overflow-hidden">
            <div class="p-6">
                <!-- Header -->
                <div class="flex justify-between items-center mb-8">
                    <Button @click="handleNewActa"
                        class="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                        <PlusIcon class="w-5 h-5 mr-2" />
                        Nueva Acta
                    </Button>
                </div>

                <!-- Search and Filters -->
                <div class="flex gap-4 mb-6">
                    <div class="relative flex-1">
                        <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input type="text" placeholder="Buscar actas..." v-model="searchQuery"
                            class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <select v-model="selectedDepartment" placeholder="Núcleo"
                        class="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Innovación</option>
                        <option value="desarrollo">Desarrollo</option>
                        <option value="gestion">Gestión</option>
                    </select>

                    <select v-model="selectedMonth"
                        class="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="enero">Enero</option>
                        <option value="febrero">Febrero</option>
                        <option value="">Marzo</option>
                    </select>
                </div>

                <!-- Table -->
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Título</th>
                                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Núcleo</th>
                                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Fecha</th>
                                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Estado</th>
                                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="acta in actas" :key="acta.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 text-sm text-gray-900">{{ acta.titulo }}</td>
                                <td class="px-6 py-4 text-sm text-gray-900">{{ acta.nucleo }}</td>
                                <td class="px-6 py-4 text-sm text-gray-900">{{ acta.fecha }}</td>
                                <td class="px-6 py-4 text-sm">
                                    <span :class="{
                                        'px-2 py-1 rounded-full text-xs font-medium': true,
                                        'bg-green-100 text-green-800': acta.estado === 'Aprobada',
                                        'bg-yellow-100 text-yellow-800': acta.estado === 'Pendiente',
                                        'bg-red-100 text-red-800': acta.estado === 'Rechazada'
                                    }">
                                        {{ acta.estado }}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="relative" @click="toggleDropdown(acta.id)">
                                        <Button variant="ghost" class="p-1 hover:bg-gray-100 rounded-full">
                                            <MoreVerticalIcon class="w-5 h-5 text-gray-500" />
                                        </Button>

                                        <!-- Dropdown Menu -->
                                        <div v-if="activeDropdown === acta.id"
                                            class="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-10 border">
                                            <div class="py-1">
                                                <Button v-for="(action, index) in actions" :key="index"
                                                    @click="handleAction(action.action, acta)"
                                                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                                    <component :is="action.icon" class="w-4 h-4 mr-2" />
                                                    {{ action.label }}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->


                <!-- Upload Modal -->
                <div v-if="showUploadModal"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div class="bg-white p-6 rounded-lg w-96">
                        <h2 class="text-xl font-bold mb-4">Cargar Acta</h2>
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500"
                            @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop">
                            <UploadCloudIcon class="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p class="text-gray-600">Arrastra y suelta tu archivo aquí o</p>
                            <p class="text-blue-500">haz clic para seleccionar</p>
                            <input type="file" ref="fileInput" class="hidden" @change="handleFileSelect"
                                accept=".pdf,.doc,.docx" />
                        </div>
                        <div class="flex justify-end mt-4 gap-2">
                            <button @click="showUploadModal = false"
                                class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                                Cancelar
                            </button>
                            <button @click="uploadFile"
                                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                Subir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import {
    SearchIcon,
    PlusIcon,
    MoreVerticalIcon,
    EyeIcon,
    PencilIcon,
    DownloadIcon,
    TrashIcon,
    UploadCloudIcon,
} from 'lucide-vue-next'
import Button from './ui/button/Button.vue';

const searchQuery = ref('')
const selectedDepartment = ref('')
const selectedMonth = ref('')
const activeDropdown = ref(null)
const currentPage = ref(1)
const hasNextPage = ref(true)
const showUploadModal = ref(false)
const fileInput = ref(null)

const actions = [
    { label: 'Ver', action: 'view', icon: EyeIcon },
    { label: 'Editar', action: 'edit', icon: PencilIcon },
    { label: 'Exportar', action: 'export', icon: DownloadIcon },
    { label: 'Eliminar', action: 'delete', icon: TrashIcon }
]

const actas = ref([
    {
        id: 1,
        titulo: 'Acta Reunión Enero',
        nucleo: 'Desarrollo',
        fecha: '1/14/2024',
        estado: 'Aprobada',
        progreso: 100
    },
    {
        id: 2,
        titulo: 'Acta Planificación Q1',
        nucleo: 'Gestión',
        fecha: '1/9/2024',
        estado: 'Pendiente',
        progreso: 75
    },
    {
        id: 3,
        titulo: 'Acta Revisión Proyectos',
        nucleo: 'Innovación',
        fecha: '1/4/2024',
        estado: 'Rechazada',
        progreso: 30
    }
])

const toggleDropdown = (id) => {
    activeDropdown.value = activeDropdown.value === id ? null : id
}

const handleAction = (action, acta) => {
    console.log(`Action ${action} for acta:`, acta)
    activeDropdown.value = null
}

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

const nextPage = () => {
    if (hasNextPage.value) {
        currentPage.value++
    }
}

const handleNewActa = () => {
    showUploadModal.value = true
}

const triggerFileInput = () => {
    fileInput.value.click()
}

const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
        console.log('Selected file:', file)
    }
}

const handleFileDrop = (event) => {
    const file = event.dataTransfer.files[0]
    if (file) {
        console.log('Dropped file:', file)
    }
}

const uploadFile = () => {
    // Implement file upload logic here
    console.log('Uploading file...')
    showUploadModal.value = false
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>