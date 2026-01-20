<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { Card } from "@/components/ui/card";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardFooter from "@/components/ui/card/CardFooter.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { absenceReasons } from "@/enum/absenceReasons";
import { StatusAtte } from "@/enum/Estado";
import { Reason } from "@/interface/Absent";
import type { Militant } from "@/interface/Militante";
import type Minute from "@/interface/Minute";
import { toTypedSchema } from "@vee-validate/zod";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { ArrowLeft, Plus, Save, Trash } from "lucide-vue-next";
import { useFieldArray, useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

const { militants, minute } = defineProps<{
  militants: Militant[];
  minute: Minute;
}>();

const open = defineModel<boolean>("open", { default: false });

const reason_schema = z.object({
  reason_abscents: z
    .object({
      reason: z.nativeEnum(Reason).nullable(),
      militantId: z.coerce.string(),
      minuteId: z.coerce.string(),
      status: z.nativeEnum(StatusAtte),
    })
    .array(),
});
type ReasonSchema = z.infer<typeof reason_schema>;
const form = useForm<ReasonSchema>({
  validationSchema: toTypedSchema(reason_schema),
  initialValues: {
    reason_abscents: [
      {
        reason: null,
        militantId: "",
        minuteId: minute.id,
        status: StatusAtte.A,
      },
    ],
  },
});

const reason =
  useFieldArray<ReasonSchema["reason_abscents"][number]>("reason_abscents");

const handleSubmit = form.handleSubmit(async (data: ReasonSchema) => {
  try {
    await actions.indicators.updateAttendance.orThrow(data);
    open.value = false;
  } catch (e) {
    toast.error("Ha ocurrido un error al momento de crear la ausencia");
    console.error(e);
  }
});
</script>

<template>
  <div class="space-y-2">
    <form @submit.prevent="handleSubmit" id="reason">
      <Card>
        <CardHeader class="flex justify-between">
          <Button variant="outline" @click="open = false"><ArrowLeft /></Button>
          <Button
            variant="outline"
            type="button"
            @click="
              reason.push({
                militantId: '',
                reason: null,
                minuteId: minute.id,
                status: StatusAtte.A,
              })
            "
          >
            <Plus /> Añadir
          </Button>
        </CardHeader>
        <CardContent>
          <div class="flex flex-col gap-2">
            <div
              class="flex gap-2"
              v-for="(item, index) of reason.fields.value"
              :key="index"
            >
              <FormField
                :name="'reason_abscents.' + index + '.militantId'"
                v-slot="{ componentField }"
              >
                <FormItem>
                  <FormLabel> Militante </FormLabel>
                  <FormControl>
                    <Select :="componentField">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el militante" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="(mili, index) of militants"
                          :value="mili.id"
                        >
                          {{ mili.firstname }} {{ mili.lastname }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                :name="'reason_abscents.' + index + '.reason'"
                v-slot="{ componentField }"
              >
                <FormItem>
                  <FormLabel> Causa </FormLabel>
                  <FormControl>
                    <Select :="componentField">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione la causa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          v-for="causa in absenceReasons"
                          :key="causa"
                          :value="causa"
                          class="rounded"
                          >{{ causa }}</SelectItem
                        >
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <div class="flex mx-auto items-end">
                <Button variant="ghost" @click="reason.remove(index)">
                  <Trash class="text-destructive-foreground" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter class="justify-end">
          <Button form="reason" type="submit">
            <Save />
            Guardar
          </Button>
        </CardFooter>
      </Card>
    </form>
  </div>
</template>
