import { ActionError, defineAction } from "astro:actions";
import { API_URL } from "astro:env/client";
import { z } from "astro:schema";
import { getSession } from "auth-astro/server";

    export const updateComputo = defineAction({
        input: z.object({
           id: z.string(), 
           data: z.object({})
        }),
        async handler({id, data}, context){
           const session: any = await getSession(context.request);
               if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
           
               const res = await fetch(`${API_URL}/computo/${id}`, {
                 method: "PATCH",
                 headers: {
                   "Content-Type": "application/json",
                   Authorization: `Bearer ${session?.jwt}`,
                 },
                 body: JSON.stringify(data),
               });
               if (!res.ok) {
                 throw new Error(`HTTP error! status: ${res.status}`);
               }
               return await res.json();
             },
    })