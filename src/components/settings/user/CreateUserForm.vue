<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Role } from "@/interface/Roles.ts";
import { toTypedSchema } from "@vee-validate/zod";
import { actions } from "astro:actions";
import { z } from "zod";
import { navigate } from "astro:transitions/client";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
const { onLoadingChange } = defineProps<{
  onLoadingChange: (value: boolean) => void,
  roles: Role[]
}>()

type UserData = z.infer<typeof userSchema>
const userSchema = z.object({
  name: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres." }),
  email: z.string()
    .email({ message: "Ingresa un correo electrónico válido." }),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
  role: z.string({ message: "El Rol es requerido" }),
})

const form = useForm<UserData>({
  initialValues: {
    name: "",
    email: "",
    password: "",
    role: null as any,
  },
  validationSchema: toTypedSchema(userSchema)
})


const handleSubmit = form.handleSubmit(async (data: UserData) => {
  onLoadingChange(true)
  try {
    await actions.auth.register.orThrow(data);
    await navigate("")
    setTimeout(() => toast.success("Usuario creado exitosamente"), 1000)
  } catch (e) {
    toast.error("Ha ocurrido un error al crear el usuario")
    console.log(e);
  } finally {
    onLoadingChange(false)
  }
})
</script>

<template>
  <form @submit="handleSubmit" class="space-y-4" id="create-user" autocomplete="off">
    <FormField name="name" v-slot="{ componentField }">
      <FormItem class="grid-cols-3">
        <FormLabel class="col-span-1">
          Nombre:
        </FormLabel>
        <FormControl>
          <Input class="col-span-2" placeholder="Nombre" :="componentField" />
        </FormControl>
        <FormMessage class="col-start-2 col-span-2" />
      </FormItem>
    </FormField>
    <FormField name="email" v-slot="{ componentField }">
      <FormItem class="grid-cols-3">
        <FormLabel class="col-span-1">
          Email:
        </FormLabel>
        <FormControl>
          <Input type="email" class="col-span-2" placeholder="correo@ejemplo.com" :="componentField" />
        </FormControl>
        <FormMessage class="col-start-2 col-span-2" />
      </FormItem>
    </FormField>
    <FormField name="password" v-slot="{ componentField }">
      <FormItem class="grid-cols-3">
        <FormLabel class="col-span-1">
          Contraseña:
        </FormLabel>
        <FormControl>
          <Input type="password" class="col-span-2" placeholder="correo@ejemplo.com" :="componentField" />
        </FormControl>
        <FormMessage class="col-start-2 col-span-2" />
      </FormItem>
    </FormField>
    <FormField name="role" v-slot="{ componentField }">
      <FormItem class="grid grid-cols-3">
        <FormLabel class="col-span-1">
          Rol:
        </FormLabel>
        <Select :="componentField">
          <FormControl>
            <SelectTrigger class="col-span-2 w-full">
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem v-for="role in roles" :value="role.name">{{
              role.name
            }}</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage class="col-start-2 col-span-2" />
      </FormItem>
    </FormField>
  </form>
</template>