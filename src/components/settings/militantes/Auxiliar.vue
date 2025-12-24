<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <!-- User Name -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700">Usuario</Label>
        <Input
          v-model="user.name"
          type="text"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <!-- Email -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700">Correo</Label>
        <Input
          v-model="user.email"
          type="email"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <!-- First Name -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700">Nombres</Label>
        <Input
          v-model="user.militant.firstname"
          type="text"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <!-- Last Name -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700">Apellidos</Label>
        <Input
          v-model="user.militant.lastname"
          type="text"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <!-- Adress -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700">Dirección</Label>
        <Input
          v-model="user.militant.address"
          type="text"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <!-- Role (Read-only) -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700">Rol</Label>
        <Input
          type="text"
          v-model="user.role.name"
          readonly
          class="mt-1 block w-full rounded border-gray-300 bg-gray-50 shadow-sm"
        />
      </div>
    </div>
    <div class="grid grid-cols-3 gap-4">
      <!-- Nucleo -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700">Núcleo</Label>
        <Input
          v-model="user.militant.core.name"
          type="text"
          readonly
          class="mt-1 block w-full rounded border-gray-300 shadow-sm bg-gray-50"
        />
      </div>
      <!-- Organizacion -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700"
          >Organización</Label
        >
        <Input
          v-model="user.militant.organization"
          type="text"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <!-- Phone -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700">Teléfono</Label>
        <Input
          v-model="user.militant.phone"
          type="tel"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <!-- CI -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700">CI</Label>
        <Input
          v-model="user.militant.ci"
          type="number"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <!-- CI PCC -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700">CI PCC</Label>
        <Input
          v-model="user.militant.CIPCC"
          type="number"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <!-- Expediente -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700"
          >Expediente</Label
        >
        <Input
          v-model="user.militant.expediente"
          type="text"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <!-- Religion -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700">Religión</Label>
        <Input
          v-model="user.militant.religion"
          type="text"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <!-- Scolar Nivel -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700"
          >Nivel Escolar</Label
        >
        <Input
          v-model="user.militant.nivel_escolar"
          type="text"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <!-- Trabajo -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700">Trabajo</Label>
        <Input
          v-model="user.militant.work"
          type="text"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <!-- Sex -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700">Sexo</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selccione un sexo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in Sexo" :value="user.militant.sexo">{{
              item
            }}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Raza -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700">Raza</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selccione una raza" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in Raza" :value="user.militant.raza">{{
              item
            }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <!-- Clasificacion -->
      <div class="space-y-2">
        <Label class="block text-sm font-medium text-gray-700"
          >Clasificación</Label
        >
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selccione una clasificación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="item in Clasificacion"
              :value="user.militant.clasificacion"
              >{{ item }}</SelectItem
            >
          </SelectContent>
        </Select>
      </div>

      <!-- Cuenta Propia -->
      <div class="flex items-center gap-2">
        <Checkbox
          type="checkbox"
          v-model:model-value="user.militant.cuenta_propia"
        />
        <Label class="block text-sm font-medium text-gray-700"
          >Cuenta Propia</Label
        >
      </div>
      <!-- Fundador -->

      <div class="flex gap-2 items-center">
        <Checkbox
          type="checkbox"
          class=""
          v-model:model-value="user.militant.cuenta_propia"
        /><Label class="block text-md font-medium text-gray-700"
          >Fundador</Label
        >
      </div>

      <!-- Militant Doble -->

      <div class="flex gap-2 items-center">
        <Checkbox
          type="checkbox"
          class=""
          v-model:model-value="user.militant.militant_doble"
        /><Label class="block text-md font-medium text-gray-700"
          >Militante Doble</Label
        >
      </div>
    </div>
    <!-- Action Buttons -->
    <div class="flex justify-end space-x-4">
      <Button variant="outline" type="button" @click="openChangePasswordModal">
        <LockIcon class="w-4 h-4 mr-2" />
        Cambiar contraseña
      </Button>
      <Button variant="default" type="submit">
        <SaveIcon class="w-4 h-4 mr-2" />
        Guardar
      </Button>
    </div>
  </form>
</template>
