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
          <label for="name"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Nombre
          </label>
          <Input id="name" v-model="form.name" type="text" required
            class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder:text-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
            placeholder="Juan" />
          <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div class="space-y-1">
          <label for="email"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Correo electrónico
          </label>
          <Input id="email" v-model="form.email" type="email" required
            class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder:text-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
            placeholder="juan@cujae.edu.cu" />
          <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div class="space-y-1">
          <label for="password"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Contraseña
          </label>
          <div class="relative">
            <Input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required
              maxlength="16"
              class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder:text-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
              placeholder="••••••••" />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700">
              <component :is="showPassword ? 'EyeOffIcon' : 'EyeIcon'" class="h-4 w-4" />
            </button>
          </div>
          <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
        </div>
        <!-- Terms -->
        <div class="flex items-center space-x-2">
          <input id="terms" v-model="form.acceptTerms" type="checkbox" required
            class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <label for="terms" class="text-sm text-gray-600">
            Acepto los
            <a href="/condition" class="text-primary hover:text-blue-500 hover:underline">términos y condiciones</a>
          </label>
        </div>
        <p v-if="errors.acceptTerms" class="text-sm text-red-500">{{ errors.acceptTerms }}</p>

        <!-- Submit Button -->
        <Button type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          :disabled="isLoading">
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

<script setup lang="ts">
import { actions } from "astro:actions";
import { signIn } from "auth-astro/client";
import { Loader2Icon } from "lucide-vue-next";
import { reactive, ref } from "vue";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const isLoading = ref(false);
const showPassword = ref(false);
let errors = reactive<Record<string, string>>({});

const schema = z.object({
  name: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres." }),
  email: z.string()
    .email({ message: "Ingresa un correo electrónico válido." }),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .max(16, { message: "La contraseña no puede exceder los 16 caracteres." })
    .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula." })
    .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número." }),
  acceptTerms: z.boolean()
    .refine((val) => val, { message: "Debes aceptar los términos y condiciones." }),
});

const form = reactive({
  name: "",
  email: "",
  password: "",
  acceptTerms: false,
});

const handleSubmit = async () => {
  isLoading.value = true;

  try {
    errors = {};
    schema.parse(form);
    await actions.auth.register(form)
    await signIn("credentials", { email: form.email, password: form.password } as any)
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
    } else {
      console.error("Registration error:", error);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
