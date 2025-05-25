<template>
  <div class="h-full bg-gray-100 flex-1 flex justify-center items-center w-full">
    <div class="w-full max-w-lg space-y-4 p-7 bg-white rounded-md shadow-2xl">
      <div class="flex items-center justify-center h-28">
        <UserIcon class="w-28 h-full mr-2 bg-blue-600 border border-blue-400 text-white p-6 rounded-full" />
      </div>
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Bienvenido de nuevo
        </h2>
        <p class="mt-2 text-xl text-gray-600">Inicia sesión en tu cuenta</p>
      </div>
      <form class="mt-8 space-y-6" @submit="handleSubmit">
        <div class="flex flex-col gap-4">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel class="sr-only">
                Correo electrónico
              </FormLabel>
              <FormControl>
                <Input type="email" required placeholder="Correo electrónico" :="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel class="sr-only">
                Contraseña
              </FormLabel>
              <FormControl>
                <Input type="password" required placeholder="Contraseña" :="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">

            <label class="text-sm text-gray-900 flex  gap-2 items-center">
              <Checkbox name="rememberMe"
                class="h-4 w-4 text-md text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              Recuérdame
            </label>
          </div>

          <div class="text-sm">
            <a href="/password" class="font-medium text-md text-blue-600 hover:text-blue-500">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <div>
          <Button type="submit" :disabled="loading" :loading class="w-full">
            {{ loading ? "Iniciando sesión..." : "Iniciar sesión" }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toTypedSchema } from "@vee-validate/zod";
import { navigate } from "astro:transitions/client";
import { signIn } from "auth-astro/client";
import { UserIcon } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";

type UserData = z.infer<typeof userSchema>
const userSchema = z.object({
  email: z.string().email({ message: "Ingrese un correo electrónico válido" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

const form = useForm<UserData>({
  validationSchema: toTypedSchema(userSchema),
  initialValues: {
    email: "",
    password: ""
  },

})

const loading = ref(false);

const handleSubmit = form.handleSubmit(async (data: UserData) => {
  loading.value = true
  try {
    await signIn("credentials", { email: data.email, password: data.password })
    toast.success("Sesión iniciado con éxito")
    navigate("/home")
  } catch (error) {
    console.error("Error", error);
    toast.error("Ha ocurrido un error al iniciar sesión")
    loading.value = false
  }
})
</script>
