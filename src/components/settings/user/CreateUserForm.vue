<script setup lang="ts">
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toTypedSchema } from "@vee-validate/zod";
import { actions } from "astro:actions";
import { z } from "zod";
import { navigate } from "astro:transitions/client";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { ActionError } from "astro/actions/runtime/virtual/shared";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  core?: any;
}

const { onLoadingChange, user } = defineProps<{
  onLoadingChange: (value: boolean) => void;
  user: User | null;
}>();

console.log(user);

const roleEnum = [
  "Administrador",
  "Secretario del Funcionamiento",
  "Secretario General del núcleo",
  "Secretario político e ideológico",
  "Miembro del Comite CUJAE",
  "Militante",
];

const passwordSchema = user
  ? z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
      .or(z.string().length(0))
  : z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres." });

type UserData = z.infer<typeof userSchema>;
const userSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres." }),
  email: z.string().email({ message: "Ingresa un correo electrónico válido." }),
  password: passwordSchema,
  role: z.string({ message: "El Rol es requerido" }),
});

const form = useForm<UserData>({
  initialValues: {
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    role: user?.role.name ?? "",
  },
  validationSchema: toTypedSchema(userSchema),
});

const handleSubmit = form.handleSubmit(async (data: UserData) => {
  onLoadingChange(true);
  const { error } = await actions.auth.register(data);
  if (error instanceof ActionError) {
    toast.error(error.message);
  } else {
    await navigate("");
    setTimeout(() => toast.success("Usuario creado exitosamente"), 1000);
  }
  onLoadingChange(false);
});
</script>

<template>
  <form
    @submit="handleSubmit"
    class="space-y-4"
    id="create-user"
    autocomplete="off"
  >
    <FormField name="name" v-slot="{ componentField }">
      <FormItem class="grid-cols-3">
        <FormLabel class="col-span-1"> Nombre:</FormLabel>
        <FormControl>
          <Input class="col-span-2" placeholder="Nombre" :="componentField" />
        </FormControl>
        <FormMessage class="col-start-2 col-span-2" />
      </FormItem>
    </FormField>
    <FormField name="email" v-slot="{ componentField }">
      <FormItem class="grid-cols-3">
        <FormLabel class="col-span-1"> Email:</FormLabel>
        <FormControl>
          <Input
            type="email"
            class="col-span-2"
            placeholder="correo@ejemplo.com"
            :="componentField"
          />
        </FormControl>
        <FormMessage class="col-start-2 col-span-2" />
      </FormItem>
    </FormField>
    <FormField name="password" v-slot="{ componentField }">
      <FormItem class="grid-cols-3">
        <FormLabel class="col-span-1"> Contraseña:</FormLabel>
        <FormControl>
          <Input
            type="password"
            class="col-span-2"
            placeholder="********"
            :="componentField"
          />
        </FormControl>
        <FormMessage class="col-start-2 col-span-2" />
      </FormItem>
    </FormField>
    <FormField name="role" v-slot="{ componentField }">
      <FormItem class="grid grid-cols-3">
        <FormLabel class="col-span-1"> Rol:</FormLabel>
        <Select :="componentField">
          <FormControl>
            <SelectTrigger class="col-span-2 w-full">
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem v-for="role in roleEnum" :value="role"
              >{{ role }}
            </SelectItem>
          </SelectContent>
        </Select>
        <FormMessage class="col-start-2 col-span-2" />
      </FormItem>
    </FormField>
  </form>
</template>
