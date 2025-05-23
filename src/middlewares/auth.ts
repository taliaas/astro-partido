import { defineMiddleware } from "astro:middleware";
import { getSession } from "auth-astro/server";

const matches = ["/login", "register", "/password"];

export const authMiddleware = defineMiddleware(async (ctx, next) => {
  const session = await getSession(ctx.request);
  const pathname = ctx.url.pathname;

  // Protect auth routes when authenticated
  if (session && matches.some((route) => pathname.startsWith(route))) {
    return ctx.redirect("/home");
  }

  return next();
});
