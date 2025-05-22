import { ActionError, defineAction } from "astro:actions";
import { API_URL } from "astro:env/server";
import { z } from "astro:schema";
import { getSession } from "auth-astro/server";

export const updateRole = defineAction({
    input: z.object({
        id: z.string(), data: z.any()
    }),
    handler: async ({ id, data }, context) => {
        const session = await getSession(context.request);
        if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.jwt}`,
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
});