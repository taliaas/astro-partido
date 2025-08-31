<template>
  <div class="min-h-screen p-6 bg-linear-to-b from-gray-50 to-white">
    <div class="max-w-7xl mx-auto">
      <div>
        <h2 class="font-bold text-2xl">{{ acta.name }} {{ acta.id }}</h2>
      </div>
      <div @submit="submitForm" class="space-y-6">
        <!--  Información 1 -->
        <section v-show="currentStep === 1" class="space-y-4">
          <FirstStep :cores :acta />
        </section>

        <!--  Información 2 -->
        <section v-show="currentStep === 2" class="space-y-4">
          <SecondStep :acta/>
        </section>
        <!--  Información 3 -->
        <section v-show="currentStep === 3" class="space-y-4">
          <ThirdStep :acta/>
        </section>
      </div>

      <div class="w-full flex justify-between pt-4">
        <Button
          :disabled="currentStep === 1"
          size="icon"
          variant="outline"
          class="rounded-full"
          @click="currentStep--"
        >
          <ChevronLeft />
        </Button>

        <Button
          :disabled="currentStep === 3"
          size="icon"
          variant="outline"
          class="rounded-full"
          @click="currentStep++"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { form_schema } from "@/components/Ordinary/Create/form_schema";
import FirstStep from "@/components/Ordinary/Edit/FirstStep.vue";
import SecondStep from "@/components/Ordinary/Edit/SecondStep.vue";
import ThirdStep from "@/components/Ordinary/Edit/ThirdStep.vue";
import Button from "@/components/ui/button/Button.vue";
import { toTypedSchema } from "@vee-validate/zod";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";

const { cores, acta } = defineProps<{ cores: any[]; acta: any }>();
const currentStep = ref(1);

const form = useForm({
  validationSchema: toTypedSchema(form_schema),
  initialValues: {
    fecha: new Date(acta.fecha),
    core: acta.core.name,
    hora: acta.hora,
    lugar: acta.lugar,
    invitados: acta.invitados,
    militantes: [],
    agreements: acta.agreements,
    development: acta.development,
    observaciones: acta.observaciones,
    fechaCP: new Date(acta.fechaCP),
    fechaPrep: new Date(acta.fechaPrep),
    fechaProx: new Date(acta.fechaProx),
    order: acta.order,
  },
});

async function submitForm() {
  try {
    await actions.ordinary.updateMinute({ id: acta.id, data: acta });
    toast.success("Se actualizó el acta correctamente");
  } catch (e) {
    console.error(e);
    toast.error("Ocurrió un error al actualizar el acta. Inténtalo de nuevo");
  }
}

async function resetData() {
  navigate("/");
}
</script>
