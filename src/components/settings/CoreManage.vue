<template>
  <div class="rounded-lg border bg-card shadow-sm">
    <div class="p-6 space-y-6">
      <div class="p-2">
        <!-- Sección de Comités -->
        <div class="flex flex-row items-center justify-between mb-4">
          <h2 class="font-medium text-xl text-foreground">Cómites</h2>
          <Button @click="handleAddComite" class="flex items-center gap-1 bg-button">
            <PlusIcon class="h-4 w-4 mr-1" />
            Añadir
          </Button>
        </div>

        <div class="rounded-md border">
          <table class="w-full text-sm">
            <thead>
            <tr class="border-b bg-muted/50 font-medium">
              <th class="h-10 px-4 text-left">Nombre</th>
              <th class="h-10 px-4 text-center">Núcleos</th>
              <th class="h-10 px-4 text-left w-[50px]"></th>
            </tr>
            </thead>
            <tbody>
            <template v-if="comites.length === 0">
              <tr>
                <td colspan="3" class="p-4 text-center text-muted-foreground">
                  No hay comités registrados.
                </td>
              </tr>
            </template>

            <template v-for="comite in comites" :key="comite.id">
              <!-- Fila del comité -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-4">
                  <div class="flex items-center cursor-pointer" @click="toggleComiteExpansion(comite.id)">
                    <component
                        :is="expandedComites.includes(comite.id) ? ChevronDownIcon : ChevronRightIcon"
                        class="h-4 w-4 mr-2 text-muted-foreground"
                    />
                    <span class="font-medium">{{ comite.name }}</span>
                  </div>
                </td>
                <td class="p-4 text-center">
                {{ comite.core?.length }}
                </td>
                <td class="p-4">
                  <div class="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        @click="toggleComiteDropdown(comite.id)"
                    >
                      <MoreVerticalIcon class="h-4 w-4" />
                    </Button>
                    <div
                        v-if="activeComiteDropdown === comite.id"
                        class="absolute right-0 z-10 mt-2 w-56 rounded-md border bg-background shadow-lg"
                    >
                      <div class="py-2 px-3 text-sm font-medium text-muted-foreground border-b bg-muted">
                        Acciones
                      </div>
                      <div class="py-1">
                        <a
                            href="#"
                            class="block px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"
                            @click.prevent="handleEditComite(comite)"
                        >
                          <EditIcon class="h-4 w-4" />
                          Editar
                        </a>
                        <a
                            href="#"
                            class="block px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"
                            @click.prevent="handleAddNucleo(comite.id)"
                        >
                          <PlusIcon class="h-4 w-4" />
                          Añadir Núcleo
                        </a>
                        <div class="border-t my-1"></div>
                        <a
                            href="#"
                            class="block px-4 py-2 text-sm text-red-600 hover:bg-muted flex items-center gap-2"
                            @click.prevent="handleDeleteComite(comite.id)"
                        >
                          <Trash2Icon class="h-4 w-4" />
                          Eliminar
                        </a>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Núcleos expandidos del comité -->
              <tr v-if="expandedComites.includes(comite.id)" class="bg-muted/10">
                <td colspan="3" class="p-0">
                  <div class="px-10 py-2 border-t">
                    <div v-if="getNucleosByComite(comite.id).length === 0" class="py-4 text-center text-muted-foreground">
                      No hay núcleos asociados a este comité.
                      <a
                          href="#"
                          class="text-primary ml-2"
                          @click.prevent="handleAddNucleo(comite.id)"
                      >
                        Añadir núcleo
                      </a>
                    </div>

                    <template v-else>
                      <div class="grid grid-cols-12 p-2 font-medium text-sm text-muted-foreground">
                        <div class="col-span-3">Nombre</div>
                        <div class="col-span-3">Secretario General</div>
                        <div class="col-span-3">Secretario de Funcionamiento</div>
                        <div class="col-span-2 text-center">Militantes</div>
                        <div class="col-span-1"></div>
                      </div>

                      <div
                          v-for="nucleo in getNucleosByComite(comite.id)"
                          :key="nucleo.id"
                          class="grid grid-cols-12 p-2 items-center border-t border-muted/30 hover:bg-muted/20"
                      >
                        <div class="col-span-3 flex items-center">
                          {{ nucleo.name }}
                        </div>
                        <div class="col-span-3 text-sm">{{ nucleo.secretarioGeneral }}</div>
                        <div class="col-span-3 text-sm">{{ nucleo.secretarioFuncionamiento }}</div>
                        <div class="col-span-2 text-center">
                         {{ nucleo.militantes?.length }}
                        </div>
                        <div class="col-span-1 flex justify-end">
                          <Button variant="ghost" size="icon" @click="toggleNucleoDropdown(nucleo.id)">
                            <MoreVerticalIcon class="h-4 w-4" />
                          </Button>
                          <div
                              v-if="activeNucleoDropdown === nucleo.id"
                              class="absolute right-0 z-10 mt-2 w-56 rounded-md border bg-background shadow-lg"
                          >
                            <div class="py-2 px-3 text-sm font-medium text-muted-foreground border-b bg-muted">
                              Acciones
                            </div>
                            <div class="py-1">
                              <a
                                  href="#"
                                  class="block px-4 py-2 text-sm hover:bg-muted flex items-center gap-2"
                                  @click.prevent="handleEditNucleo(nucleo)"
                              >
                                <EditIcon class="h-4 w-4" />
                                Editar
                              </a>
                              <div class="border-t my-1"></div>
                              <a
                                  href="#"
                                  class="block px-4 py-2 text-sm text-red-600 hover:bg-muted flex items-center gap-2"
                                  @click.prevent="handleDeleteNucleo(nucleo.id)"
                              >
                                <Trash2Icon class="h-4 w-4" />
                                Eliminar
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </td>
              </tr>
            </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Diálogo para añadir/editar comité -->
  <Dialog :open="comiteDialogOpen" @update:open="comiteDialogOpen = $event">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Editar Comité' : 'Añadir Comité' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing
            ? 'Modifica los datos del comité seleccionado.'
            : 'Completa los datos para crear un nuevo comité.'
          }}
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="nombre" class="text-right">Nombre</Label>
          <Input
              id="nombre"
              v-model="comiteForm.nombre"
              class="col-span-3"
              placeholder="Nombre del comité"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="comiteDialogOpen = false">
          Cancelar
        </Button>
        <Button @click="saveComite" :disabled="!comiteForm.nombre">
          {{ isEditing ? 'Guardar cambios' : 'Crear comité' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- Diálogo para añadir/editar núcleo -->
  <Dialog :open="nucleoDialogOpen" @update:open="nucleoDialogOpen = $event">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Editar Núcleo' : 'Añadir Núcleo' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing
            ? 'Modifica los datos del núcleo seleccionado.'
            : `Completa los datos para crear un nuevo núcleo${
                selectedComite ? ` en el comité "${selectedComite.nombre}"` : ''
            }.`
          }}
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="nucleo-nombre" class="text-right">Nombre</Label>
          <Input
              id="nucleo-nombre"
              v-model="nucleoForm.nombre"
              class="col-span-3"
              placeholder="Nombre del núcleo"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="secretario-general" class="text-right">Secretario General</Label>
          <Input
              id="secretario-general"
              v-model="nucleoForm.secretarioGeneral"
              class="col-span-3"
              placeholder="Nombre del secretario general"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="secretario-funcionamiento" class="text-right">Secretario de Funcionamiento</Label>
          <Input
              id="secretario-funcionamiento"
              v-model="nucleoForm.secretarioFuncionamiento"
              class="col-span-3"
              placeholder="Nombre del secretario de funcionamiento"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="militantes" class="text-right">Militantes</Label>
          <Input
              id="militantes"
              type="number"
              min="0"
              v-model="nucleoForm.militantes"
              class="col-span-3"
              placeholder="Número de militantes"
          />
        </div>
        <div v-if="!selectedComite" class="grid grid-cols-4 items-center gap-4">
          <Label for="comite" class="text-right">Comité</Label>
          <Select v-model="nucleoForm.comiteId" class="col-span-3">
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar comité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="comite in comites" :key="comite.id" :value="comite.id">
                {{ comite.nombre }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="nucleoDialogOpen = false">
          Cancelar
        </Button>
        <Button
            @click="saveNucleo"
            :disabled="!nucleoForm.nombre || !nucleoForm.secretarioGeneral || !nucleoForm.secretarioFuncionamiento || (!selectedComite && !nucleoForm.comiteId)"
        >
          {{ isEditing ? 'Guardar cambios' : 'Crear núcleo' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  MoreVerticalIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  EditIcon,
  Trash2Icon,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Tipos de datos
interface Nucleo {
  id: string
  name: string
  secretarioGeneral: string
  secretarioFuncionamiento: string
  militantes: number
  comiteId: string
}

interface Comite {
  id: string
  name: string
  core: Nucleo
}

const { comites, cores } = defineProps<{ comites: Comite[]; cores: Nucleo[] }>();

const expandedComites = ref<string[]>([])
const selectedComite = ref<Comite | null>(null)

// Dropdowns
const activeComiteDropdown = ref<string | null>(null)
const activeNucleoDropdown = ref<string | null>(null)

// Diálogos
const comiteDialogOpen = ref(false)
const nucleoDialogOpen = ref(false)
const isEditing = ref(false)

// Formularios
const comiteForm = reactive({
  id: '',
  nombre: '',
})

const nucleoForm = reactive({
  id: '',
  nombre: '',
  secretarioGeneral: '',
  secretarioFuncionamiento: '',
  militantes: 0,
  comiteId: '',
})

// Funciones para manejar la expansión de comités
const toggleComiteExpansion = (comiteId: string) => {
  console.log(comiteId)
  if (expandedComites.value.includes(comiteId)) {
    expandedComites.value = expandedComites.value.filter(id => id !== comiteId)
  } else {
    expandedComites.value.push(comiteId)
  }
}

// Funciones para manejar dropdowns
const toggleComiteDropdown = (comiteId: string) => {
  activeComiteDropdown.value = activeComiteDropdown.value === comiteId ? null : comiteId
  if (activeNucleoDropdown.value) {
    activeNucleoDropdown.value = null
  }
}

const toggleNucleoDropdown = (nucleoId: string) => {
  activeNucleoDropdown.value = activeNucleoDropdown.value === nucleoId ? null : nucleoId
  // Cerrar el otro dropdown si está abierto
  if (activeComiteDropdown.value) {
    activeComiteDropdown.value = null
  }
}

// Obtener núcleos por comité
const getNucleosByComite = (comiteId: string) => {
  return cores.filter(nucleo => nucleo.comite?.id === comiteId)
}

// Obtener nombre del comité por ID
const getComiteNombre = (comiteId: string) => {
  const comite = comites.find(c => c.id === comiteId)
  return comite ? comite.name : 'Sin comité'
}

// Funciones para manejar comités
const handleAddComite = () => {
  isEditing.value = false
  comiteForm.id = ''
  comiteForm.nombre = ''
  comiteDialogOpen.value = true
}

const handleEditComite = (comite: Comite) => {
  isEditing.value = true
  comiteForm.id = comite.id
  comiteForm.nombre = comite.nombre
  comiteDialogOpen.value = true
  activeComiteDropdown.value = null
}

const handleDeleteComite = (comiteId: string) => {
  comites.value = comites.value.filter(comite => comite.id !== comiteId)
  cores.value = cores.value.filter(nucleo => nucleo.comiteId !== comiteId)
  activeComiteDropdown.value = null
}

const saveComite = () => {
  if (isEditing.value && comiteForm.id) {
    // Actualizar comité existente
    const index = comites.value.findIndex(c => c.id === comiteForm.id)
    if (index !== -1) {
      comites.value[index].nombre = comiteForm.nombre
    }
  } else {
    // Crear nuevo comité
    const newComite: Comite = {
      id: Date.now().toString(),
      nombre: comiteForm.nombre,
    }
    comites.value.push(newComite)
  }
  comiteDialogOpen.value = false
}

// Funciones para manejar núcleos
const handleAddNucleo = (comiteId: string) => {
  isEditing.value = false
  nucleoForm.id = ''
  nucleoForm.nombre = ''
  nucleoForm.secretarioGeneral = ''
  nucleoForm.secretarioFuncionamiento = ''
  nucleoForm.militantes = 0
  nucleoForm.comiteId = comiteId

  selectedComite.value = comites.value.find(c => c.id === comiteId) || null
  nucleoDialogOpen.value = true
  activeComiteDropdown.value = null
}

const handleAddNucleoGeneral = () => {
  isEditing.value = false
  nucleoForm.id = ''
  nucleoForm.nombre = ''
  nucleoForm.secretarioGeneral = ''
  nucleoForm.secretarioFuncionamiento = ''
  nucleoForm.militantes = 0
  nucleoForm.comiteId = ''

  selectedComite.value = null
  nucleoDialogOpen.value = true
}

const handleEditNucleo = (nucleo: Nucleo) => {
  isEditing.value = true
  nucleoForm.id = nucleo.id
  nucleoForm.nombre = nucleo.nombre
  nucleoForm.secretarioGeneral = nucleo.secretarioGeneral
  nucleoForm.secretarioFuncionamiento = nucleo.secretarioFuncionamiento
  nucleoForm.militantes = nucleo.militantes
  nucleoForm.comiteId = nucleo.comiteId

  selectedComite.value = comites.value.find(c => c.id === nucleo.comiteId) || null
  nucleoDialogOpen.value = true
  activeNucleoDropdown.value = null
}

const handleDeleteNucleo = (nucleoId: string) => {
  cores.value = cores.value.filter(nucleo => nucleo.id !== nucleoId)
  activeNucleoDropdown.value = null
}

const saveNucleo = () => {
  if (isEditing.value && nucleoForm.id) {
    // Actualizar núcleo existente
    const index = cores.value.findIndex(n => n.id === nucleoForm.id)
    if (index !== -1) {
      cores.value[index] = { ...nucleoForm }
    }
  } else {
    // Crear nuevo núcleo
    const newNucleo: Nucleo = {
      id: Date.now().toString(),
      nombre: nucleoForm.nombre,
      secretarioGeneral: nucleoForm.secretarioGeneral,
      secretarioFuncionamiento: nucleoForm.secretarioFuncionamiento,
      militantes: nucleoForm.militantes,
      comiteId: selectedComite.value ? selectedComite.value.id : nucleoForm.comiteId,
    }
    cores.value.push(newNucleo)
  }
  nucleoDialogOpen.value = false
  selectedComite.value = null
}
</script>