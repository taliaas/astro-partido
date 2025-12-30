<template>
  <!-- Change Password -->
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded p-6 w-full max-w-md">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Cambiar contraseña</h3>
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
            maxlength="16"
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
            maxlength="16"
            class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div class="flex justify-end space-x-3">
          <button
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
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { actions } from "astro:actions";
import { toast } from "vue-sonner";

const { user: data } = defineProps<{ user: any }>();

// Password form
const passwordForm = reactive({
  current: "",
  new: "",
  confirm: "",
});

const handlePasswordChange = async () => {
  if (passwordForm.new !== passwordForm.confirm) {
    toast.error("La nueva contraseña no coincide");
    return;
  }
  try {
    await actions.auth.updatePassword({
      prev_pw: passwordForm.current,
      new_pw: passwordForm.new,
    });
    passwordForm.current = "";
    passwordForm.new = "";
    passwordForm.confirm = "";
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};
</script>
