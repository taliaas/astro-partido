<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="w-11/12 mx-auto bg-gray-50 rounded-xl shadow-lg">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 bg-white">
        <h1 class="text-2xl font-bold text-gray-900">
          Procesamiento de Indicadores
        </h1>
        <p class="text-gray-500 mt-1">
          Gestione los valores de los indicadores del sistema
        </p>
      </div>

      <div class="flex p-4 gap-4">
        <aside class="p-4 space-y-4">
          <h2 class="font-medium text-2xl">Indicadores</h2>
          <!-- Form -->
          <form @submit="onSubmit" class="pb-12 relative">
            <div class="grid grid-cols-2 gap-4">
              <FormField
                  v-for="({ key }, index) of ind"
                  :key="key"
                  :name="`indicators.${index}.value`"
                  v-slot="{ componentField }"
              >
                <FormItem>
                  <FormLabel>{{ getName(key) }}</FormLabel>
                  <FormControl>
                    <Input
                        :="componentField"
                        type="number"
                        min="0"
                        step="1"
                        @focus="currentIndicator = index"
                    />
                  </FormControl>
                  <div class="flex">
                    <FormMessage/>
                    <span class="text-sm invisible">.</span>
                  </div>
                </FormItem>
              </FormField>
            </div>

            <!-- Actions -->
            <div
                class="backdrop-blur-[4px] p-4 px-12 rounded-xl fixed bottom-6 left-30 w-1/3 flex space-x-4 *:flex-1"
            >
              <Button type="button" variant="secondary" @click="resetForm">
                Restablecer
              </Button>
              <Button type="submit" :disabled="loading">
                {{ loading ? "Guardando..." : "Guardar Cambios" }}
              </Button>
            </div>
          </form>
        </aside>
        <main class="flex-1 py-4">
          <div class="sticky top-5">
            <FormField
                :name="`indicators.${currentIndicator}.text`"
                v-slot="{ componentField }"
            >
              <FormItem>
                <FormControl>
                  <Textarea
                      :="componentField"
                      class="w-full resize-none max-h-48"
                      placeholder="Escriba el texto relacionado al indicador..."
                  />
                </FormControl>
              </FormItem>
            </FormField>
            <div>
              <embed
                  :src="getFile(acta.id)"
                  type="application/pdf"
                  width="100%"
                  height="700"
                  title="Embedded PDF Viewer"
              />
            </div>

          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getFile} from "@/utils/files.ts";
import {Button} from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {indicators} from "@/lib/indicadoresKey.ts";
import ComputoService from "@/services/Computo.ts";
import {toTypedSchema} from "@vee-validate/zod";
import {z} from "astro:schema";
import {navigate} from "astro:transitions/client";
import {useForm} from "vee-validate";
import {ref, watch} from "vue";
import {toast} from "vue-sonner";

const {ind, acta, cp} = defineProps<{
  ind: any[];
  acta: any;
  cp: any;
}>();

type Data = z.infer<typeof schema>;
const schema = z.object({
  indicators: z
      .object({
        id: z.number().optional(),
        key: z.string(),
        value: z.number().nullable(),
        text: z.string(),
      })
      .array(),
});

const form = useForm<Data>({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    indicators: ind,
  },
  initialErrors: Object.fromEntries(
      Object.entries(ind).map(([_, {value}], index) => [
        "indicators." + index + ".value",
        value === null ? "No encontrado" : undefined,
      ])
  ) as any,
});

const loading = form.isSubmitting;
const currentIndicator = ref("ptos");

// Reset form to initial values
const resetForm = () => {
  form.setValues({indicators: ind});
};

// Save form data
const onSubmit = form.handleSubmit(async (data: Data) => {
  const service = new ComputoService();

  try {
    await service.updateComputo(acta.id, data);
    toast.success("Indicadores guardados exitosamente");
    await navigate("/minutes");
  } catch (error) {
    toast.error("Error al guardar los indicadores");
  }
});

const getName = (key: string) => {
  return Object.entries(indicators).find(([keyInd]) => keyInd === key)?.[1]
      .name;
};
</script>
