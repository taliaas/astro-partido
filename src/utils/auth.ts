import type { roleEnum } from "@/enum/roleEnum";

export const modules = [
  "Documentos",
  "Análisis",
  "Reportes",
  "Usuarios",
  "Militantes",
  "Núcleos",
  "Procesos",
  "Eventos"
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

export function hasPermissions(module: string, action: string, claims: any[]) {
  const check = claims.some(
    (claim: any) =>
      claim.module === module &&
      Array.isArray(claim.actions) &&
      claim.actions.includes(action),
  )
  return check;
}

export function hasRoles(roles: roleEnum[], user: any) {
  const role = user?.role?.name
  return roles.includes(role as roleEnum);
}




