<script setup lang="ts">
import { editFormSchema } from "@/components/Acta/Ordinary/Create/form_schema";
import FirstStep from "@/components/Acta/Ordinary/Edit/FirstStep.vue";
import SecondStep from "@/components/Acta/Ordinary/Edit/SecondStep.vue";
import Button from "@/components/ui/button/Button.vue";
import type { Militant } from "@/interface/Militante";
import type Minute from "@/interface/Minute";
import { toTypedSchema } from "@vee-validate/zod";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { ArrowLeft, ArrowRight, SendHorizonal } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";

const { cores, acta, militantes } = defineProps<{
  cores: any[];
  acta: Minute;
  militantes: Militant[];
}>();

const open = ref(false);
const currentStep = ref(1);

const nextStep = () => {
  if (currentStep.value < 2) currentStep.value++;
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};

const form = useForm({
  validationSchema: toTypedSchema(editFormSchema),
  initialValues: {
    name: acta.name,
    date: acta.date?.toString() ?? "",
    core: acta.core?.id,
    hour: acta.hour,
    place: acta.place,
    abscents: acta.abscents ?? [],
    invitados: acta.invitados ?? [],
    development: acta.ordinary?.development,
    fechaCP: acta.ordinary?.fechaCP?.toString() ?? "",
    fechaPrep: acta.ordinary?.fechaPrep?.toString() ?? "",
    fechaProx: acta.ordinary?.fechaProx?.toString() ?? "",
  },
});
const mili = acta.abscents.map((item) => item.militant);

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    await actions.ordinary.updateMinute({ id: +acta.id, data: values });
    toast.success("Se actualizó el acta correctamente");
    navigate("/minutes");
  } catch (e) {
    console.error(e);
    toast.error("Ocurrió un error al actualizar el acta. Inténtalo de nuevo");
  }
});
</script>
<template>
  <div class="min-h-screen p-6 bg-linear-to-b from-gray-50 to-white">
    <form @submit="onSubmit" class="max-w-7xl mx-auto">
      <div class="p-4 flex justify-center">
        <h2 class="font-bold text-2xl">{{ acta.name }} {{ acta.id }}</h2>
      </div>
      <div class="space-y-6 min-h-[70vh]">
        <!--  Información 1 -->
        <section v-show="currentStep === 1" class="space-y-4">
          <FirstStep :cores edit :militantes="mili" />
        </section>

        <!--  Información 2 -->
        <section v-show="currentStep === 2" class="space-y-4">
          <SecondStep :militants="militantes" :acta />
        </section>
      </div>
      <div class="w-full flex justify-between pt-4">
        <div class="space-x-2">
          <Button
            variant="outline"
            @click="prevStep"
            type="button"
            :disabled="currentStep === 1"
          >
            <ArrowLeft class="w-4 h-4" />
          </Button>
          <Button
            :disabled="currentStep === 2"
            type="button"
            variant="outline"
            @click="nextStep"
          >
            <ArrowRight class="w-4 h-4" />
          </Button>
        </div>
        <Button type="button" @click="open = true">
          Enviar
          <SendHorizonal class="size-4" />
        </Button>
      </div>
    </form>
  </div>
</template>
