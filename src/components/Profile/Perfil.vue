<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8">
    <!-- Header Banner -->
    <div class="flex flex-col gap-8 md:flex-row">
      <aside class="md:w-1/4 text-xl">
        <nav class="grid gap-2 md:sticky md:top-20">
          <a
            v-for="item in navigationItems"
            :key="item.id"
            href="#"
            @click.prevent="activeSection = item.id"
            :class="[
              'flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-colors',
              activeSection === item.id
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            ]"
          >
            <component class="h-4 w-4" />
            <span>{{ item.title }}</span>
          </a>
        </nav>
      </aside>
      <div v-if="activeSection === 'general'" class="flex-1">
        <div class="flex justify-center gap-6">
          <div
            class="h-24 w-24 rounded-full bg-blue-700 flex items-center justify-center ring-4 ring-blue-600"
          >
            <UserIcon class="h-12 w-12 text-white" />
          </div>
          <div>
            <h1 class="text-3xl font-bold">{{ user?.name }}</h1>
            <div class="flex items-center gap-2 mt-2 text-gray-300">
              <ShieldCheckIcon class="h-4 w-4" />
              <span class="text-lg text-foreground">{{
                user.role?.name || "Militante"
              }}</span>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-6xl mx-auto px-4 py-8">
          <div class="bg-white rounded shadow p-2">
            <!-- Form Content -->
            <div class="p-6 space-y-4">
              <div class="flex justify-between">
                <h2 class="font-semibold text-xl">Información Básica</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon">
                      <MoreVerticalIcon class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem @click="open">
                      <UserRoundPen />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="openChangePasswordModal">
                      <LockIcon class="h-4 w-4" />
                      Cambiar contraseña
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <!-- Action Buttons -->
              </div>

              <div class="grid grid-cols-2 gap-6 border-b py-4">
                <div class="flex gap-4">
                  <div class="bg-blue-50 p-2 w-[35px] rounded-xl">
                    <Mail class="text-button size-5" />
                  </div>
                  <div>
                    <Label class="text-muted-foreground"
                      >Correo Electrónico</Label
                    >
                    <p class="font-semibold">{{ user.email }}</p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="bg-blue-50 p-2 w-[35px] rounded-xl">
                    <Phone class="text-button size-5" />
                  </div>
                  <div>
                    <Label class="text-muted-foreground">Teléfono</Label>
                    <p class="font-semibold">{{ user.militant.phone }}</p>
                  </div>
                </div>

                <div class="flex gap-4">
                  <div class="bg-blue-50 p-2 w-[35px] rounded-xl">
                    <Building2 class="text-button size-5" />
                  </div>
                  <div>
                    <Label class="text-muted-foreground">Organización</Label>
                    <p class="font-semibold">
                      {{ user.militant.organization }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="bg-blue-50 p-2 w-[35px] rounded-xl">
                    <Users class="text-button size-5" />
                  </div>
                  <div>
                    <Label class="text-muted-foreground">Núcleo</Label>
                    <p class="font-semibold">{{ user.militant.core.name }}</p>
                  </div>
                </div>
              </div>
              <div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="details">
                    <AccordionTrigger class="border p-2 space-y-2">
                      Ver detalles completos
                    </AccordionTrigger>
                    <AccordionContent>
                      <div class="space-y-4">
                        <h2 class="font-medium pt-4">Detalles Completos</h2>
                        <div class="p-3 rounded-md bg-muted space-y-2">
                          <h2
                            class="font-semibold text-popover-foreground text-md"
                          >
                            Datos personales
                          </h2>
                          <div
                            class="grid grid-cols-2 gap-2 text-muted-foreground"
                          >
                            <div>
                              <Label class="text-sm">Nombre Completo</Label>
                              <p class="text-foreground">
                                {{
                                  user.militant.firstname || "No especificado"
                                }}
                              </p>
                            </div>
                            <div>
                              <Label class="text-sm">Apellidos</Label>
                              <p class="text-foreground">
                                {{
                                  user.militant.lastname || "No especificado"
                                }}
                              </p>
                            </div>
                            <div>
                              <Label class="text-sm">Dirección</Label>
                              <p class="text-foreground">
                                {{ user.militant.address || "No especificado" }}
                              </p>
                            </div>
                            <div>
                              <Label class="text-sm">CI</Label>
                              <p class="text-foreground">
                                {{ user.militant.ci || "No especificado" }}
                              </p>
                            </div>
                            <div>
                              <Label class="text-sm">CI PCC</Label>
                              <p class="text-foreground">
                                {{ user.militant.CIPCC || "No especificado" }}
                              </p>
                            </div>
                            <div>
                              <Label class="text-sm">Sexo</Label>
                              <p class="text-foreground">
                                {{ user.militant.sexo || "No especificado" }}
                              </p>
                            </div>
                            <div>
                              <Label class="text-sm">Raza</Label>
                              <p class="text-foreground">
                                {{ user.militant.raza || "No especificado" }}
                              </p>
                            </div>
                            <div>
                              <Label class="text-sm">Religión</Label>
                              <p class="text-foreground">
                                {{
                                  user.militant.religion || "No especificado"
                                }}
                              </p>
                            </div>
                            <div>
                              <Label class="text-sm">Organización</Label>
                              <p class="text-foreground">
                                {{
                                  user.militant.organization ||
                                  "No especificado"
                                }}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div class="p-3 rounded-md bg-muted space-y-2">
                          <h2
                            class="font-semibold text-popover-foreground text-md"
                          >
                            Académico y Laboral
                          </h2>
                          <div
                            class="grid grid-cols-4 gap-2 text-muted-foreground"
                          >
                            <div>
                              <Label class="text-sm">Nivel Escolar</Label>
                              <p class="text-foreground">
                                {{
                                  user.militant.nivel_escolar ||
                                  "No especificado"
                                }}
                              </p>
                            </div>
                            <div>
                              <Label class="text-sm">Trabajo</Label>
                              <p class="text-foreground">
                                {{ user.militant.work || "No especificado" }}
                              </p>
                            </div>
                            <div>
                              <Label class="text-sm">Clasificación</Label>
                              <p class="text-foreground">
                                {{
                                  user.militant.clasificacion ||
                                  "No especificado"
                                }}
                              </p>
                            </div>
                            <div>
                              <Label class="text-sm">Expediente</Label>
                              <p class="text-foreground">
                                {{
                                  user.militant.expediente || "No especificado"
                                }}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div class="p-3 rounded-md bg-muted space-y-2">
                          <h2
                            class="font-semibold text-popover-foreground text-md"
                          >
                            Clasificaciones
                          </h2>
                          <div class="grid grid-cols-3">
                            <div class="flex gap-2">
                              <Checkbox
                                :default-value="user.militant.cuenta_propia"
                              ></Checkbox>
                              <p class="text-foreground font-medium">
                                Cuenta Propia
                              </p>
                            </div>
                            <div class="flex gap-2">
                              <Checkbox
                                :default-value="user.militant.cuenta_propia"
                              ></Checkbox>
                              <p class="text-foreground font-medium">
                                Fundador
                              </p>
                            </div>
                            <div class="flex gap-2">
                              <Checkbox
                                :default-value="user.militant.cuenta_propia"
                              ></Checkbox>
                              <p class="text-foreground font-medium">
                                Militante Doble
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeSection === 'sanciones'" class="flex-1">
        <Sanciones :sanctions="user.militant.sancions" />
      </div>
      <div v-if="activeSection === 'traslados'" class="flex-1">
        <Traslados :transfer="user?.militant.transfer" />
      </div>
    </div>

    <!-- Change Password -->
    <div
      v-if="showPasswordModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white rounded p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Cambiar contraseña
        </h3>
        <form @submit.prevent="handlePasswordChange" class="space-y-4">
          <div>
            <Label class="block text-sm font-medium text-gray-700"
              >Contraseña actual</Label
            >
            <Input
              v-model="passwordForm.current"
              type="password"
              maxlength="16"
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label class="block text-sm font-medium text-gray-700"
              >Nueva contraseña</Label
            >
            <Input
              v-model="passwordForm.new"
              type="password"
              maxlength="16"
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label class="block text-sm font-medium text-gray-700"
              >Confirmar nueva contraseña</Label
            >
            <Input
              v-model="passwordForm.confirm"
              type="password"
              maxlength="16"
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div class="flex justify-end space-x-3">
            <Button variant="outline" @click="showPasswordModal = false">
              Cancel
            </Button>
            <Button variant="default" type="submit"> Guardar </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sanciones from "@/components/Profile/Sanciones.vue";
import Traslados from "@/components/Profile/Traslados.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Button from "@/components/ui/button/Button.vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { User } from "@/interface/Militante";
import { actions } from "astro:actions";
import {
  Building2,
  LockIcon,
  Mail,
  MoreVerticalIcon,
  Phone,
  ShieldCheckIcon,
  UserIcon,
  UserRoundPen,
  Users,
} from "lucide-vue-next";
import { reactive, ref } from "vue";
import Input from "../ui/input/Input.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navigate } from "astro:transitions/client";

const { user: data } = defineProps<{
  user: User;
}>();

const activeSection = ref("general");
const user = reactive(data);
const message = ref("");
const showPasswordModal = ref(false);
const openChangePasswordModal = () => {
  showPasswordModal.value = true;
};

// Password form
const passwordForm = reactive({
  current: "",
  new: "",
  confirm: "",
});

const open = async () => {
  navigate(`/settings/militants/${user.id}/edit`);
};

const handlePasswordChange = async () => {
  if (passwordForm.new !== passwordForm.confirm) {
    message.value = "La nueva contraseña no coincide";
    return;
  }
  try {
    await actions.auth.updatePassword({
      prev_pw: passwordForm.current,
      new_pw: passwordForm.new,
    });
    showPasswordModal.value = false;
    passwordForm.current = "";
    passwordForm.new = "";
    passwordForm.confirm = "";
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

const navigationItems = [
  { id: "general", title: "General" },
  { id: "sanciones", title: "Sanciones" },
  { id: "traslados", title: "Traslados" },
];
</script>
