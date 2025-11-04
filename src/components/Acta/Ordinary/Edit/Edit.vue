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
          <SecondStep :acta />
        </section>
        <!--  Información 3 -->
        <section v-show="currentStep === 3" class="space-y-4">
          <ThirdStep :militantes />
        </section>
      </div>
      <div class="w-full flex justify-between pt-4">
        <Button
          type="button"
          :disabled="currentStep === 1"
          size="icon"
          variant="outline"
          class="rounded-full"
          @click="currentStep--"
        >
          <ChevronLeft />
        </Button>

        <Button
          type="button"
          v-if="currentStep < 3"
          size="icon"
          variant="outline"
          class="rounded-full"
          @click="currentStep++"
        >
          <ChevronRight />
        </Button>
        <Button v-else size="sm" type="submit"> Actualizar </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import {
  form_schema,
  type FormSchema,
} from "@/components/Acta/Ordinary/Create/form_schema";
import FirstStep from "@/components/Ordinary/Edit/FirstStep.vue";
import SecondStep from "@/components/Ordinary/Edit/SecondStep.vue";
import ThirdStep from "@/components/Ordinary/Edit/ThirdStep.vue";
import Button from "@/components/ui/button/Button.vue";
import type { Militantes } from "@/interface/Militante";
import { toTypedSchema } from "@vee-validate/zod";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { ChevronLeft, ChevronRight, Upload } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";

interface actaData {
  id: number;
  name: string;
  fecha: string;
  core: any;
  hora: any;
  lugar: string;
  abscents: {
    id: number;
    estado: any;
    reason: null;
    militante: any;
  }[];
  invitados: any[];
  agreements: any;
  development: any;
  observaciones: string;
  fechaCP: string;
  fechaPrep: string;
  fechaProx: string;
  order: string[];
}

const { cores, acta, militantes } = defineProps<{
  cores: any[];
  acta: actaData;
  militantes: Militantes[];
}>();
const currentStep = ref(1);

const form = useForm({
  validationSchema: toTypedSchema(form_schema),
  initialValues: {
    fecha: acta.fecha,
    core: acta.core.id,
    hora: acta.hora,
    lugar: acta.lugar,
    abscents:
      acta.abscents.map((item) => ({
        id: item.id,
        estado: item.estado,
        reason: item.reason,
        minuteId: acta.id,
        militanteId: item.militante.id,
      })) ?? [],
    invitados: acta.invitados ?? [],
    agreements: acta.agreements,
    development: acta.development,
    observaciones: acta.observaciones,
    fechaCP: acta.fechaCP,
    fechaPrep: acta.fechaPrep,
    fechaProx: acta.fechaProx,
    order: acta.order,
  },
});
const mili = acta.abscents.map((item) => item.militante);

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    await actions.ordinary.updateMinute({ id: acta.id, data: values });
    toast.success("Se actualizó el acta correctamente");
    navigate("/minutes");
  } catch (e) {
    console.error(e);
    toast.error("Ocurrió un error al actualizar el acta. Inténtalo de nuevo");
  }
});

async function resetData() {
  navigate("/");
}
</script>
