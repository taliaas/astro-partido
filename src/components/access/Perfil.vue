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
                    <label class="block text-sm font-medium text-gray-700"
                      >Nombre</label
                    >
                    <Input
                      v-model="user.name"
                      type="text"
                      class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <!-- Email -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >Correo</label
                    >
                    <Input
                      v-model="user.email"
                      type="email"
                      class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <!-- Nucleo -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >Núcleo</label
                    >
                    <Input
                      v-model="user.core.name"
                      type="text"
                      readonly
                      class="mt-1 block w-full rounded border-gray-300 shadow-sm bg-gray-50"
                    />
                  </div>
                  <!-- Role (Read-only) -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >Rol</label
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
                <div class="flex justify-end space-x-4 border-t my-5">
                  <button
                    type="button"
                    @click="openChangePasswordModal"
                    class="inline-flex m-2 items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <LockIcon class="w-4 h-4 mr-2" />
                    Cambiar contraseña
                  </button>
                  <button
                    type="submit"
                    class="inline-flex m-2 items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <SaveIcon class="w-4 h-4 mr-2" />
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeSection === 'sanciones'" class="flex-1">
        <Sanciones :sanctions="user.militante.sanciones"/>
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
            <label class="block text-sm font-medium text-gray-700"
              >Contraseña actual</label
            >
            <Input
              v-model="passwordForm.current"
              type="password"
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Nueva contraseña</label
            >
            <Input
              v-model="passwordForm.new"
              type="password"
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Confirmar nueva contraseña</label
            >
            <Input
              v-model="passwordForm.confirm"
              type="password"
              class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div class="flex justify-end space-x-3">
            <button
              @click="showPasswordModal = false"
              class="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 mr-4 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
            >
              Guardar
            </button>
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
