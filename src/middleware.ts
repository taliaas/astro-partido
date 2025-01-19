import { defineMiddleware } from "astro:middleware";
import { getSession } from "auth-astro/server";

const unprotectedRoutes = ["/help"]

export const onRequest = defineMiddleware(async (ctx, next) => {
    const session = await getSession(ctx.request)
    const pathname = ctx.url.pathname

    // Protect auth routes when authenticated
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        if (session)
            return ctx.redirect("/home")
        return next()
    }

    // Protect routes, excepts those that start with unprotectedRoutes strings and / (root route)
    if (!session && unprotectedRoutes.every(route => !pathname.startsWith(route)) && pathname !== "/" && !pathname.startsWith("/api"))
        return ctx.redirect("/login")

    return next()
})