<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-lg space-y-8 p-10 bg-white rounded-md shadow-2xl">
      <div class="flex items-center justify-center h-28">
        <UserIcon
          class="w-28 h-full mr-2 bg-blue-600 border border-blue-400 text-white p-6 rounded-full"
        />
      </div>
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Bienvenido de nuevo
        </h2>
        <p class="mt-2 text-xl text-gray-600">Inicia sesión en tu cuenta</p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="email" class="sr-only">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded text-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 md:text-md"
              placeholder="Correo electrónico"
              v-model="email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              maxlength="8"
              class="appearance-none rounded text-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 md:text-md"
              placeholder="Contraseña"
              v-model="password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-md text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Recuérdame
            </label>
          </div>

          <div class="text-sm">
            <a
              href="/password"
              class="font-medium text-md text-blue-600 hover:text-blue-500"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative text-lg w-full flex justify-center py-2 px-4 border border-transparent font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Iniciar sesión
          </button>
        </div>
      </form>

      <div v-if="showSuccessMessage">
        {{ mensaje }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { navigate } from "astro:transitions/client";
import { UserIcon } from "lucide-vue-next";
import { actions } from "astro:actions";

const email = ref("");
const password = ref("");
const showSuccessMessage = ref(false);
const mensaje = ref("");

const handleSubmit = async () => {
  try {
    await actions.login({ email: email.value, password: password.value });
    await navigate("/home/");
  } catch (error) {
    showSuccessMessage.value = true;
    mensaje.value = "Error";
    console.log("Error", error);
  } finally {
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  }
};
</script>
