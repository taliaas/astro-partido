import { ActionError, defineAction } from "astro:actions";
import { API_URL } from "astro:env/server";
import { z } from "astro:schema";
import { getSession } from "auth-astro/server";

export const register = defineAction({
  input: z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string(),
    role: z.string().optional(),
  }),
  async handler(input, context) {
    console.log(`${API_URL}/auth/register`)
    const res = await fetch(`http://localhost:5000/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    if (res.status === 409) {
      throw new ActionError({
        code: "CONFLICT",
        message: `User with email ${input.email} already exists`,
      });
    }
    if (!res.ok) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: `HTTP error! status: ${res.status}`,
      });
    }
    return res.json();
  },
});

export const profile = defineAction({
  async handler(_, context) {
    const session = await getSession(context.request);
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
    const session = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });
    const res = await fetch(
      `https://part-back.onrender.com/auth/${session?.user?.id}/change-password`,
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
    const session = await getSession(context.request);
    if (!session) throw new ActionError({ code: "UNAUTHORIZED" });

    const res = await fetch(`${API_URL}/user/${session.user?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  },
});
