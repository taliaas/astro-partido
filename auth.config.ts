import Credentials from "@auth/core/providers/credentials";
import { defineConfig } from "auth-astro";

const API_URL = "https://part-back.onrender.com/auth/login";

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
      },
      async authorize(credentials) {
        const res = await fetch(API_URL, {
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
        return data.user;
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
