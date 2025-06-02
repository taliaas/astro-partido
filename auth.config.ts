import Credentials from "@auth/core/providers/credentials";
import { API_URL } from "astro:env/client";
import { defineConfig } from "auth-astro";

export default defineConfig({
  trustHost: true,

  pages: {
    signIn: "/login",
    newUser: "/home",
    error: "/login",
    signOut: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        rememberMe: {}
      },
      async authorize(credentials) {
        console.log(credentials)
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        const data = await res.json();
        return { ...data.user, jwt: data.token };
      },
    }),
  ],
  callbacks: {
    jwt({ user, token }: { user?: any; token: any }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session({ token, session }) {
      const user = token.user as any;
      return {
        ...session,
        jwt: user.jwt,
        user,
      };
    },
  },
});
