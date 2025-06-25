<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <div class="text-center space-y-2 mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">¿Olvidaste tu contraseña?</h1>
        <p class="text-gray-600 text-sm">
          Ingresa tu correo electrónico para recuperar tu cuenta
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input id="email" v-model="email" type="email" required
            class="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="nombre@cujae.edu.cu" />
        </div>

        <button type="submit" :disabled="isLoading"
          class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoading ? "Enviando..." : "Enviar instrucciones" }}
        </button>

        <div class="text-center">
          <a href="/login" class="text-sm text-blue-600 hover:text-blue-500 font-medium">
            Volver al inicio de sesión
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { actions } from "astro:actions";
import { ref } from "vue";
import { toast } from "vue-sonner";

const email = ref("");
const isLoading = ref(false);
const success = ref(false);

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    await actions.auth.recoverPassword({ email: email.value });
    success.value = true;
    toast.success("Se han enviado las instrucciones a tu correo electrónico");
    email.value = "";
  } catch (error) {
    success.value = false;
    toast.error("Ha ocurrido un error. Por favor intenta nuevamente");
  } finally {
    isLoading.value = false;
  }
};
</script>
