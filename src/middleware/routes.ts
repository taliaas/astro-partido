import { defineMiddleware } from "astro:middleware";
import { getSession } from "auth-astro/server";

const bypassProtection = [
  "/login",
  "/register",
  "/password",
  "/",
  "/help",
  "/condition",
  "/errors/401",
  "/errors/403"

];

const authRoutes = ["/login", "/register"];

export const routesMiddleware = defineMiddleware(async (ctx, next) => {
  if (ctx.url.pathname.startsWith("/api") || ctx.url.pathname.startsWith("/_actions")) return next();
  const session = await getSession(ctx.request);
  if (session && authRoutes.some((route) => ctx.url.pathname === route)) {
    return ctx.redirect("/home");
  }
  if (!session && !bypassProtection.some((route) => ctx.url.pathname === route))
    return ctx.redirect("/login");
  return next();
});
