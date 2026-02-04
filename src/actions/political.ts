import { ActionError, defineAction } from "astro:actions";
import { API_URL } from "astro:env/client";
import { z } from "zod";
import { getSession } from "auth-astro/server";
import { MinuteMode, MinuteType } from "@/enum/roleEnum";

export const createMinute = defineAction({
  input: z.object({
    data: z.any(),
    type: z.enum(MinuteType),
    mode: z.enum(MinuteMode),
  }),
  async handler({ data, type, mode, ...rest }, context) {
    console.log(data);

    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    console.log(data);

    const res = await fetch(
      `${API_URL}/minute/create?type=${type}&mode=${mode}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        },
        body: JSON.stringify({
          ...data,
          political_development: data.development,
          ...rest,
        }),
      },
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },
});

export const updateMinute = defineAction({
  input: z.object({
    id: z.coerce.string(),
    data: z.any(),
  }),
  async handler({ id, data }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/minute/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
      body: JSON.stringify({
        ...data,
        political_development: data.development,
      }),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
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
      `${API_URL}/minutes-political/status/${id}/${status}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        },
      },
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

export const generateResumen = defineAction({
  input: z.object({
    id: z.coerce.string(),
  }),
  async handler({ id }, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(`${API_URL}/minute/resumen/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.text();
  },
});
