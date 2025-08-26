import type { APIRoute } from "astro";
import { API_URL } from "astro:env/client";

export const GET: APIRoute = (ctx) => {
    return fetch(API_URL + "/sse", { headers: ctx.request.headers, keepalive: true })
}