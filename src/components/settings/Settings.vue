<template>
  <div class="container mx-auto px-4 py-6 md:px-6 md:py-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Configuración</h1>
        <p class="text-muted-foreground">Administre la configuración del sistema, usuarios, roles y permisos</p>
      </div>
    </div>

    <div class="flex flex-col gap-8 md:flex-row">
      <!-- Barra lateral de navegación -->
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
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
          >
            <component :is="item.icon" class="h-4 w-4" />
            <span>{{ item.title }}</span>
          </a>
        </nav>
      </aside>

      <!-- Contenido principal -->
      <div class="flex-1 md:max-w-3xl">
        <!-- Vista General -->
        <div v-if="activeSection === 'general'" class="space-y-6">
          <div>
            <h3 class="text-lg font-medium">Panel de Configuración</h3>
            <p class="text-sm text-muted-foreground">Configure su sistema de gestión de documentos</p>
          </div>

          <!-- Pestañas -->
          <div class="space-y-4">
            <div class="flex space-x-1 rounded-lg bg-muted p-1">
              <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                  'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                ]"
              >
                {{ tab.name }}
              </button>
            </div>

            <!-- Contenido de pestañas -->
            <div v-if="activeTab === 'overview'" class="space-y-4">
              <!-- Tarjeta de resumen -->
              <div class="rounded-lg border bg-card shadow-sm">
                <div class="p-6">
                  <h4 class="text-lg font-semibold">Resumen del Sistema</h4>
                  <p class="text-sm text-muted-foreground">Vea el estado actual de su sistema de gestión de documentos</p>

                  <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="stat in systemStats" :key="stat.title" class="rounded-lg border bg-card p-3 shadow-sm">
                      <div class="text-sm font-medium text-muted-foreground">{{ stat.title }}</div>
                      <div class="mt-1 text-2xl font-bold">{{ stat.value }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pestaña de seguridad -->
            <div v-if="activeTab === 'security'" class="space-y-4">
              <div class="rounded-lg border bg-card shadow-sm">
                <div class="p-6">
                  <h4 class="text-lg font-semibold">Configuración de Seguridad</h4>
                  <p class="text-sm text-muted-foreground">Configure los ajustes de seguridad de su sistema</p>

                  <div class="mt-6 space-y-6">
                    <!-- Políticas de contraseña -->
                    <div>
                      <h5 class="text-md font-medium mb-3">Políticas de Contraseña</h5>
                      <div class="space-y-3">
                        <div class="flex items-center justify-between">
                          <div>
                            <span class="font-medium">Longitud mínima</span>
                            <p class="text-sm text-muted-foreground">Mínimo de caracteres requeridos</p>
                          </div>
                          <select class="rounded-md border px-3 py-1 bg-background">
                            <option>8 caracteres</option>
                            <option>10 caracteres</option>
                            <option>12 caracteres</option>
                          </select>
                        </div>

                        <div class="flex items-center justify-between">
                          <div>
                            <span class="font-medium">Complejidad requerida</span>
                            <p class="text-sm text-muted-foreground">Requisitos de caracteres especiales</p>
                          </div>
                          <div class="flex items-center">
                            <input type="checkbox" id="complexity" class="rounded border-gray-300 mr-2" checked />
                            <label for="complexity">Activado</label>
                          </div>
                        </div>

                        <div class="flex items-center justify-between">
                          <div>
                            <span class="font-medium">Expiración de contraseña</span>
                            <p class="text-sm text-muted-foreground">Forzar cambio periódico</p>
                          </div>
                          <select class="rounded-md border px-3 py-1 bg-background">
                            <option>90 días</option>
                            <option>60 días</option>
                            <option>30 días</option>
                            <option>Nunca</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <!-- Trazas de actividad -->
                    <div>
                      <h5 class="text-md font-medium mb-3">Trazas de Actividad</h5>
                      <div class="rounded-md border">
                        <table class="w-full text-sm">
                          <thead>
                          <tr class="border-b bg-muted/50 font-medium">
                            <th class="h-10 px-4 text-left">Usuario</th>
                            <th class="h-10 px-4 text-left">Acción</th>
                            <th class="h-10 px-4 text-left">Fecha</th>
                            <th class="h-10 px-4 text-left">IP</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="(trace, index) in securityTraces" :key="index" class="border-b transition-colors hover:bg-muted/50">
                            <td class="p-4">{{ trace.user }}</td>
                            <td class="p-4">{{ trace.action }}</td>
                            <td class="p-4">{{ trace.date }}</td>
                            <td class="p-4">{{ trace.ip }}</td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="mt-2 text-xs text-muted-foreground">
                        Mostrando las últimas 5 actividades. <a href="#" class="text-primary hover:underline">Ver todas</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pestaña de apariencia -->
            <div v-if="activeTab === 'appearance'" class="space-y-4">
              <div class="rounded-lg border bg-card shadow-sm">
                <div class="p-6">
                  <h4 class="text-lg font-semibold">Configuración de Apariencia</h4>
                  <p class="text-sm text-muted-foreground">Personalice la apariencia de su sistema</p>

                  <div class="mt-6 space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <span class="font-medium">Tema</span>
                        <p class="text-sm text-muted-foreground">Seleccione el tema del sistema</p>
                      </div>
                      <select class="rounded-md border px-3 py-1 bg-background">
                        <option>Claro</option>
                        <option>Oscuro</option>
                        <option>Sistema</option>
                      </select>
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <span class="font-medium">Densidad</span>
                        <p class="text-sm text-muted-foreground">Ajuste la densidad de la interfaz</p>
                      </div>
                      <select class="rounded-md border px-3 py-1 bg-background">
                        <option>Compacta</option>
                        <option>Normal</option>
                        <option>Cómoda</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pestaña avanzada -->
            <div v-if="activeTab === 'advanced'" class="space-y-4">
              <div class="rounded-lg border bg-card shadow-sm">
                <div class="p-6">
                  <h4 class="text-lg font-semibold">Configuración Avanzada</h4>
                  <p class="text-sm text-muted-foreground">Configure ajustes avanzados del sistema</p>

                  <div class="mt-6 space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <span class="font-medium">Caché del sistema</span>
                        <p class="text-sm text-muted-foreground">Limpiar caché del sistema</p>
                      </div>
                      <button class="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground">
                        Limpiar caché
                      </button>
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <span class="font-medium">Respaldo de datos</span>
                        <p class="text-sm text-muted-foreground">Configurar respaldos automáticos</p>
                      </div>
                      <div class="flex items-center">
                        <input type="checkbox" id="backup" class="rounded border-gray-300 mr-2" checked />
                        <label for="backup">Activado</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gestión de Usuarios -->
        <div v-if="activeSection === 'users'" class="space-y-6">
          <div>
            <h3 class="text-lg font-medium">Gestión de Usuarios</h3>
            <p class="text-sm text-muted-foreground">Añada, edite y gestione usuarios en su sistema</p>
          </div>

          <div class="rounded-lg border bg-card shadow-sm">
            <div class="p-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div class="relative w-full sm:max-w-xs">
                  <span class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </span>
                  <input
                      type="search"
                      placeholder="Buscar usuarios..."
                      class="w-full rounded-md border pl-8 py-2 bg-background"
                      v-model="searchQuery"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <button class="rounded-md bg-muted px-3 py-2 text-sm font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
                    <span>Filtrar</span>
                  </button>
                  <button class="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M16 11h6"/></svg>
                    <span>Añadir Usuario</span>
                  </button>
                </div>
              </div>

              <div class="rounded-md border">
                <table class="w-full text-sm">
                  <thead>
                  <tr class="border-b bg-muted/50 font-medium">
                    <th class="h-10 px-4 text-left">Nombre</th>
                    <th class="h-10 px-4 text-left">Email</th>
                    <th class="h-10 px-4 text-left">Rol</th>
                    <th class="h-10 px-4 text-left">Estado</th>
                    <th class="h-10 px-4 text-left">Último Acceso</th>
                    <th class="h-10 px-4 text-left w-[50px]"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-if="filteredUsers.length === 0">
                    <td colspan="6" class="text-center py-6 text-muted-foreground">
                      No se encontraron usuarios que coincidan con su criterio de búsqueda
                    </td>
                  </tr>
                  <tr
                      v-for="user in filteredUsers"
                      :key="user.id"
                      class="border-b transition-colors hover:bg-muted/50"
                  >
                    <td class="p-4">{{ user.name }}</td>
                    <td class="p-4">{{ user.email }}</td>
                    <td class="p-4">
                        <span
                            :class="[
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            user.role === 'Administrador' ? 'bg-red-100 text-red-800' :
                            user.role === 'Gestor' ? 'bg-amber-100 text-amber-800' :
                            user.role === 'Editor' ? 'bg-green-100 text-green-800' :
                            user.role === 'Visualizador' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          ]"
                        >
                          {{ user.role }}
                        </span>
                    </td>
                    <td class="p-4">
                        <span
                            :class="[
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            user.status === 'Activo' ? 'bg-green-100 text-green-800' :
                            user.status === 'Inactivo' ? 'bg-gray-100 text-gray-800' :
                            'bg-amber-100 text-amber-800'
                          ]"
                        >
                          {{ user.status }}
                        </span>
                    </td>
                    <td class="p-4">{{ user.lastLogin }}</td>
                    <td class="p-4">
                      <div class="relative">
                        <button
                            @click="toggleDropdown(user.id)"
                            class="rounded-md p-1 hover:bg-muted"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                        </button>
                        <div
                            v-if="activeDropdown === user.id"
                            class="absolute right-0 z-10 mt-2 w-56 rounded-md border bg-background shadow-lg"
                        >
                          <div class="py-1 px-2 text-sm font-medium text-muted-foreground">Acciones</div>
                          <div class="py-1">
                            <a href="#" class="block px-4 py-2 text-sm hover:bg-muted">Editar usuario</a>
                            <a href="#" class="block px-4 py-2 text-sm hover:bg-muted">Gestionar permisos</a>
                            <div class="border-t my-1"></div>
                            <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-muted">Desactivar usuario</a>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <div class="flex items-center justify-between mt-4">
                <div class="text-xs text-muted-foreground">
                  Mostrando {{ filteredUsers.length }} de {{ users.length }} usuarios
                </div>
                <div class="flex items-center gap-2">
                  <button class="rounded-md border px-3 py-1 text-sm" disabled>
                    Anterior
                  </button>
                  <button class="rounded-md border px-3 py-1 text-sm">
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gestión de Roles -->
        <div v-if="activeSection === 'roles'" class="space-y-6">
          <div>
            <h3 class="text-lg font-medium">Gestión de Roles</h3>
            <p class="text-sm text-muted-foreground">Cree y gestione roles para definir niveles de acceso</p>
          </div>

          <div class="rounded-lg border bg-card shadow-sm">
            <div class="p-6">
              <div class="flex flex-row items-center justify-between mb-4">
                <div>
                  <h4 class="text-lg font-semibold">Roles del Sistema</h4>
                  <p class="text-sm text-muted-foreground">Defina roles y sus permisos asociados</p>
                </div>
                <button class="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  Añadir Rol
                </button>
              </div>

              <div class="rounded-md border">
                <table class="w-full text-sm">
                  <thead>
                  <tr class="border-b bg-muted/50 font-medium">
                    <th class="h-10 px-4 text-left">Nombre del Rol</th>
                    <th class="h-10 px-4 text-left">Descripción</th>
                    <th class="h-10 px-4 text-left">Usuarios</th>
                    <th class="h-10 px-4 text-left">Permisos</th>
                    <th class="h-10 px-4 text-left">Creado</th>
                    <th class="h-10 px-4 text-left w-[50px]"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="role in roles" :key="role.id" class="border-b transition-colors hover:bg-muted/50">
                    <td class="p-4 font-medium">{{ role.name }}</td>
                    <td class="p-4 text-muted-foreground">{{ role.description }}</td>
                    <td class="p-4">{{ role.users }}</td>
                    <td class="p-4">{{ role.permissions }}</td>
                    <td class="p-4">{{ role.createdAt }}</td>
                    <td class="p-4">
                      <div class="relative">
                        <button
                            @click="toggleRoleDropdown(role.id)"
                            class="rounded-md p-1 hover:bg-muted"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                        </button>
                        <div
                            v-if="activeRoleDropdown === role.id"
                            class="absolute right-0 z-10 mt-2 w-56 rounded-md border bg-background shadow-lg"
                        >
                          <div class="py-1 px-2 text-sm font-medium text-muted-foreground">Acciones</div>
                          <div class="py-1">
                            <a href="#" class="block px-4 py-2 text-sm hover:bg-muted flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                              Editar Rol
                            </a>
                            <a href="#" class="block px-4 py-2 text-sm hover:bg-muted flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 9h1"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>
                              Editar Permisos
                            </a>
                            <div class="border-t my-1"></div>
                            <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-muted flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                              Eliminar Rol
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <div class="mt-4 text-xs text-muted-foreground">
                Total de roles: {{ roles.length }}
              </div>
            </div>
          </div>
        </div>

        <!-- Gestión de Permisos -->
        <div v-if="activeSection === 'permissions'" class="space-y-6">
          <div>
            <h3 class="text-lg font-medium">Gestión de Permisos</h3>
            <p class="text-sm text-muted-foreground">Configure permisos basados en roles para recursos del sistema</p>
          </div>

          <div class="rounded-lg border bg-card shadow-sm">
            <div class="p-6">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h4 class="text-lg font-semibold">Matriz de Permisos</h4>
                  <p class="text-sm text-muted-foreground">Defina qué puede hacer cada rol dentro del sistema</p>
                </div>
                <div class="flex items-center gap-2">
                  <select class="rounded-md border px-3 py-2 bg-background">
                    <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
                  </select>
                  <button class="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Guardar Cambios
                  </button>
                </div>
              </div>

              <div class="rounded-md border overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                  <tr class="border-b bg-muted/50">
                    <th class="h-10 w-[200px] px-4 text-left font-medium">Recurso</th>
                    <th v-for="action in permissionActions" :key="action.id" class="h-10 px-4 text-center font-medium">
                      {{ action.name }}
                    </th>
                    <th class="h-10 w-[50px]"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="resource in permissionResources" :key="resource.id" class="border-b transition-colors hover:bg-muted/50">
                    <td class="p-4">
                      <div class="flex items-center gap-2">
                        <component :is="resource.icon" class="h-4 w-4 text-muted-foreground" />
                        <span class="font-medium">{{ resource.name }}</span>
                      </div>
                    </td>
                    <td v-for="action in permissionActions" :key="action.id" class="p-4 text-center">
                      <input
                          type="checkbox"
                          :id="`${resource.id}-${action.id}`"
                          class="rounded border-gray-300"
                          :checked="isPermissionChecked(resource.id, action.id)"
                      />
                    </td>
                    <td class="p-4">
                      <button class="rounded-md p-1 hover:bg-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      </button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <div class="flex items-center justify-between mt-4">
                <div class="text-xs text-muted-foreground flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  Editando permisos para: <span class="font-medium">Administrador</span>
                </div>
                <div class="text-xs text-amber-500">Tiene cambios sin guardar</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gestión de Notificaciones -->
        <div v-if="activeSection === 'notifications'" class="space-y-6">
          <div>
            <h3 class="text-lg font-medium">Configuración de Notificaciones</h3>
            <p class="text-sm text-muted-foreground">Administre cómo y cuándo recibe notificaciones</p>
          </div>

          <div class="space-y-4">
            <div class="flex space-x-1 rounded-lg bg-muted p-1">
              <button
                  v-for="tab in notificationTabs"
                  :key="tab.id"
                  @click="activeNotificationTab = tab.id"
                  :class="[
                  'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                  activeNotificationTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                ]"
              >
                {{ tab.name }}
              </button>
            </div>

            <!-- Configuración de notificaciones -->
            <div v-if="activeNotificationTab === 'settings'" class="space-y-4">
              <div class="rounded-lg border bg-card shadow-sm">
                <div class="p-6">
                  <h4 class="text-lg font-semibold">Notificaciones por Email</h4>
                  <p class="text-sm text-muted-foreground">Configure qué emails recibe</p>

                  <div class="mt-6 space-y-4">
                    <div v-for="(setting, index) in emailSettings" :key="index" class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <component :is="setting.icon" class="h-4 w-4 text-muted-foreground" />
                        <div class="grid gap-0.5">
                          <div class="font-medium">{{ setting.title }}</div>
                          <div class="text-xs text-muted-foreground">{{ setting.description }}</div>
                        </div>
                      </div>
                      <div class="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                        <input
                            type="checkbox"
                            :id="`email-${index}`"
                            class="peer h-0 w-0 opacity-0"
                            :checked="setting.enabled"
                        />
                        <span
                            :class="[
                            'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-all',
                            setting.enabled ? 'translate-x-5 bg-primary' : ''
                          ]"
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="rounded-lg border bg-card shadow-sm">
                <div class="p-6">
                  <h4 class="text-lg font-semibold">Notificaciones en la Aplicación</h4>
                  <p class="text-sm text-muted-foreground">Configure qué notificaciones aparecen en el sistema</p>

                  <div class="mt-6 space-y-4">
                    <div v-for="(setting, index) in appSettings" :key="index" class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <component :is="setting.icon" class="h-4 w-4 text-muted-foreground" />
                        <div class="grid gap-0.5">
                          <div class="font-medium">{{ setting.title }}</div>
                          <div class="text-xs text-muted-foreground">{{ setting.description }}</div>
                        </div>
                      </div>
                      <div class="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                        <input
                            type="checkbox"
                            :id="`app-${index}`"
                            class="peer h-0 w-0 opacity-0"
                            :checked="setting.enabled"
                        />
                        <span
                            :class="[
                            'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-all',
                            setting.enabled ? 'translate-x-5 bg-primary' : ''
                          ]"
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <button class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                  Guardar Configuración
                </button>
              </div>
            </div>

            <!-- Centro de notificaciones -->
            <div v-if="activeNotificationTab === 'notifications'" class="space-y-4">
              <div class="rounded-lg border bg-card shadow-sm">
                <div class="p-6">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 class="text-lg font-semibold">Centro de Notificaciones</h4>
                      <p class="text-sm text-muted-foreground">Vea y gestione sus notificaciones del sistema</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <button class="rounded-md border px-3 py-2 text-sm font-medium flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M13.73 21a9.97 9.97 0 0 1-10.42-9.78A10 10 0 0 1 13.27 3h.23a10 10 0 0 1 7.95 16"/><path d="m9 11 3 3L22 4"/></svg>
                        Marcar Todo como Leído
                      </button>
                      <button class="rounded-md border px-3 py-2 text-sm font-medium">
                        Limpiar Todo
                      </button>
                    </div>
                  </div>

                  <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-muted-foreground/50"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                    <h3 class="mt-4 text-lg font-medium">No hay notificaciones</h3>
                    <p class="mt-2 text-sm text-muted-foreground">
                      ¡Está al día! No hay nuevas notificaciones para mostrar.
                    </p>
                  </div>

                  <div v-else class="space-y-4">
                    <div
                        v-for="(notification, index) in notifications"
                        :key="index"
                        :class="[
                        'flex items-start gap-4 rounded-lg border p-4',
                        !notification.read ? 'bg-muted/50' : ''
                      ]"
                    >
                      <div
                          :class="[
                          'rounded-full p-2',
                          !notification.read ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        ]"
                      >
                        <component :is="notification.icon" class="h-4 w-4" />
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center justify-between">
                          <h4 class="text-sm font-medium">{{ notification.title }}</h4>
                          <span class="text-xs text-muted-foreground">{{ notification.time }}</span>
                        </div>
                        <p class="mt-1 text-sm text-muted-foreground">{{ notification.description }}</p>
                      </div>
                      <div v-if="!notification.read" class="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gestión de Comites y Nucleos -->

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Estado de la aplicación
const activeSection = ref('general')
const activeTab = ref('overview')
const activeNotificationTab = ref('settings')
const searchQuery = ref('')
const activeDropdown = ref(null)
const activeRoleDropdown = ref(null)

// Elementos de navegación
const navigationItems = [
  { id: 'general', title: 'General' },
  { id: 'users', title: 'Gestión de Usuarios' },
  { id: 'roles', title: 'Roles' },
  { id: 'permissions', title: 'Permisos'},
  { id: 'notifications', title: 'Notificaciones' },
  { id: 'comites', title: 'Cómite CUJAE'},
]

// Pestañas
const tabs = [
  { id: 'overview', name: 'Resumen' },
  { id: 'security', name: 'Seguridad' },
  { id: 'appearance', name: 'Apariencia' },
  { id: 'advanced', name: 'Avanzado' },
]

// Pestañas de notificaciones
const notificationTabs = [
  { id: 'settings', name: 'Configuración' },
  { id: 'notifications', name: 'Notificaciones' },
]

// Datos de estadísticas del sistema
const systemStats = [
  { title: 'Usuarios Activos', value: '243' },
  { title: 'Actas RO', value: '568' },
  { title: 'Actas CP', value: '456' },
  { title: 'Roles', value: '5' },
  { title: 'Conjuntos de Permisos', value: '12' },
  { title: 'Tiempo de Actividad', value: '99.8%' },
]

// Actividades recientes
const recentActivities = [
  {
    title: 'Rol de Usuario Actualizado',
    description: 'Los permisos del rol Editor de Marketing fueron actualizados',
    time: 'Hace 2 horas',
  },
  {
    title: 'Nuevo Usuario Añadido',
    description: 'Sara Jiménez fue añadida al sistema',
    time: 'Ayer a las 15:45',
  },
  {
    title: 'Cambio de Permisos',
    description: 'Permiso de eliminación de documentos añadido a Gestores',
    time: 'Hace 2 días',
  },
  {
    title: 'Respaldo del Sistema',
    description: 'Respaldo automático del sistema completado con éxito',
    time: 'Hace 3 días',
  },
]

// Trazas de seguridad
const securityTraces = [
  {
    user: 'admin@ejemplo.com',
    action: 'Inicio de sesión',
    date: 'Hoy, 14:32',
    ip: '192.168.1.105',
  },
  {
    user: 'maria@ejemplo.com',
    action: 'Cambio de permisos',
    date: 'Hoy, 11:15',
    ip: '192.168.1.120',
  },
  {
    user: 'juan@ejemplo.com',
    action: 'Documento eliminado',
    date: 'Ayer, 16:45',
    ip: '192.168.1.110',
  },
  {
    user: 'admin@ejemplo.com',
    action: 'Usuario creado',
    date: 'Ayer, 10:20',
    ip: '192.168.1.105',
  },
  {
    user: 'carlos@ejemplo.com',
    action: 'Intento de acceso fallido',
    date: '15/05/2023, 09:30',
    ip: '192.168.1.130',
  },
]

// Usuarios
const users = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@ejemplo.com',
    role: 'Administrador',
    status: 'Activo',
    lastLogin: 'Hoy a las 14:34',
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria.garcia@ejemplo.com',
    role: 'Gestor',
    status: 'Activo',
    lastLogin: 'Ayer a las 11:20',
  },
  {
    id: '3',
    name: 'Miguel Rodríguez',
    email: 'miguel.rodriguez@ejemplo.com',
    role: 'Editor',
    status: 'Inactivo',
    lastLogin: '4 de mayo, 2023',
  },
  {
    id: '4',
    name: 'Sara Martínez',
    email: 'sara.martinez@ejemplo.com',
    role: 'Visualizador',
    status: 'Activo',
    lastLogin: 'Hoy a las 9:15',
  },
  {
    id: '5',
    name: 'David López',
    email: 'david.lopez@ejemplo.com',
    role: 'Invitado',
    status: 'Pendiente',
    lastLogin: 'Nunca',
  },
]

// Roles
const roles = [
  {
    id: '1',
    name: 'Administrador',
    description: 'Acceso completo al sistema con todos los permisos',
    users: 2,
    permissions: 'Todos los permisos (32)',
    createdAt: '15 de enero, 2023',
  },
  {
    id: '2',
    name: 'Gestor',
    description: 'Puede gestionar contenido y usuarios pero no modificar configuraciones del sistema',
    users: 5,
    permissions: 'Permisos limitados (24)',
    createdAt: '3 de febrero, 2023',
  },
  {
    id: '3',
    name: 'Editor',
    description: 'Puede crear y editar documentos pero no eliminarlos',
    users: 12,
    permissions: 'Permisos de edición de contenido (16)',
    createdAt: '20 de marzo, 2023',
  },
  {
    id: '4',
    name: 'Visualizador',
    description: 'Acceso de solo lectura a documentos y contenido',
    users: 28,
    permissions: 'Permisos de solo vista (8)',
    createdAt: '5 de abril, 2023',
  },
  {
    id: '5',
    name: 'Invitado',
    description: 'Acceso limitado solo a documentos compartidos',
    users: 7,
    permissions: 'Permisos mínimos (4)',
    createdAt: '12 de mayo, 2023',
  },
]

// Recursos de permisos
const permissionResources = [
  { id: 'documents', name: 'Documentos' },
  { id: 'folders', name: 'Carpetas' },
  { id: 'templates', name: 'Plantillas' },
  { id: 'sharing', name: 'Compartir' },
]

// Acciones de permisos
const permissionActions = [
  { id: 'view', name: 'Ver' },
  { id: 'create', name: 'Crear' },
  { id: 'edit', name: 'Editar' },
  { id: 'delete', name: 'Eliminar' },
  { id: 'share', name: 'Compartir' },
  { id: 'export', name: 'Exportar' },
]

// Configuración de notificaciones por email
const emailSettings = [
  {
    title: 'Adición de Usuario',
    description: 'Recibir emails cuando se añaden nuevos usuarios',
    enabled: true,
  },
  {
    title: 'Cambios de Rol',
    description: 'Recibir emails cuando se modifican roles de usuario',
    enabled: true,
  },
  {
    title: 'Documento Compartido',
    description: 'Recibir emails cuando se comparten documentos contigo',
    enabled: true,
  },
  {
    title: 'Cambios de Permisos',
    description: 'Recibir emails cuando se modifican permisos',
    enabled: true,
  },
]

// Configuración de notificaciones en la aplicación
const appSettings = [
  {
    title: 'Adición de Usuario',
    description: 'Mostrar notificaciones cuando se añaden nuevos usuarios',
    enabled: true,
  },
  {
    title: 'Cambios de Rol',
    description: 'Mostrar notificaciones cuando se modifican roles de usuario',
    enabled: true,
  },
  {
    title: 'Actualizaciones del Sistema',
    description: 'Mostrar notificaciones para actualizaciones y mantenimiento del sistema',
    enabled: true,
  },
]

// Notificaciones
const notifications = [
  {
    id: '1',
    title: 'Usuario Añadido',
    description: 'Juan Pérez añadió a Sara Martínez al sistema',
    time: 'Ahora mismo',
    read: false,
  },
  {
    id: '2',
    title: 'Permiso Cambiado',
    description: 'Admin cambió permisos de visualización para la carpeta Marketing',
    time: 'Hace 5 minutos',
    read: false,
  },
  {
    id: '3',
    title: 'Documento Compartido',
    description: 'Informe de Marketing Q2 ha sido compartido contigo',
    time: 'Hace 1 hora',
    read: true,
  },
  {
    id: '4',
    title: 'Rol Actualizado',
    description: 'Tu rol ha sido actualizado a Editor',
    time: 'Ayer',
    read: true,
  },
]

// Filtrar usuarios basado en la búsqueda
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users
  return users.filter(
      user =>
          user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Verificar si un permiso está marcado
const isPermissionChecked = (resourceId, actionId) => {
  // Simulación - en una aplicación real, esto vendría de los datos del backend
  const adminPermissions = {
    documents: ['view', 'create', 'edit', 'delete', 'share', 'export'],
    folders: ['view', 'create', 'edit', 'delete', 'share'],
    templates: ['view', 'create', 'edit', 'delete', 'share', 'export'],
    sharing: ['view', 'create', 'edit', 'delete'],
  }

  return adminPermissions[resourceId]?.includes(actionId) || false
}

// Funciones para manejar dropdowns
const toggleDropdown = (id) => {
  activeDropdown.value = activeDropdown.value === id ? null : id
}

const toggleRoleDropdown = (id) => {
  activeRoleDropdown.value = activeRoleDropdown.value === id ? null : id
}
</script>

<style>
/* Estilos adicionales si son necesarios */
</style>