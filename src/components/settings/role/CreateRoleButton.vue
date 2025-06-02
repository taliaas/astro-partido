<template>
    <Dialog>
        <DialogTrigger>
            <Button >Añadir</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Crear Nuevo Rol
                </DialogTitle>
                <DialogDescription>
                    Complete los datos del formulario para crear un nuevo rol.
                </DialogDescription>
            </DialogHeader>
            <form id="create-rol" @submit="handleSubmit" class="space-y-4">
                <FormField name="name" v-slot="{ componentField }">
                    <FormItem>
                        <FormLabel>
                            Nombre
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="Administrador" :="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField name="description" v-slot="{ componentField }">
                    <FormItem>
                        <FormLabel>
                            Descripción
                        </FormLabel>
                        <FormControl>
                            <Textarea placeholder="Describa el rol..." :="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </form>
            <DialogFooter>
                <DialogClose>
                    <Button variant="secondary">Cancelar</Button>
                </DialogClose>
                <Button type="submit" form="create-rol" :disabled="!formState.valid || form.isSubmitting.value"
                    :loading="form.isSubmitting.value">
                    Añadir
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
<script setup lang="ts">
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { ref } from "vue";
import { navigate } from "astro:transitions/client";
import { toast } from "vue-sonner";
import { actions } from "astro:actions";

type RoleData = z.infer<typeof roleSchema>
const roleSchema = z.object({
  name: z.string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
      .max(50, { message: "El nombre no puede exceder los 50 caracteres." }),
  description: z.string()
      .min(2, { message: "La descripción debe tener al menos 2 caracteres." })
})

const form = useForm<RoleData>({
  validationSchema: toTypedSchema(roleSchema),
  initialValues: {
    name: "",
    description: ""
  }
})

const formState = form.meta

const handleSubmit = form.handleSubmit(async (data: RoleData) => {
  try {
    await actions.role.createRole.orThrow(data)
    await navigate("")
    setTimeout(() => toast.success("Rol creado con éxito"), 1000)
  } catch (e) {
    toast.error("Ha ocurrido un error al momento de crear el rol")
    console.error(e)
  }
})

</script>
