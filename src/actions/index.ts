import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import AuthService from "@/services/AuthService.ts";

export const server = {
  login: defineAction({
    input: z.object({
      email: z.string().email(),
      password: z.string().length(8),
    }),
    async handler(user, ctx) {
      const service = new AuthService();
      const token = await service.login(user);
      ctx.cookies.set("access_token", token, {
        path: "/",
      });
    },
  }),

  logout: defineAction({
    async handler(ctx){
      ctx.cookies.delete("access_token", {
        path: "/",
      })
    }
  }),

  verify: defineAction({
    async handler(ctx) {
      const token = ctx.cookies.get("access_token") as string;
      console.log(token)
      if (!token) throw new Error("Unauthorized");
      const service = new AuthService();
      const user = await service.profile(token);
      if (!user) throw new Error("Unauthorized");
    },
  }),
};
