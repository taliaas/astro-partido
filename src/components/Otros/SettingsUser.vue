<template>
  <div class="min-h-screen bg-gray-50">
    <div
        class="mx-auto bg-gradient-to-r from-blue-400 to-blue-800 h-48 relative"
    >
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="absolute bottom-0 left-0 right-0 bg-white">
          <div class="max-w-7xl mx-auto px-4 flex space-x-8">
            <button
                v-for="tab in menuItems"
                :key="tab.id"
                @click="activeTab = tab.id"
                class="px-4 py-4 w-full text-md font-medium transition-colors duration-200 -mb-px"
                :class="
                activeTab === tab.id
                  ? 'border-blue-800 border-b-2 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              "
            >
              {{ tab.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-4 mt-6 bg-white shadow-md rounded">
      <!-- Usuarios del sistema -->
      <div v-if="activeTab === 'usuarios'" class="space-y-6 p-4">
        <div class="flex justify-between p-6">
          <h2 class="text-2xl font-medium text-gray-700 ">Usuarios del Sistema</h2>
          <button @click="activeUser = true"
                  class="px-4 py-2 mr-4 bg-blue-600 flex gap-2 text-white rounded text-md font-medium hover:bg-blue-700"
          >
            <PlusIcon class="inline-block mr-2"/>
            Usuario
          </button>
        </div>
        <div class="overflow-x-auto">
          <Table class="p-2 border">
            <TableHeader
                class="px-6 py-3 text-left rounded border font-medium text-gray-500 uppercase tracking-wider"
            >
              <TableRow>
                <th
                    v-for="header in tableHeaders"
                    :key="header"
                    class="px-6 py-3 text-left text-xs bg-gray-100 font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ header }}
                </th>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                  v-for="(user, index) in users"
                  :key="user.id"
                  class="hover:bg-gray-50/50 text-lg transition-colors duration-200"
              >
                <TableCell class="font-medium pl-8">{{ index + 1 }}</TableCell>
                <TableCell class="pl-6">{{ user.name }}</TableCell>
                <TableCell class="text-left">{{ user.email }}</TableCell>
                <TableCell class="text-left">{{ user.rol }}</TableCell>
                <TableCell class="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger class="focus:outline-none">
                      <Button
                          variant="ghost"
                          size="icon"
                          class="rounded-full"
                      >
                        <MoreVerticalIcon class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="handleAction('editar', user)">
                        <Pencil class="h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                          @click="handleAction('eliminar', user)"
                          class="text-red-600 border-t focus:text-red-600"
                      >
                        <TrashIcon class="h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <!-- Configuraciones generales -->
      <div v-if="activeTab === 'general'" class="space-y-6 px-5 m-4">
        <h2 class="text-2xl font-semibold">Configuraciones Generales</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
            >Nombre del Sistema</label
            >
            <input
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
            >Logo del Sistema</label
            >
            <input type="file" class="mt-1 block w-full"/>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
            >Tema del Sistema</label
            >
            <select
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Claro</option>
              <option>Oscuro</option>
            </select>
          </div>
          <h2>Notificaciones</h2>
          <button class="text-red-600 hover:text-red-800">
            <Bell class="h-5 w-5"/>
          </button>
        </div>
        <button
            class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ease-in-out"
        >
          Guardar Cambios
        </button>
      </div>

      <!-- Permisos y roles -->
      <div v-if="activeTab === 'permisos'" class="space-y-6">
        <h2 class="text-2xl font-semibold">Permisos y Roles</h2>
        <div class="w-3/4 space-y-4">
          <div v-for="role in roles" :key="role.id" class="border p-4 rounded">
            <h3 class="font-semibold text-lg mb-2">{{ role.name }}</h3>
            <div class="space-y-2">
              <div
                  v-for="permission in role.permissions"
                  :key="permission.id"
                  class="flex items-center"
              >
                <input
                    type="checkbox"
                    :id="permission.id"
                    :checked="permission.granted"
                    class="rounded text-blue-600 focus:ring-blue-500"
                />
                <label :for="permission.id" class="ml-2">{{ permission.name }}</label>
              </div>
            </div>
          </div>
        </div>
        <button
            class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ease-in-out"
        >
          Actualizar Permisos
        </button>
      </div>

      <!-- Configuración de documentos -->
      <div v-if="activeTab === 'documentos'" class="space-y-6 px-5 m-4">
        <h2 class="text-2xl font-semibold">Configuración de Documentos</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
            >Tipos de Documentos Permitidos</label
            >
            <input
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="pdf, doc, docx, xls, xlsx"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
            >Tamaño Máximo de Archivo (MB)</label
            >
            <input
                type="number"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
            >Política de Retención de Documentos</label
            >
            <textarea
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows="4"
            ></textarea>
          </div>
        </div>
        <button
            class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ease-in-out"
        >
          Guardar Configuración
        </button>
      </div>
    </div>
    <div
      v-if="activeUser"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded p-6 w-full max-w-md">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Agregar usuario</h3>
      <form @submit.prevent="handleCreate" class="space-y-4 p-4">
        <div class="space-y-1">
          <Input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="appearance-none rounded relative my-2 block w-full px-3 py-2 border border-gray-300 placeholder:text-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="Nombre"
          />
          <Input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="appearance-none rounded relative my-2 block w-full px-3 py-2 border border-gray-300 placeholder:text-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="Correo"
          />
          <Input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              maxlength="8"
              class="appearance-none rounded relative my-2 block w-full px-3 py-2 border border-gray-300 placeholder:text-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="••••••••"
          />
        </div>
        <div class="flex justify-end space-x-3">
          <button
              @click="activeUser = false"
              type="button"
              class="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
              class="px-4 py-2 mr-4 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
              @click="createUser"
          >
            Aceptar
          </button>
        </div>
      </form>
    </div>
  </div>
    <div
        v-if="showDelete"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white rounded p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Eliminar</h3>
        <form @submit.prevent="handleDelete" class="space-y-4 p-4">
          <div>
            ¿Estás seguro que desea eliminar el usuario?
          </div>
          <div class="flex justify-end space-x-3">
            <button
                type="submit"
                class="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
                class="px-4 py-2 mr-4 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
                @click="deleteUser"
            >
              Aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Notification -->
    <div
        v-if="notification.show"
        class="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300"
        :class="notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Bell,
  CogIcon,
  FileTextIcon,
  ShieldIcon,
  TrashIcon,
  PlusIcon,
  UsersIcon,
  MoreVerticalIcon, Pencil, Edit, ArrowUp, ArrowDown, Download, Eye,
} from "lucide-vue-next";
import {reactive, ref} from "vue";
import UserService from "../../services/UserService.ts";
import {Button} from "@/components/ui/button";
import {navigate} from "astro:transitions/client";
import {Input} from "@/components/ui/input";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";

const currentsUser = ref(null);
const {users} = defineProps<{ users: any[] }>()
const notification = reactive({
  show: false,
  message: '',
  type: 'success'
})
const activeTab = ref("usuarios");
const activeUser = ref(false)

const roles = [
  {
    id: 1,
    name: "Secretaria",
    permissions: [
      {id: "create_doc", name: "Crear Documento", granted: true},
      {id: "edit_doc", name: "Editar Documento", granted: true},
      {id: "delete_doc", name: "Eliminar Documento", granted: false},
      {id: "gest_user", name: "Gestionar Usuarios", granted: true},
    ],
  },
  {
    id: 2,
    name: "Jefe de núcleo",
    permissions: [
      {id: "create_doc", name: "Crear Documento", granted: true},
      {id: "edit_doc", name: "Editar Documento", granted: true},
      {id: "delete_doc", name: "Eliminar Documento", granted: false},
    ],
  },
  {
    id: 3,
    name: "Militante",
    permissions: [
      {id: "view_doc", name: "Leer Documento", granted: true},
      {id: "create_doc", name: "Crear Documento", granted: false},
      {id: "edit_doc", name: "Editar Documento", granted: false},
      {id: "delete_doc", name: "Eliminar Documento", granted: false},
    ],
  },
];

const menuItems = [
  {id: "usuarios", name: "Usuarios", icon: UsersIcon},
  {id: "general", name: "General", icon: CogIcon},
  {id: "permisos", name: "Permisos", icon: ShieldIcon},
  {id: "documentos", name: "Documentos", icon: FileTextIcon},
];

const showDelete = ref(false)

const tableHeaders = [
    'No.',
  'Nombre',
  'Correo',
  'Rol',
  '',
]
const handleDelete = () => {
  showDelete.value = false
}

const handleCreate = () => {
  activeUser.value = false
}
const form = reactive({
  name: "",
  email: "",
  password: ""
});

async function createUser(){
  const service = new AuthService()
  try{
    await service.register( form.email, form.name, form.password)
  }
  catch (e) {
    console.error("Registration error:",e)
  }
}

const showNotification = (message, type = 'success') => {
  notification.show = true
  notification.message = message
  notification.type = type
  setTimeout(() => {
    notification.show = false
  }, 3000)
}
const handleAction = (action, user) => {
  console.log(user)
  currentsUser.value = user;
  if (action === "eliminar") {
    showDelete.value = true
  }
}

async function deleteUser() {
  const user = currentsUser.value;
  const id = user.id
  console.log(id)
  const service = new UserService();
  try {
    await service.removeUser(id);
    showNotification('Se eliminó correctamente el usuario')
    showDelete.value = false
  } catch (e) {
    showNotification('Error al eliminar el usuario', e)
    console.error(e)
  }
}
</script>
