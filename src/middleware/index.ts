import { routesMiddleware } from "@/middleware/routes";
import { sequence } from "astro:middleware";

export const onRequest = sequence(routesMiddleware)