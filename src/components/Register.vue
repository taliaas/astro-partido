<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-lg space-y-6 p-8 bg-white rounded shadow-2xl">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h2 class="text-2xl font-bold tracking-tight">Crear una cuenta</h2>
        <p class="text-sm text-muted-foreground">Ingresa tus datos para registrarte</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Nombre -->
        <div class="space-y-1">
          <label
            for="name"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Nombre
          </label>
          <Input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
            placeholder="Juan Pérez"
          />
        </div>

        <!-- Email -->
        <div class="space-y-1">
          <label
            for="email"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Correo electrónico
          </label>
          <Input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
            placeholder="juan@cujae.edu.cu"
          />
        </div>

        <!-- Password -->
        <div class="space-y-1">
          <label
            for="password"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Contraseña
          </label>
          <div class="relative">
            <Input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              <component :is="showPassword ? 'EyeOffIcon' : 'EyeIcon'" class="h-4 w-4" />
            </button>
          </div>
        </div>
        <!-- Terms -->
        <div class="flex items-center space-x-2">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label for="terms" class="text-sm text-gray-600">
            Acepto los
            <a href="#" class="text-primary hover:text-blue-500 hover:underline"
              >términos y condiciones</a
            >
          </label>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          :disabled="isLoading"
        >
          <Loader2Icon v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          {{ isLoading ? "Registrando..." : "Registrarse" }}
        </Button>

        <!-- Sign In Link -->
        <div class="text-center text-sm">
          ¿Ya tienes una cuenta?
          <a href="/login" class="text-primary hover:text-blue-500 hover:underline">
            Inicia sesión
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Button from "./ui/button/Button.vue";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-vue-next";

const isLoading = ref(false);
const showPassword = ref(false);

const form = reactive({
  name: "",
  email: "",
  password: "",
  acceptTerms: false,
});

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    // Aquí iría la lógica de registro
    console.log("Form submitted:", form);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulación de registro
  } catch (error) {
    console.error("Registration error:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
