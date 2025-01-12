import {actions} from "astro:actions";

export async function isAuthenticated(callAction: Function) {
  try {
    await callAction(actions.verify)
    return true;
  } catch(e) {
    console.error(e)
    return false;
  }
}

