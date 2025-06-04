import { type Module, type PermissionAction, hasPermissions } from "@/utils/auth";
import { actions } from "astro:actions";
import { onBeforeMount, ref } from "vue";

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