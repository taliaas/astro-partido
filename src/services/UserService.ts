import { API_URL } from "astro:env/client";

export default class UserService {
  async getAllUser(
    page: number,
    token: string,
    name: string,
    email: string,
    core: string,
    order: string,
    status: string,
    role: string
  ) {
    const searchParam = new URLSearchParams();
    if (page) searchParam.set("page", page + "");
    if (order) searchParam.set("order", order);
    if (name) searchParam.set("name", name);
    if (core) searchParam.set("core", core);
    if (status) searchParam.set("status", status);
    if (role) searchParam.set("role", role);
    if (email) searchParam.set("fecha", email);

    const url = `${API_URL}/user/all?` + searchParam.toString();
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUser(id: string) {
    try {
      const response = await fetch(`${API_URL}/user/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al recuperar al usuario", error);
      throw error;
    }
  }

  async getUserByEmail(token: string) {
    try {
      const response = await fetch(`${API_URL}/auth/verify/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al recuperar al usuario", error);
      throw error;
    }
  }
}
