<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Banner -->
    <div
      class="max-w-6xl mx-auto mt-2 rounded bg-gradient-to-r from-blue-400 to-blue-800 text-white p-8"
    >
      <div class="max-w-4xl mx-auto flex items-center gap-6">
        <div
          class="h-24 w-24 rounded-full bg-blue-700 flex items-center justify-center ring-4 ring-blue-600"
        >
          <UserIcon class="h-12 w-12 text-gray-300" />
        </div>
        <div>
          <h1 class="text-3xl font-bold">{{ user.name }}</h1>
          <div class="flex items-center gap-2 mt-2 text-gray-300">
            <ShieldCheckIcon class="h-4 w-4" />
            <span class="text-lg">{{ user.role || "Administrador" }}</span>
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
                  v-model="formData.name"
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

              <!-- Nucleo -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Núcleo</label>
                <Input
                  v-model="user.nucleo"
                  type="text"
                  readonly
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm bg-gray-50"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Role</label>
                <Input
                  v-model="user.role"
                  type="text"
                  readonly
                  class="mt-1 block w-full rounded border-gray-300 bg-gray-50 shadow-sm"
                />
              </div>
            </div>
            <!-- Role (Read-only) -->

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
import AuthService from "src/services/AuthService.ts";
import UserService from "src/services/UserService.ts";

const showPasswordModal = ref(false);

const openChangePasswordModal = () => {
  showPasswordModal.value = true;
};

const userData = (email) => {
  const service = new UserService();
  try {
    const user = service.getUserByEmail(email);
  } catch (error) {
    console.log(error);
  }
};

//GetUser
const user = reactive({
  id: 1,
  name: "Juan",
  email: "juan.montes@cujae.edu.cu",
  nucleo: "Independientes",
  role: "Administrador",
});

// Form data
const formData = reactive({
  name: user.name,
  email: user.email,
});

// Password form
const passwordForm = reactive({
  current: "",
  new: "",
  confirm: "",
});

const handleSubmit = () => {
  // Update user data
  const service = new UserService();
  try {
    const response = service.updateUser(id, formData);
    alert("Profile updated successfully!");
  } catch (error) {
    console.log(error);
  }
};

const handlePasswordChange = () => {
  if (passwordForm.new !== passwordForm.confirm) {
    alert("La nueva contraseña no coincide");
    return;
  }
  // Handle password change logic here
  const service = new AuthService();
  const id = user.id;
  try {
    const response = service.updatePassword(id, passwordForm.new, passwordForm.confirm);
    alert("Password updated successfully!");
    showPasswordModal.value = false;
    passwordForm.current = "";
    passwordForm.new = "";
    passwordForm.confirm = "";
  } catch (error) {
    alert("Error");
  }
};
</script>
