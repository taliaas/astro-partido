import { ActionError, defineAction } from "astro:actions";
import { API_URL } from "astro:env/client";
import { z } from "zod";
import { getSession } from "auth-astro/server";

export const register = defineAction({
  input: z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string(),
    role: z.string().optional(),
  }),
  async handler({ email, name, password, role }, context) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, password, role }),
    });
    if (res.status === 409) {
      throw new ActionError({
        code: "CONFLICT",
        message: `User with email ${email} already exists`,
      });
    }
    const data = await res.json();
    if (res.status === 404) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: data.message,
      });
    }
    if (!res.ok) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: data.message,
      });
    }
    return data;
  },
});

export const recoverPassword = defineAction({
  input: z.object({
    email: z.string().email(),
  }),
  async handler({ email }, context) {
    const res = await fetch(`${API_URL}/auth/recover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.status === 404) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: data.message,
      });
    }
    if (!res.ok) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: data.message,
      });
    }
    return data;
  },
});

export const profile = defineAction({
  async handler(_, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(`${API_URL}/auth/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.jwt}`,
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const { user } = await res.json();
    return user;
  },
});

export const updatePassword = defineAction({
  input: z
    .object({
      prev_pw: z.string(),
      new_pw: z.string(),
    })
    .refine(({ new_pw, prev_pw }) => prev_pw !== new_pw, {
      message: "New password must be different from the previous one",
    }),
  async handler(input, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(
      `${API_URL}/auth/${session?.user?.id}/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      }
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  },
});

export const updateProfile = defineAction({
  input: z.object({
    email: z.string().email().optional(),
    name: z.string().optional(),
  }),
  async handler(input, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(`${API_URL}/user/${session.user?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.jwt}`,
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const y = await res.json();
    console.log(y);
    return y;
  },
});

export const me = defineAction({
  async handler(_, context) {
    const session: any = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    return session.user;
  },
});
