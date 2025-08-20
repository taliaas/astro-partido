<template>
  <div class="flex-1 w-full flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-lg space-y-6 p-8 bg-white rounded shadow-2xl">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h2 class="text-2xl font-bold tracking-tight">Crear una cuenta</h2>
        <p class="text-sm text-muted-foreground">
          Ingresa tus datos para registrarte
        </p>
      </div>

      <!-- Form -->
      <form @submit="handleSubmit" class="space-y-4">
        <!-- Nombre -->
        <FormField name="name" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input
                type="text"
                required
                placeholder="Juan"
                :="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Email -->
        <FormField name="email" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Correo electrónico</FormLabel>
            <FormControl>
              <Input
                type="email"
                required
                placeholder="juan@cujae.edu.cu"
                :="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Password -->
        <FormField name="password" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Contraseña</FormLabel>
            <FormControl>
              <Input
                type="password"
                required
                placeholder="Escriba su contraseña..."
                :="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Confirm Password -->
        <FormField name="confirmPassword" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Confirme su contraseña</FormLabel>
            <FormControl>
              <Input
                type="password"
                required
                placeholder="Escriba su contraseña..."
                :="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Terms -->
        <FormField name="acceptTerms" v-slot="{ handleChange, value }">
          <FormItem class="flex items-center gap-2 space-y-0">
            <FormControl>
              <Checkbox
                :model-value="value"
                @update:model-value="handleChange"
              />
            </FormControl>
            <FormDescription>
              Acepto los
              <a
                href="/condition"
                class="text-primary hover:text-blue-500 hover:underline"
              >
                términos y condiciones
              </a>
            </FormDescription>
          </FormItem>
        </FormField>
        <!-- Submit Button -->
        <Button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          :disabled="isLoading || !formState.valid"
        >
          <Loader2Icon v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          {{ isLoading ? "Registrando..." : "Registrarse" }}
        </Button>

        <!-- Sign In Link -->
        <div class="text-center text-sm">
          ¿Ya tienes una cuenta?
          <a
            href="/login"
            class="text-primary hover:text-blue-500 hover:underline"
          >
            Inicia sesión
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toTypedSchema } from "@vee-validate/zod";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { signIn } from "auth-astro/client";
import { Loader2Icon } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { onBeforeUnmount, ref } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const { acceptTerms } = defineProps<{
  acceptTerms: boolean;
}>();

const isLoading = ref(false);

type RegisterData = z.infer<typeof schema>;
const schema = z
  .object({
    name: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
      .max(50, { message: "El nombre no puede exceder los 50 caracteres." }),
    email: z
      .string()
      .email({ message: "Ingresa un correo electrónico válido." }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val, {
      message: "Debes aceptar los términos y condiciones.",
    }),
  })
  .superRefine(({ acceptTerms, password, confirmPassword }, ctx) => {
    if (!acceptTerms) {
      ctx.addIssue({
        code: "custom",
        path: ["acceptTerms"],
      });
    }
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas deben coincidir",
        path: ["confirmPassword"],
      });
    }
  });

const form = useForm<RegisterData>({
  validationSchema: toTypedSchema(schema),
  initialValues: () => {
    let initialValues = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms,
    };
    const formValues = localStorage.getItem("register-form");
    if (formValues) {
      initialValues = JSON.parse(formValues || "{}");
    }
    if (acceptTerms) {
      initialValues.acceptTerms = true;
    }
    return initialValues;
  },
  keepValuesOnUnmount: true,
});
const formValues = form.controlledValues;

onBeforeUnmount(() =>
  localStorage.setItem("register-form", JSON.stringify(formValues.value))
);

const formState = form.meta;

const handleSubmit = form.handleSubmit(async (data: RegisterData) => {
  isLoading.value = true;
  try {
    await actions.auth.register.orThrow(data);
    toast.success("Usuario registrado con éxito")
    await signIn("credentials", data as any);
    await navigate("/home");
    localStorage.removeItem("register-form");
  } catch (error) {
    console.error("Registration error:", error.message);
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
});
</script>
