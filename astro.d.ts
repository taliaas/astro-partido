import type { Session as LegacySession } from "@auth/core/types";

type Session = LegacySession & {
    jwt: string
};

declare module "auth-astro/server" {
  export function getSession(request: Request): Promise<Session | null>;
}
