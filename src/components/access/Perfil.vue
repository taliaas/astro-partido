<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Banner -->
    <div class="max-w-4xl mx-auto mt-5 text-foreground p-8">
      <div class="max-w-4xl mx-auto flex items-center gap-6">
        <div class="h-24 w-24 rounded-full bg-blue-700 flex items-center justify-center ring-4 ring-blue-600">
          <UserIcon class="h-12 w-12 text-white" />
        </div>
        <div>
          <h1 class="text-3xl font-bold">{{ user.name }}</h1>
          <div class="flex items-center gap-2 mt-2 text-gray-300">
            <ShieldCheckIcon class="h-4 w-4" />
            <span class="text-lg text-foreground">{{ user.role?.name || "Militante" }}</span>
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
                <Input v-model="user.name" type="text"
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Correo</label>
                <Input v-model="user.email" type="email"
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <!-- Nucleo -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Núcleo</label>
                <Input v-model="user.core.name" type="text" readonly
                  class="mt-1 block w-full rounded border-gray-300 shadow-sm bg-gray-50" />
              </div>
              <!-- Role (Read-only) -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Rol</label>
                <Input type="text" v-model="user.role.name" readonly class="mt-1 block w-full rounded border-gray-300 bg-gray-50 shadow-sm" />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 border-t my-5">
              <button type="button" @click="openChangePasswordModal"
                class="inline-flex m-2 items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <LockIcon class="w-4 h-4 mr-2" />
                Cambiar contraseña
              </button>
              <button type="submit"
                class="inline-flex m-2 items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <SaveIcon class="w-4 h-4 mr-2" />
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Change Password -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Cambiar contraseña
        </h3>
        <form @submit.prevent="handlePasswordChange" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Contraseña actual</label>
            <Input v-model="passwordForm.current" type="password"
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nueva contraseña</label>
            <Input v-model="passwordForm.new" type="password"
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Confirmar nueva contraseña</label>
            <Input v-model="passwordForm.confirm" type="password"
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div class="flex justify-end space-x-3">
            <button @click="showPasswordModal = false"
              class="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit"
              class="px-4 py-2 mr-4 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { actions } from "astro:actions";
import { LockIcon, SaveIcon, ShieldCheckIcon, UserIcon } from "lucide-vue-next";
import { reactive, ref } from "vue";
import Input from "../ui/input/Input.vue";

const { user } = defineProps<{ user: any }>();

const showPasswordModal = ref(false);
const message = ref("");
const openChangePasswordModal = () => {
  console.log(user)
  showPasswordModal.value = true;
};

// Password form
const passwordForm = reactive({
  current: "",
  new: "",
  confirm: "",
});

const handleSubmit = async () => {
  const name = user.name;
  const email = user.email;
  try {
    await actions.auth.updateProfile({
      name,
      email,
    })
  } catch (error) {
    console.log(error);
  }
};

const handlePasswordChange = async () => {
  if (passwordForm.new !== passwordForm.confirm) {
    message.value = "La nueva contraseña no coincide";
    return;
  }
  try {
    await actions.auth.updatePassword({ prev_pw: passwordForm.current, new_pw: passwordForm.new })
    showPasswordModal.value = false;
    passwordForm.current = "";
    passwordForm.new = "";
    passwordForm.confirm = "";
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};
</script>
