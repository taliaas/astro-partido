import type {
  LiteralUnion,
  SignInOptions,
  SignInAuthorizationParams,
  SignOutParams,
} from "next-auth/react";
import type {
  BuiltInProviderType,
  RedirectableProviderType,
} from "@auth/core/providers";

interface AstroSignInOptions extends SignInOptions {
  /** The base path for authentication (default: /api/auth) */
  prefix?: string;
}

interface AstroSignOutParams extends SignOutParams {
  /** The base path for authentication (default: /api/auth) */
  prefix?: string;
}

/**
 * Client-side method to initiate a signin flow
 * or send the user to the signin page listing all possible providers.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://authjs.dev/reference/utilities/#signin)
 */
export async function signIn<
  P extends RedirectableProviderType | undefined = undefined,
>(
  providerId?: LiteralUnion<
    P extends RedirectableProviderType
      ? P | BuiltInProviderType
      : BuiltInProviderType
  >,
  options?: AstroSignInOptions,
  authorizationParams?: SignInAuthorizationParams,
) {
  const { callbackUrl = window.location.href, redirect = true } = options ?? {};
  const { prefix = "/api/auth", ...opts } = options ?? {};

  // TODO: Support custom providers
  const isCredentials = providerId === "credentials";
  const isEmail = providerId === "email";
  const isSupportingReturn = isCredentials || isEmail;

  // TODO: Handle custom base path
  const signInUrl = `${prefix}/${isCredentials ? "callback" : "signin"}/${providerId}`;

  const _signInUrl = `${signInUrl}?${new URLSearchParams(authorizationParams)}`;

  // TODO: Handle custom base path
  const csrfTokenResponse = await fetch(`${prefix}/csrf`);
  const { csrfToken } = await csrfTokenResponse.json();

  const res = await fetch(_signInUrl, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
    },
    // @ts-expect-error -- ignore
    body: new URLSearchParams({
      ...opts,
      csrfToken,
      callbackUrl,
    }),
  });

  return res;
}
