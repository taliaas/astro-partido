import { ActionError, defineAction } from "astro:actions";
import { API_URL } from "astro:env/client";
import { z } from "zod";
import { getSession } from "auth-astro/server";
import { MinuteMode, MinuteType } from "@/enum/roleEnum";

export const updateCore = defineAction({
  input: z.object({
    coreId: z.number(),
    minuteId: z.number(),
  }),
  async handler({ coreId, minuteId }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(
      `http://localhost:5000/minutes-ordinary/updateCore/${minuteId}/${coreId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.jwt}`,
        },
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new ActionError({ code: "UNAUTHORIZED", message: data.message });
    }
    return data;
  },
});

export const updateStatusMinutes = defineAction({
  input: z.object({
    id: z.string(),
    status: z.string(),
  }),
  async handler({ id, status }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const response = await fetch(
      `${API_URL}/minutes-ordinary/status/${id}/${status}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },
});

export const processMinute = defineAction({
  accept: "form",
  input: z.object({ file: z.instanceof(File) }),
  handler({ file }, context) {},
});
