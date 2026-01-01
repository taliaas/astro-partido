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
import { ActionError, actions } from "astro:actions";
import { z } from "zod";
import { navigate } from "astro:transitions/client";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { roleEnum } from "@/enum/roleEnum";
import type { Militant, User } from "@/interface/Militante";

const { onLoadingChange, user } = defineProps<{
  onLoadingChange: (value: boolean) => void;
  user: User | null;
  militants: Militant[];
}>();

type UserData = z.infer<typeof userSchema>;
const userSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres." }),
  email: z.string().email({ message: "Ingresa un correo electrónico válido." }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 carácteres" })
    .max(16, { message: "La contraseña debe tener menos de 16 carácteres" })
    .nullable(),
  role: z.string({ message: "El Rol es requerido" }),
});

const form = useForm<UserData>({
  initialValues: {
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: null,
    role: user?.role?.name ?? "",
  },
  validationSchema: toTypedSchema(userSchema),
});

const handleSubmit = form.handleSubmit(async (data: UserData) => {
  onLoadingChange(true);
  if (user) {
    const { error } = await actions.user.updateUser({ ...data, id: user.id });
    if (error instanceof ActionError) {
      toast.error("Hubo un error al intentar actualizar el usuario");
    } else {
      await navigate("");
      setTimeout(() => toast.success("Usuario actualizado exitosamente"), 1000);
    }
  } else {
    const { error } = await actions.auth.register({
      ...data,
      password: data.password ?? undefined,
    });
    if (error instanceof ActionError) {
      toast.error("Hubo un error al intentar crear el usuario");
    } else {
      await navigate("");
      setTimeout(() => toast.success("Usuario creado exitosamente"), 1000);
    }
  }

  onLoadingChange(false);
});
</script>

<template>
  {{ form.errors }}
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
        <FormLabel class="col-span-1"> Correo:</FormLabel>
        <FormControl>
          <Select :="componentField">
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el correo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="item of militants" :value="item.email">{{
                item.email
              }}</SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage class="col-start-2 col-span-2" />
      </FormItem>
    </FormField>
    <FormField v-if="!user" name="password" v-slot="{ componentField }">
      <FormItem class="grid-cols-3">
        <FormLabel class="col-span-1"> Contraseña:</FormLabel>
        <FormControl>
          <Input
            type="password"
            class="col-span-2"
            :="componentField"
            placeholder="********"
            maxlength="16"
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
