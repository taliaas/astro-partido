import {actions} from "astro:actions";

export function getAccessToken() {
  return localStorage.getItem("access_token");
}

export function removeToken() {
  return coo("access_token");
}

export async function isAuthenticated(callAction: Function) {
  console.log("Entro")
  try {
    await callAction(actions.verify)
    return true;
  } catch(e) {
    console.error(e)
    return false;
  }
}

export function saveToken(token: string) {
  localStorage.setItem("access_token", token);
}
