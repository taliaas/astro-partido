<template>
  <form class="max-w-7xl mx-auto p-4 space-y-6" @submit.prevent="saveSettings">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Configuración</h1>
        <p class="text-sm text-gray-500">
          Administre las preferencias y ajustes del sistema
        </p>
      </div>
      <Button @click="saveSettings" class="bg-button">
        <SaveIcon class="h-4 w-4 mr-2" />
        Guardar cambios
      </Button>
    </div>

    <div class="bg-white rounded-lg border shadow-sm">
      <Tabs default-value="indicators" class="w-full">
        <TabsList class="grFid grid-cols-4 w-full">
          <TabsTrigger
            value="indicators"
            class="flex data-[state=active]:bg-blue-50"
          >
            <div class="flex items-center py-2 text-md">
              <GaugeIcon class="h-4 w-4 mr-2" />
              Indicadores
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="users"
            class="flex data-[state=active]:bg-blue-50"
          >
            <div class="flex items-center py-2 text-md">
              <UsersIcon class="h-4 w-4 mr-2" />
              Usuarios
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            class="flex data-[state=active]:bg-blue-50"
          >
            <div class="flex items-center py-2 text-md">
              <FileTextIcon class="h-4 w-4 mr-2" />
              Documentos
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="navigation"
            class="flex data-[state=active]:bg-blue-50"
          >
            <div class="flex items-center py-2 text-md">
              <BellIcon class="h-4 w-4 mr-2" />
              Navegación
            </div>
          </TabsTrigger>
        </TabsList>

        <!-- Sección de Indicadores -->
        <TabsContent value="indicators" class="p-6 space-y-6">
          <div class="space-y-4">
            <h2 class="text-lg font-medium">Configuración de Indicadores</h2>
            <p class="text-sm text-gray-500">
              Personalice cómo se muestran y calculan los indicadores en el
              sistema
            </p>

            <Separator />

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Visualización de indicadores -->
                <Card>
                  <CardHeader>
                    <CardTitle>Visualización</CardTitle>
                    <CardDescription
                      >Configure cómo se muestran los indicadores
                    </CardDescription>
                  </CardHeader>
                  <CardContent class="space-y-4">
                    <div class="space-y-2">
                      <div class="flex items-center justify-between">
                        <Label for="show-percentages"
                          >Mostrar porcentajes</Label
                        >
                        <Switch
                          id="show-percentages"
                          v-model:checked="settings.indicators.showPercentages"
                        />
                      </div>
                      <div class="flex items-center justify-between">
                        <Label for="show-trends">Mostrar tendencias</Label>
                        <Switch
                          id="show-trends"
                          v-model:checked="settings.indicators.showTrends"
                        />
                      </div>
                      <div class="flex items-center justify-between">
                        <Label for="color-coding"
                          >Codificación por colores</Label
                        >
                        <Switch
                          id="color-coding"
                          v-model:checked="settings.indicators.colorCoding"
                        />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <Label for="default-view">Vista predeterminada</Label>
                      <Select v-model="settings.indicators.defaultView">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una vista" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="table">Tabla</SelectItem>
                          <SelectItem value="cards">Tarjetas</SelectItem>
                          <SelectItem value="charts">Gráficos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <!-- Cálculo de indicadores -->
                <Card>
                  <CardHeader>
                    <CardTitle>Cálculo</CardTitle>
                    <CardDescription
                      >Configure cómo se calculan los indicadores
                    </CardDescription>
                  </CardHeader>
                  <CardContent class="space-y-4">
                    <div class="space-y-2">
                      <Label for="calculation-period">Período de cálculo</Label>
                      <Select v-model="settings.indicators.calculationPeriod">
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Mensual</SelectItem>
                          <SelectItem value="quarterly">Trimestral</SelectItem>
                          <SelectItem value="yearly">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div class="space-y-2">
                      <Label for="threshold-good"
                        >Umbral para indicador positivo (%)</Label
                      >
                      <Slider
                        id="threshold-good"
                        v-model="settings.indicators.thresholdGood"
                        :min="50"
                        :max="100"
                        :step="5"
                        class="w-full"
                      />
                      <div class="text-right text-sm text-gray-500">
                        {{ settings.indicators.thresholdGood }}%
                      </div>
                    </div>

                    <div class="space-y-2">
                      <Label for="threshold-warning"
                        >Umbral para indicador de advertencia (%)</Label
                      >
                      <Slider
                        id="threshold-warning"
                        v-model="settings.indicators.thresholdWarning"
                        :min="25"
                        :max="75"
                        :step="5"
                        class="w-full"
                      />
                      <div class="text-right text-sm text-gray-500">
                        {{ settings.indicators.thresholdWarning }}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <!-- Categorías de indicadores -->
              <Card>
                <CardHeader>
                  <CardTitle>Categorías de Indicadores</CardTitle>
                  <CardDescription
                    >Gestione las categorías de indicadores disponibles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="space-y-4">
                    <div
                      v-for="(category, index) in settings.indicators
                        .categories"
                      :key="index"
                      class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div class="flex items-center">
                        <div
                          class="w-3 h-3 rounded-full mr-3"
                          :style="{ backgroundColor: category.color }"
                        ></div>
                        <span>{{ category.name }}</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <Switch v-model:checked="category.enabled" />
                        <Button variant="ghost" size="icon">
                          <PencilIcon class="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Button variant="outline" class="w-full">
                      <PlusIcon class="h-4 w-4 mr-2" />
                      Agregar categoría
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <!-- Sección de Usuarios -->
        <TabsContent value="users" class="p-6 space-y-6">
          <div class="space-y-4">
            <h2 class="text-lg font-medium">Gestión de Usuarios</h2>
            <p class="text-sm text-gray-500">
              Configure los permisos y roles de usuarios en el sistema
            </p>

            <Separator />

            <div class="space-y-6">
              <!-- Roles y permisos -->
              <Card>
                <CardHeader>
                  <CardTitle>Roles y Permisos</CardTitle>
                  <CardDescription
                    >Configure los roles disponibles y sus permisos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="space-y-4">
                    <div
                      v-for="(role, index) in $props.roles"
                      :key="index"
                      class="border rounded-md"
                    >
                      <Collapsible>
                        <CollapsibleTrigger
                          class="flex items-center justify-between w-full p-4 text-left"
                        >
                          <div class="flex items-center">
                            <Badge :class="getRoleBadgeClass(role.name)"
                              >{{ role.name }}
                            </Badge>
                            <span class="ml-2 text-sm text-gray-500"
                              >{{ role.users }} usuarios</span
                            >
                          </div>
                          <ChevronDownIcon class="h-4 w-4 text-gray-500" />
                        </CollapsibleTrigger>
                        <CollapsibleContent class="p-4 pt-0 border-t">
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                              v-for="(section, sectionName) in role.permissions"
                              :key="sectionName"
                              class="space-y-2"
                            >
                              <h4 class="text-sm font-medium">
                                {{ sectionName }}
                              </h4>
                              <div class="space-y-1">
                                <div
                                  v-for="(value, permission) in section"
                                  :key="permission"
                                  class="flex items-center justify-between"
                                >
                                  <Label
                                    :for="`${role.name}-${permission}`"
                                    class="text-xs"
                                    >{{ permission }}</Label
                                  >
                                  <Switch
                                    :id="`${role.name}-${permission}`"
                                    v-model:checked="section[permission]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>

                    <Button variant="outline" class="w-full">
                      <PlusIcon class="h-4 w-4 mr-2" />
                      Agregar rol
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <!-- Sección de Documentos -->
        <TabsContent value="documents" class="p-6 space-y-6">
          <div class="space-y-4">
            <h2 class="text-lg font-medium">Manejo de Documentos</h2>
            <p class="text-sm text-gray-500">
              Configure cómo se gestionan los documentos en el sistema
            </p>

            <Separator />

            <div class="space-y-6">
              <!-- Almacenamiento -->
              <Card>
                <CardHeader>
                  <CardTitle>Almacenamiento</CardTitle>
                  <CardDescription
                    >Configure las opciones de almacenamiento de documentos
                  </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="space-y-2">
                    <Label for="storage-provider"
                      >Proveedor de almacenamiento</Label
                    >
                    <Select v-model="settings.documents.storageProvider">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local"
                          >Almacenamiento local
                        </SelectItem>
                        <SelectItem value="cloud">Nube</SelectItem>
                        <SelectItem value="hybrid">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="space-y-2">
                    <Label for="max-file-size"
                      >Tamaño máximo de archivo (MB)</Label
                    >
                    <Input
                      id="max-file-size"
                      type="number"
                      v-model="settings.documents.maxFileSize"
                    />
                  </div>

                  <div class="space-y-2">
                    <Label>Tipos de archivo permitidos</Label>
                    <div class="flex flex-wrap gap-2">
                      <Badge
                        v-for="(type, index) in settings.documents
                          .allowedFileTypes"
                        :key="index"
                        variant="outline"
                        class="flex items-center gap-1"
                      >
                        {{ type }}
                        <XIcon class="h-3 w-3 cursor-pointer" />
                      </Badge>
                      <Button variant="outline" size="sm" class="h-6">
                        <PlusIcon class="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Retención de documentos -->
              <Card>
                <CardHeader>
                  <CardTitle>Retención de Documentos</CardTitle>
                  <CardDescription
                    >Configure las políticas de retención de documentos
                  </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <Label for="auto-archive">Archivo automático</Label>
                      <Switch
                        id="auto-archive"
                        v-model:checked="settings.documents.autoArchive"
                      />
                    </div>
                    <div class="flex items-center justify-between">
                      <Label for="version-control">Control de versiones</Label>
                      <Switch
                        id="version-control"
                        v-model:checked="settings.documents.versionControl"
                      />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <Label for="retention-period"
                      >Período de retención (días)</Label
                    >
                    <Input
                      id="retention-period"
                      type="number"
                      v-model="settings.documents.retentionPeriod"
                    />
                  </div>

                  <div class="space-y-2">
                    <Label for="archive-action">Acción al archivar</Label>
                    <Select v-model="settings.documents.archiveAction">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una acción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="move">Mover a archivo</SelectItem>
                        <SelectItem value="compress">Comprimir</SelectItem>
                        <SelectItem value="delete">Eliminar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <!-- Plantillas de documentos -->
              <Card>
                <CardHeader>
                  <CardTitle>Plantillas de Documentos</CardTitle>
                  <CardDescription
                    >Gestione las plantillas disponibles para documentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="space-y-4">
                    <div
                      v-for="(template, index) in settings.documents.templates"
                      :key="index"
                      class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div class="flex items-center">
                        <FileTextIcon class="h-4 w-4 mr-2 text-gray-500" />
                        <span>{{ template.name }}</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <Switch v-model:checked="template.enabled" />
                        <Button variant="ghost" size="icon">
                          <PencilIcon class="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Button variant="outline" class="w-full">
                      <PlusIcon class="h-4 w-4 mr-2" />
                      Agregar plantilla
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <!-- Sección de Navegación -->
        <TabsContent value="navigation" class="p-6 space-y-6">
          <div class="space-y-4">
            <h2 class="text-lg font-medium">Configuración de Navegación</h2>
            <p class="text-sm text-gray-500">
              Configure las notificaciones y elementos de navegación
            </p>

            <Separator />

            <div class="space-y-6">
              <!-- Notificaciones -->
              <Card>
                <CardHeader>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription
                    >Configure las preferencias de notificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <Label for="email-notifications"
                        >Notificaciones por correo</Label
                      >
                      <Switch
                        id="email-notifications"
                        v-model:checked="settings.navigation.emailNotifications"
                      />
                    </div>
                    <div class="flex items-center justify-between">
                      <Label for="push-notifications"
                        >Notificaciones push</Label
                      >
                      <Switch
                        id="push-notifications"
                        v-model:checked="settings.navigation.pushNotifications"
                      />
                    </div>
                    <div class="flex items-center justify-between">
                      <Label for="in-app-notifications"
                        >Notificaciones en la aplicación</Label
                      >
                      <Switch
                        id="in-app-notifications"
                        v-model:checked="settings.navigation.inAppNotifications"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div class="space-y-4">
                    <h4 class="text-sm font-medium">Eventos de notificación</h4>
                    <div
                      v-for="(value, event) in settings.navigation
                        .notificationEvents"
                      :key="event"
                      class="flex items-center justify-between"
                    >
                      <Label :for="`event-${event}`" class="text-sm">{{
                        getEventLabel(event)
                      }}</Label>
                      <Switch
                        :id="`event-${event}`"
                        v-model:checked="
                          settings.navigation.notificationEvents[event]
                        "
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Menú de navegación -->
              <Card>
                <CardHeader>
                  <CardTitle>Menú de Navegación</CardTitle>
                  <CardDescription
                    >Configure los elementos del menú de navegación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="space-y-4">
                    <div
                      v-for="(item, index) in settings.navigation.menuItems"
                      :key="index"
                      class="border rounded-md"
                    >
                      <div class="flex items-center justify-between p-3">
                        <div class="flex items-center">
                          <component
                            :is="getIconComponent(item.icon)"
                            class="h-4 w-4 mr-2"
                          />
                          <span>{{ item.label }}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                          <Switch v-model:checked="item.visible" />
                          <Button variant="ghost" size="icon">
                            <ArrowUpIcon class="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <ArrowDownIcon class="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Preferencias de interfaz -->
              <Card>
                <CardHeader>
                  <CardTitle>Preferencias de Interfaz</CardTitle>
                  <CardDescription
                    >Configure las preferencias visuales de la interfaz
                  </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="space-y-2">
                    <Label for="theme">Tema</Label>
                    <Select v-model="settings.navigation.theme">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="space-y-2">
                    <Label for="density">Densidad de la interfaz</Label>
                    <Select v-model="settings.navigation.density">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una densidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compacta</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="comfortable">Cómoda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="space-y-2">
                    <Label for="font-size">Tamaño de fuente</Label>
                    <Slider
                      id="font-size"
                      v-model="settings.navigation.fontSize"
                      :min="12"
                      :max="20"
                      :step="1"
                      class="w-full"
                    />
                    <div class="text-right text-sm text-gray-500">
                      {{ settings.navigation.fontSize }}px
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  SaveIcon,
  GaugeIcon,
  UsersIcon,
  FileTextIcon,
  BellIcon,
  PlusIcon,
  ChevronDownIcon,
  XIcon,
  PencilIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  HomeIcon,
  SettingsIcon,
  UserIcon,
  FileIcon,
  BarChartIcon,
  CalendarIcon,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const { roles } = defineProps<{
  roles: { id: string; name: string }[];
}>();

// Configuración inicial
const settings = ref({
  indicators: {
    showPercentages: true,
    showTrends: true,
    colorCoding: true,
    defaultView: "table",
    calculationPeriod: "monthly",
    thresholdGood: 85,
    thresholdWarning: 50,
    categories: [
      { name: "Organizaciones de Base", color: "#3b82f6", enabled: true },
      { name: "Núcleos Mixtos", color: "#10b981", enabled: true },
      { name: "Reuniones Realizadas", color: "#f59e0b", enabled: true },
      { name: "Invitados a reuniones", color: "#8b5cf6", enabled: true },
      { name: "Rendiciones de cuentas", color: "#ec4899", enabled: true },
    ],
  },
  users: {
    twoFactorAuth: false,
    passwordExpiry: true,
    passwordPolicy: "standard",
    sessionTimeout: 30,
    roles: [
      {
        name: "Administrador",
        users: 5,
        permissions: {
          Indicadores: {
            Ver: true,
            Editar: true,
            Eliminar: true,
            Crear: true,
          },
          Usuarios: {
            Ver: true,
            Editar: true,
            Eliminar: true,
            Crear: true,
          },
          Documentos: {
            Ver: true,
            Editar: true,
            Eliminar: true,
            Crear: true,
          },
          Configuración: {
            Ver: true,
            Editar: true,
          },
        },
      },
      {
        name: "Editor",
        users: 12,
        permissions: {
          Indicadores: {
            Ver: true,
            Editar: true,
            Eliminar: false,
            Crear: true,
          },
          Usuarios: {
            Ver: true,
            Editar: false,
            Eliminar: false,
            Crear: false,
          },
          Documentos: {
            Ver: true,
            Editar: true,
            Eliminar: false,
            Crear: true,
          },
          Configuración: {
            Ver: true,
            Editar: false,
          },
        },
      },
      {
        name: "Lector",
        users: 28,
        permissions: {
          Indicadores: {
            Ver: true,
            Editar: false,
            Eliminar: false,
            Crear: false,
          },
          Usuarios: {
            Ver: false,
            Editar: false,
            Eliminar: false,
            Crear: false,
          },
          Documentos: {
            Ver: true,
            Editar: false,
            Eliminar: false,
            Crear: false,
          },
          Configuración: {
            Ver: false,
            Editar: false,
          },
        },
      },
    ],
  },
  documents: {
    storageProvider: "local",
    maxFileSize: 10,
    allowedFileTypes: ["pdf", "docx", "xlsx", "jpg", "png"],
    autoArchive: true,
    versionControl: true,
    retentionPeriod: 365,
    archiveAction: "move",
    templates: [
      { name: "Informe Mensual", enabled: true },
      { name: "Acta de Reunión", enabled: true },
      { name: "Reporte de Asistencia", enabled: true },
      { name: "Evaluación de Desempeño", enabled: false },
    ],
  },
  navigation: {
    emailNotifications: true,
    pushNotifications: false,
    inAppNotifications: true,
    notificationEvents: {
      newDocument: true,
      meetingReminder: true,
      userActivity: false,
      systemUpdates: true,
      dataChanges: true,
    },
    menuItems: [
      { label: "Inicio", icon: "home", visible: true },
      { label: "Indicadores", icon: "chart", visible: true },
      { label: "Documentos", icon: "file", visible: true },
      { label: "Usuarios", icon: "user", visible: true },
      { label: "Calendario", icon: "calendar", visible: false },
      { label: "Configuración", icon: "settings", visible: true },
    ],
    theme: "light",
    density: "normal",
    fontSize: 14,
  },
});

// Funciones auxiliares

const getRoleBadgeClass = (roleName: string) => {
  switch (roleName) {
    case "Administrador":
      return "bg-blue-100 text-blue-800";
    case "Editor":
      return "bg-green-100 text-green-800";
    case "Lector":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getEventLabel = (event: string) => {
  const labels: Record<string, string> = {
    newDocument: "Nuevos documentos",
    meetingReminder: "Recordatorios de reuniones",
    userActivity: "Actividad de usuarios",
    systemUpdates: "Actualizaciones del sistema",
    dataChanges: "Cambios en los datos",
  };
  return labels[event] || event;
};

const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    home: HomeIcon,
    chart: BarChartIcon,
    file: FileIcon,
    user: UserIcon,
    calendar: CalendarIcon,
    settings: SettingsIcon,
  };
  return icons[iconName] || HomeIcon;
};

const saveSettings = (e) => {
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  // Aquí iría la lógica para guardar la configuración
  console.log("Guardando configuración:", settings.value);
  // Mostrar notificación de éxito
  alert("Configuración guardada correctamente");
};
</script>
