<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto p-4 mt-6 bg-white shadow-md rounded">
      <!-- Usuarios del sistema -->
      <div v-if="activeTab === 'usuarios'" class="space-y-6">
        <div class="flex justify-between">
          <h2 class="text-2xl font-semibold">Usuarios del Sistema</h2>
          <button
            class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ease-in-out"
          >
            <UserPlusIcon class="inline-block mr-2" />
            Agregar Usuario
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr class="border-b text-gray-700 font-normal bg-gray-100">
                <th class="py-2 px-4 text-left">Nombre</th>
                <th class="py-2 px-4 text-center">Correo</th>
                <th class="py-2 px-4 text-center">Rol</th>
                <th class="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" class="border-b hover:bg-gray-50">
                <td class="py-2 px-4 text-left">{{ user.name }}</td>
                <td class="py-2 px-4 text-center">{{ user.email }}</td>
                <td class="py-2 px-4 text-center">{{ user.role }}</td>
                <td class="py-2 px-4 text-center">
                  <button class="text-gray-600 hover:text-gray-800 mr-2">
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button class="text-red-600 hover:text-red-800">
                    <TrashIcon class="h-5 w-5" />
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
            <input type="file" class="mt-1 block w-full" />
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  UsersIcon,
  CogIcon,
  ShieldIcon,
  FileTextIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "lucide-vue-next";

const activeTab = ref("usuarios");

const users = [
  { id: 1, name: "Juan Pérez", email: "juan@cujae.edu.cu", role: "Administrador" },
  { id: 2, name: "María González", email: "maria@cujae.edu.cu", role: "Editor" },
  { id: 3, name: "Carlos Rodríguez", email: "carlos@cujae.edu.cu", role: "Lector" },
];

const roles = [
  {
    id: 1,
    name: "Secretaria",
    permissions: [
      { id: "create_doc", name: "Crear Documento", granted: true },
      { id: "edit_doc", name: "Editar Documento", granted: true },
      { id: "delete_doc", name: "Eliminar Documento", granted: false },
      { id: "gest_user", name: "Gestionar Usuarios", granted: true },
    ],
  },
  {
    id: 2,
    name: "Jefe de núcleo",
    permissions: [
      { id: "create_doc", name: "Crear Documento", granted: true },
      { id: "edit_doc", name: "Editar Documento", granted: true },
      { id: "delete_doc", name: "Eliminar Documento", granted: false },
    ],
  },
  {
    id: 3,
    name: "Militante",
    permissions: [
      { id: "view_doc", name: "Leer Documento", granted: true },
      { id: "create_doc", name: "Crear Documento", granted: false },
      { id: "edit_doc", name: "Editar Documento", granted: false },
      { id: "delete_doc", name: "Eliminar Documento", granted: false },
    ],
  },
];
</script>
