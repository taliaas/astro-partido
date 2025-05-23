import { actions } from "astro:actions";
import { getSession } from "auth-astro/server";
import { onBeforeMount, ref, computed, onMounted } from "vue";

function hasPermissions(module: string, action: string, claims: any[]) {
  const check = claims.some(
    (claim: any) =>
      claim.module === module &&
      Array.isArray(claim.actions) &&
      claim.actions.includes(action)
  );
  console.log(check, module, action, claims);

  return check;
}

export async function hasServerPermissions(
  module: string,
  action: string,
  request: Request
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
  return function check(module: string, action: string) {
    if (!user.value) return false;
    return hasPermissions(module, action, user.value.role.claims ?? []);
  };
}
