import { authMiddleware } from "@/middlewares/auth";
import { sequence } from "astro:middleware";

export const onRequest = sequence(authMiddleware)