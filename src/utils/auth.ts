import { actions } from "astro:actions";
import { getSession } from "auth-astro/server";
import { onBeforeMount, ref } from "vue";

export const modules = [
  "Documentos",
  "Análisis",
  "Reportes",
  "Usuarios",
  "Militantes",
  "Núcleos",
  "Procesos",
] as const;
export type Module = (typeof modules)[number];

export type PermissionAction = (typeof permissionActions)[number]["id"];
export const permissionActions = [
  { id: "create", name: "Crear" },
  { id: "update", name: "Editar" },
  { id: "delete", name: "Eliminar" },
  { id: "read", name: "Ver" },
  { id: "export", name: "Exportar" },
  { id: "all", name: "Todo" },
] as const;

function hasPermissions(module: string, action: string, claims: any[]) {
  const check = claims.some(
    (claim: any) =>
      claim.module === module &&
      Array.isArray(claim.actions) &&
      claim.actions.includes(action),
  )
  return check;
}

export async function hasServerPermissions(
  module: Module,
  action: PermissionAction,
  request: Request,
) {
  const session = await getSession(request);
  if (!session) return false;
  return hasPermissions(module, action, (session?.user as any).claims ?? []);
}

export function usePermissions() {
  const user = ref<any>(null);
  onBeforeMount(async () => {
    const { data, error } = await actions.auth.me();
    if (!error && data) {
      user.value = data;
    }
  });
  return function check(module: Module, action: PermissionAction) {
    if (!user.value) return false;
    return hasPermissions(module, action, user.value.role?.claims ?? []);
  };
}
