import { hasPermissions, type Module, type PermissionAction } from "@/utils/auth";
import { getSession } from "auth-astro/server";

export async function hasServerPermissions(
    module: Module,
    action: PermissionAction,
    request: Request,
) {
    const session = await getSession(request);
    if (!session) return false;
    return hasPermissions(module, action, (session?.user as any).claims ?? []);
}