<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8">
    <!-- Header Banner -->
    <div class="flex flex-col gap-8 md:flex-row">
      <aside class="md:w-1/4">
        <nav class="grid gap-2 md:sticky md:top-20">
          <a
            v-for="item in navigationItems"
            :key="item.id"
            href="#"
            @click.prevent="activeSection = item.id"
            :class="[
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
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
            <h1 class="text-3xl font-bold">{{ user.name }}</h1>
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
          <div class="bg-white rounded shadow">
            <!-- Form Content -->
            <div class="p-6">
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <!-- First Name -->
                  <div>
                    <Label class="block text-sm font-medium text-gray-700"
                      >Nombre</Label
                    >
                    <Input
                      v-model="user.name"
                      type="text"
                      class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <!-- Email -->
                  <div>
                    <Label class="block text-sm font-medium text-gray-700"
                      >Correo</Label
                    >
                    <Input
                      v-model="user.email"
                      type="email"
                      class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <!-- Nucleo -->
                  <div>
                    <Label class="block text-sm font-medium text-gray-700"
                      >Núcleo</Label
                    >
                    <Input
                      v-model="user.militant.core.name"
                      type="text"
                      readonly
                      class="mt-1 block w-full rounded border-gray-300 shadow-sm bg-gray-50"
                    />
                  </div>
                  <!-- Role (Read-only) -->
                  <div>
                    <Label class="block text-sm font-medium text-gray-700"
                      >Rol</Label
                    >
                    <Input
                      type="text"
                      v-model="user.role.name"
                      readonly
                      class="mt-1 block w-full rounded border-gray-300 bg-gray-50 shadow-sm"
                    />
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    type="button"
                    @click="openChangePasswordModal"
                  >
                    <LockIcon class="w-4 h-4 mr-2" />
                    Cambiar contraseña
                  </Button>
                  <Button variant="default" type="submit">
                    <SaveIcon class="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeSection === 'sanciones'" class="flex-1">
        <Sanciones :sanctions="user.militante.sanciones" />
      </div>

      <div v-if="activeSection === 'traslados'" class="flex-1">
        <Traslados :transfer="user?.militante?.traslados" />
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
import { actions } from "astro:actions";
import { LockIcon, SaveIcon, ShieldCheckIcon, UserIcon } from "lucide-vue-next";
import { reactive, ref } from "vue";
import Input from "../ui/input/Input.vue";
import Sanciones from "@/components/Profile/Sanciones.vue";
import Traslados from "@/components/Profile/Traslados.vue";
import Button from "@/components/ui/button/Button.vue";
import { Label } from "@/components/ui/label";

const { user: data } = defineProps<{ user: any }>();

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

const handleSubmit = async () => {
  const name = user.name;
  const email = user.email;
  try {
    await actions.auth.updateProfile({
      name,
      email,
    });
  } catch (error) {
    console.log(error);
  }
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
