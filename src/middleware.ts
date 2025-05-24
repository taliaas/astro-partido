import { routesMiddleware } from "@/middlewares/routes";
import { sequence } from "astro:middleware";

export const onRequest = sequence(routesMiddleware)