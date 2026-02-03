<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label/Label.vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";
import { FileTextIcon, Trash2Icon, UploadCloudIcon } from "lucide-vue-next";
import { ref, useTemplateRef } from "vue";
import { toast } from "vue-sonner";

const open = defineModel<boolean>("open");

const inputRef = useTemplateRef("inputRef");
const tipoActa = ref("Ordinaria");
const mode = ref("Model");
const uploadedFiles = ref<File[]>([]);
const loading = ref(false);
const isDragging = ref(false);

//cargar acta
const handleDrop = async () => {
  isDragging.value = false;
  loading.value = true;
  const files = Array.from(uploadedFiles.value ?? []);

  const formData = new FormData();
  formData.append("type", tipoActa.value);
  formData.append("mode", mode.value);
  files.forEach((f) => {
    formData.append("files", f);
  });
  try {
    await actions.minute.uploadMinutes.orThrow(formData);
    open.value = false;
    uploadedFiles.value = [];
    navigate("/minutes");
  } catch (error: any) {
    toast.error(`${error.message}`);
  } finally {
    loading.value = false;
  }
};

const handleFileSelect = (event: any) => {
  const files = Array.from(event.target.files);

  uploadedFiles.value = [...uploadedFiles.value, ...files] as File[];
};

const formatFileSize = (bytes: any) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

const removeFile = (fileName: any) => {
  uploadedFiles.value = uploadedFiles.value.filter(
    (file) => file.name !== fileName,
  );
};

const handleFileDrop = (e: any) => {
  isDragging.value = false;
  const files = Array.from(e.dataTransfer.files);
  handleFiles(files);
};
const handleFiles = (files: any) => {
  uploadedFiles.value = [...uploadedFiles.value, ...files];
};

const close = () => {};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Cargar actas</DialogTitle>
        <DialogDescription>
          Seleccione o arrastre los archivos que desea cargar
        </DialogDescription>
      </DialogHeader>

      <!-- Selector de tipo de acta (obligatorio) -->
      <div class="">
        <Label class="block text-sm font-medium text-gray-700 mb-2">
          Seleccione el tipo de acta: <span class="text-red-500">*</span>
        </Label>
        <div>
          <Select :default-value="tipoActa" @update:model-value="">
            <SelectTrigger>
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ordinaria">Acta Ordinaria</SelectItem>
              <SelectItem value="Circulo Politico">Círculo Político</SelectItem>
              <SelectItem value="Extraordinaria"
                >Acta Extraordinaria</SelectItem
              >
            </SelectContent>
          </Select>
        </div>
        <Label class="block text-sm font-medium text-gray-700 mb-2 mt-2">
          Seleccione el procesamiento:
        </Label>
        <div class="flex gap-2">
          <Button
            @click="mode = 'Spacy'"
            :variant="mode === 'Spacy' ? 'default' : 'outline'"
          >
            Spacy
          </Button>

          <Button
            @click="mode = 'Model'"
            :variant="mode === 'Model' ? 'default' : 'outline'"
          >
            Model
          </Button>
        </div>
      </div>

      <!-- Área de arrastre de archivos -->
      <div
        class="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center transition-colors duration-200"
        :class="{ 'border-blue-500 bg-blue-50': isDragging }"
        @drop.prevent="handleFileDrop"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @dragenter.prevent
      >
        <UploadCloudIcon
          class="mx-auto h-12 w-12 transition-colors duration-200"
          :class="isDragging ? 'text-blue-600' : 'text-gray-400'"
        />
        <p class="mt-2 text-sm text-gray-600">
          <span class="font-medium hover:text-gray-700">
            Arrastre archivos aquí
          </span>
          o
          <Button
            variant="link"
            @click="inputRef?.click()"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            seleccione desde su dispositivo
          </Button>
        </p>
        <p class="mt-1 text-xs text-gray-500">
          DOCX, PDF, hasta 10MB por archivo
        </p>
        <input
          ref="inputRef"
          type="file"
          multiple
          accept=".pdf,.docx"
          class="hidden"
          @change="handleFileSelect"
        />
      </div>

      <!-- Lista de archivos -->
      <div
        v-if="uploadedFiles.length > 0"
        class="space-y-3 max-h-32 overflow-y-auto"
      >
        <div
          v-for="(file, index) in uploadedFiles"
          :key="index"
          class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex-shrink-0">
            <div class="w-8 h-8 rounded flex items-center justify-center">
              <FileTextIcon class="size-5" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ file.name }}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <p class="text-xs text-gray-500">
                {{ formatFileSize(file.size) }}
              </p>
            </div>
          </div>
          <Button
            @click="removeFile(file.name)"
            size="icon"
            variant="ghost"
            class="hover:text-destructive-foreground cursor-pointer"
          >
            <Trash2Icon class="size-4" />
          </Button>
        </div>
      </div>

      <DialogFooter>
        <DialogClose
          ><Button type="reset" variant="outline" @click="open = false">
            Cancelar
          </Button></DialogClose
        >
        <Button
          @click="handleDrop"
          :disabled="!uploadedFiles.length || loading"
          class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          :loading
        >
          Cargar archivos
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
