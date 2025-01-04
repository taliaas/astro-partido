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
      <div v-if="activeTab === 'usuarios'" class="space-y-6">
        <div class="flex justify-between">
          <h2 class="text-2xl font-semibold">Usuarios del Sistema</h2>
          <button @click="activeUser = true"
                  class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ease-in-out"
          >
            <UserPlusIcon class="inline-block mr-2"/>
            Agregar
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
            <tr class="border-b text-gray-700 font-normal bg-gray-100">
              <th class="py-2 px-4 text-left">Nombre</th>
              <th class="py-2 px-4 text-center">Correo</th>
              <th class="py-2 px-4 text-center">Rol</th>
              <th class="py-2 px-4 text-center">Estado</th>
              <th class="py-2 px-4 text-center">Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b hover:bg-gray-50">
              <td class="py-2 px-4 text-left">{{ user.name }}</td>
              <td class="py-2 px-4 text-center">{{ user.email }}</td>
              <td class="px-4 py-2 text-center whitespace-nowrap">
                  <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                  >
                    {{ user.rol }}
                  </span>
              </td>
              <td class="px-6 py-4 text-center whitespace-nowrap">
                  <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                  >
                    Activo
                  </span>
              </td>
              <td class="py-2 px-4 text-center">
                <button @click="handleAction('delete',user.id)" class="text-red-600 hover:text-red-800">
                  <TrashIcon class="h-5 w-5"/>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
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

      <div v-if="activeUser">
        <div>

        </div>
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
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Bell, CogIcon, FileTextIcon, ShieldIcon, TrashIcon, UserPlusIcon, UsersIcon,} from "lucide-vue-next";
import {ref} from "vue";
import UserService from "../../services/UserService.ts";
import {Button} from "@/components/ui/button";
import {navigate} from "astro:transitions/client";

const {users} = defineProps<{ users: any[] }>()

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


const handleDelete = () => {
  showDelete.value = false
}

const handleAction = (action, user) => {
  if (action === "eliminar") {
    showDelete.value = true
  } else if (action === 'editar') {
    navigate(`/edit/${user}`)
  }
}

async function deleteUser(id: number) {
  const service = new UserService();
  try {
    await service.removeUser(id);
    showDelete.value = false
  } catch (e) {
    console.error(e)
  }
}
</script>
