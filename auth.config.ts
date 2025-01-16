// auth.config.ts
import { defineConfig } from "auth-astro";
import Credentials from "@auth/core/providers/credentials";

export default defineConfig({
  secret: "partidoCujaeComiteS",
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize({ email, password }) {
        const res = await fetch(`https://part-back.onrender.com/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) return null
        const data = await res.json();
        return data ?? null;
      },
    }),
  ],
});
