<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-8">
      <div class="max-w-4xl mx-auto flex items-center gap-6">
        <div
          class="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center ring-4 ring-gray-600"
        >
          <UserIcon class="h-12 w-12 text-gray-300" />
        </div>
        <div>
          <h1 class="text-3xl font-bold">{{ user.firstName }} {{ user.lastName }}</h1>
          <div class="flex items-center gap-2 mt-2 text-gray-300">
            <ShieldCheckIcon class="h-4 w-4" />
            <span>{{ user.role || "Administrador" }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="bg-white rounded shadow">
        <!-- Form Content -->
        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- First Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre</label>
                <Input
                  v-model="formData.firstName"
                  type="text"
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <!-- Last Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Apellidos</label>
                <Input
                  v-model="formData.lastName"
                  type="text"
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Correo</label>
                <Input
                  v-model="formData.email"
                  type="email"
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Núcleo</label>
                <Input
                  v-model="formData.nucleo"
                  type="text"
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <!-- Role (Read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Role</label>
              <Input
                :value="user.role"
                type="text"
                class="mt-1 block w-full rounded border-gray-300 bg-gray-50 shadow-sm"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 border-t my-5">
              <button
                type="button"
                @click="openChangePasswordModal"
                class="inline-flex m-2 items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LockIcon class="w-4 h-4 mr-2" />
                Cambiar contraseña
              </button>
              <button
                type="submit"
                class="inline-flex m-2 items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <SaveIcon class="w-4 h-4 mr-2" />
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Change Password -->
    <div
      v-if="showPasswordModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white rounded p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Cambiar contraseña</h3>
        <form @submit.prevent="handlePasswordChange" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Contraseña actual</label
            >
            <Input
              v-model="passwordForm.current"
              type="password"
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Nueva contraseña</label
            >
            <Input
              v-model="passwordForm.new"
              type="password"
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Confirmar nueva contraseña</label
            >
            <Input
              v-model="passwordForm.confirm"
              type="password"
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showPasswordModal = false"
              class="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 mr-4 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { UserIcon, LockIcon, SaveIcon, ShieldCheckIcon } from "lucide-vue-next";
import Input from "../ui/input/Input.vue";

const showPasswordModal = ref(false);

// Mock user data
const user = reactive({
  firstName: "Juan",
  lastName: "Montes",
  email: "juan.montes@cujae.edu.cu",
  nucleo: "Independientes",
  role: "Administrador",
});

// Form data
const formData = reactive({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  nucleo: user.nucleo,
});

// Password form
const passwordForm = reactive({
  current: "",
  new: "",
  confirm: "",
});

// Handlers
const handleSubmit = () => {
  // Update user data
  Object.assign(user, formData);
  alert("Profile updated successfully!");
};

const handlePasswordChange = () => {
  if (passwordForm.new !== passwordForm.confirm) {
    alert("New passwords do not match!");
    return;
  }
  // Handle password change logic here
  alert("Password updated successfully!");
  showPasswordModal.value = false;
  passwordForm.current = "";
  passwordForm.new = "";
  passwordForm.confirm = "";
};

const openChangePasswordModal = () => {
  showPasswordModal.value = true;
};
</script>
