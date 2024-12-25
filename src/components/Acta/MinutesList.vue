<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-[1600px] mx-auto p-6">
        <!-- Main Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <!-- Header Section -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex flex-col space-y-1">
              <h1 class="text-2xl font-semibold text-gray-900">Control de Actas</h1>
              <p class="text-sm text-gray-500">Gestión y seguimiento de documentación oficial</p>
            </div>
          </div>
  
          <!-- Tabs Navigation -->
          <Tabs :default-value="currentTab" class="w-full" @change="handleTabChange">
            <TabsList class="w-full border-b border-gray-200 px-6">
              <TabsTrigger v-for="tab in tabs" :key="tab.id" :value="tab.id" class="relative py-4 px-1">
                <span class="flex items-center space-x-2">
                  <component :is="tab.icon" class="h-4 w-4" />
                  <span>{{ tab.name }}</span>
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
  
          <!-- Content Area -->
          <div class="divide-y divide-gray-200">
            <!-- Actions Bar -->
            <div class="p-6 bg-white">
              <div class="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
                <div class="flex flex-wrap gap-3">
                  <Button variant="outline" @click="showUploadDialog = true">
                    <UploadIcon class="h-4 w-4 mr-2" />
                    Cargar acta
                  </Button>
                  <Button variant="outline">
                    <DownloadIcon class="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
                <Button class="bg-blue-500">
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Crear nueva acta
                </Button>
              </div>
            </div>
  
            <!-- Filters -->
            <div class="p-6 bg-white">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="space-y-1.5">
                  <Label for="nucleo">Núcleo</Label>
                  <Select v-model="filters.nucleo">
                    <SelectTrigger id="nucleo">
                      <SelectValue placeholder="Todos los núcleos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los núcleos</SelectItem>
                      <SelectItem v-for="nucleo in nucleos" :key="nucleo" :value="nucleo">
                        {{ nucleo }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="space-y-1.5">
                  <Label for="date">Fecha</Label>
                  <Input id="date" type="date" v-model="filters.date" />
                </div>
                <div class="space-y-1.5">
                  <Label for="status">Estado</Label>
                  <Select v-model="filters.status">
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los estados</SelectItem>
                      <SelectItem v-for="status in statuses" :key="status" :value="status">
                        {{ status }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
  
            <!-- Table -->
            <div class="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead v-for="header in tableHeaders" :key="header">{{ header }}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="acta in filteredActas" :key="acta.id" class="hover:bg-gray-50 transition-colors duration-200">
                    <TableCell>{{ acta.no }}</TableCell>
                    <TableCell>
                      <div class="flex items-center">
                        <FileTextIcon class="h-4 w-4 text-gray-400 mr-2" />
                        {{ acta.name }}
                      </div>
                    </TableCell>
                    <TableCell>{{ acta.nucleo }}</TableCell>
                    <TableCell>{{ formatDate(acta.date) }}</TableCell>
                    <TableCell>
                      <Badge :variant="getStatusVariant(acta.status)">
                        {{ acta.status }}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger as="button" class="text-gray-400 hover:text-gray-500 transition-colors duration-200">
                          <MoreVerticalIcon class="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem v-for="action in actions" :key="action.name" @click="handleAction(action.name, acta)">
                            <component :is="action.icon" class="h-4 w-4 mr-2" />
                            <span>{{ action.name }}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
  
              <!-- Empty State -->
              <div v-if="filteredActas.length === 0" class="text-center py-12">
                <FileSearchIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron actas</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Ajuste los filtros o cree una nueva acta para comenzar.
                </p>
              </div>
            </div>
  
            <!-- Pagination -->
            <div class="px-6 py-4 bg-white">
              <div class="flex items-center justify-between">
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm text-gray-700">
                      Mostrando
                      <span class="font-medium">1</span>
                      a
                      <span class="font-medium">10</span>
                      de
                      <span class="font-medium">{{ filteredActas.length }}</span>
                      resultados
                    </p>
                  </div>
                  <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <Button variant="outline" class="rounded-l-md">
                        <ChevronLeftIcon class="h-5 w-5" />
                      </Button>
                      <Button v-for="page in 3" :key="page" variant="outline" :class="{ 'bg-blue-50 text-blue-600': page === 1 }">
                        {{ page }}
                      </Button>
                      <Button variant="outline" class="rounded-r-md">
                        <ChevronRightIcon class="h-5 w-5" />
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Upload Dialog -->
      <Dialog :open="showUploadDialog" @update:open="showUploadDialog = $event">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cargar actas</DialogTitle>
            <DialogDescription>
              Seleccione o arrastre los archivos que desea cargar
            </DialogDescription>
          </DialogHeader>
          <div
            class="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors duration-200"
            :class="{ 'border-blue-500 bg-blue-50': isDragging }"
            @drop.prevent="handleDrop"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @dragenter.prevent
          >
            <UploadCloudIcon 
              class="mx-auto h-12 w-12 transition-colors duration-200"
              :class="isDragging ? 'text-blue-500' : 'text-gray-400'"
            />
            <p class="mt-2 text-sm text-gray-600">
              <span class="font-medium hover:text-gray-700">
                Arrastre archivos aquí
              </span>
              o
              <button
                @click="$refs.fileInput.click()"
                class="font-medium text-blue-600 hover:text-blue-500"
              >
                seleccione desde su dispositivo
              </button>
            </p>
            <p class="mt-1 text-xs text-gray-500">
              PDF, hasta 10MB por archivo
            </p>
            <input
              ref="fileInput"
              type="file"
              multiple
              accept=".pdf"
              class="hidden"
              @change="handleFileSelect"
            />
          </div>
  
          <!-- File List -->
          <div class="mt-6 space-y-3">
            <div
              v-for="file in uploadedFiles"
              :key="file.name"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <FileIcon class="h-5 w-5 text-gray-400" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ file.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ formatFileSize(file.size) }}
                  </p>
                </div>
                <div class="flex-shrink-0">
                  <Button variant="ghost" size="icon" @click="removeFile(file)">
                    <XIcon class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
  
          <DialogFooter>
            <Button variant="outline" @click="showUploadDialog = false">
              Cancelar
            </Button>
            <Button @click="uploadFiles" :disabled="!uploadedFiles.length">
              Cargar {{ uploadedFiles.length }} archivo{{ uploadedFiles.length !== 1 ? 's' : '' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { 
    FileTextIcon, UploadIcon, DownloadIcon, PlusIcon, MoreVerticalIcon, 
    XIcon, UploadCloudIcon, FileIcon, ChevronLeftIcon, ChevronRightIcon, 
    FileSearchIcon, EyeIcon, PencilIcon, TrashIcon, ClipboardIcon, 
    BookOpenIcon, FileCheckIcon 
  } from 'lucide-vue-next'
import Button from '../ui/button/Button.vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog/index.js';
import Table from '../ui/table/Table.vue';
import TableHeader from '../ui/table/TableHeader.vue';
import TableRow from '../ui/table/TableRow.vue';
import TableHead from '../ui/table/TableHead.vue';
import TableBody from '../ui/table/TableBody.vue';
import TableCell from '../ui/table/TableCell.vue';
import Badge from '../ui/badge/Badge.vue';
import DropdownMenu from '../ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuTrigger from '../ui/dropdown-menu/DropdownMenuTrigger.vue';
import DropdownMenuContent from '../ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuItem from '../ui/dropdown-menu/DropdownMenuItem.vue';
import Label from '../ui/label/Label.vue';
import Select from '../ui/select/Select.vue';
import SelectTrigger from '../ui/select/SelectTrigger.vue';
import SelectValue from '../ui/select/SelectValue.vue';
import SelectContent from '../ui/select/SelectContent.vue';
import SelectItem from '../ui/select/SelectItem.vue';
import Input from '../ui/input/Input.vue';
import Tabs from '../ui/tabs/Tabs.vue';
import TabsList from '../ui/tabs/TabsList.vue';
import TabsTrigger from '../ui/tabs/TabsTrigger.vue';
  
  
  const currentTab = ref('all')
  const showUploadDialog = ref(false)
  const uploadedFiles = ref([])
  const isDragging = ref(false)
  
  const tabs = [
    { id: 'all', name: 'Todas las actas', icon: ClipboardIcon },
    { id: 'ro', name: 'Acta RO', icon: BookOpenIcon },
    { id: 'cp', name: 'Acta CP', icon: FileCheckIcon }
  ]
  
  const nucleos = ['Arquitectura', 'Automática', 'CIPEL', 'CIME']
  const statuses = ['Pendiente', 'Aprobada', 'Rechazada', 'En revisión']
  const tableHeaders = ['No.', 'Nombre del acta', 'Núcleo', 'Fecha', 'Estado', 'Acciones']
  const actions = [
    { name: 'Ver', icon: EyeIcon },
    { name: 'Editar', icon: PencilIcon },
    { name: 'Eliminar', icon: TrashIcon }
  ]
  
  const filters = ref({
    nucleo: '',
    date: '',
    status: ''
  })
  
  const actas = ref([
    {
      id: 1,
      no: '001',
      name: 'Acta RO Marzo 2024',
      nucleo: 'Arquitectura',
      date: '2024-03-15',
      status: 'Aprobada'
    },
    {
      id: 2,
      no: '002',
      name: 'Acta CP Marzo 2024',
      nucleo: 'Automática',
      date: '2024-03-16',
      status: 'Pendiente'
    },
    {
      id: 3,
      no: '003',
      name: 'Acta RO Febrero 2024',
      nucleo: 'CIPEL',
      date: '2024-02-28',
      status: 'En revisión'
    }
  ])
  
  const filteredActas = computed(() => {
    return actas.value.filter(acta => {
      if (filters.value.nucleo && acta.nucleo !== filters.value.nucleo) return false
      if (filters.value.date && acta.date !== filters.value.date) return false
      //if (filters.value.filters.value.status && acta.status !== filters.value.status) return false
      return true
    })
  })
  
  const getStatusVariant = (status) => {
    const variants = {
      'Aprobada': 'success',
      'Pendiente': 'warning',
      'Rechazada': 'destructive',
      'En revisión': 'secondary'
    }
    return variants[status] || 'default'
  }
  
  const handleTabChange = (value) => {
    currentTab.value = value
  }
  
  const handleAction = (action, acta) => {
    console.log(`${action} acta:`, acta)
  }
  
  const handleDrop = (event) => {
    isDragging.value = false
    const files = Array.from(event.dataTransfer.files)
    uploadedFiles.value = [...uploadedFiles.value, ...files]
  }
  
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    uploadedFiles.value = [...uploadedFiles.value, ...files]
  }
  
  const removeFile = (file) => {
    uploadedFiles.value = uploadedFiles.value.filter(f => f !== file)
  }
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const uploadFiles = () => {
    // Implement file upload logic here
    console.log('Uploading files:', uploadedFiles.value)
    showUploadDialog.value = false
    uploadedFiles.value = []
  }
  </script>
  
  <style scoped>
  /* Add any scoped styles here if needed */
  </style>