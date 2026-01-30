import { API_URL } from "astro:env/client";

export default class TrazasService {
  async getAllUsers(jwt: any) {
    try {
      const response = await fetch(`${API_URL}/log/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }
  async getAllModules(jwt: any) {
    try {
      const response = await fetch(`${API_URL}/log/modules`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  async getAllLogs(
    page: number,
    limit: number,
    user: string,
    action: string,
    module: string,
    date: string,
    order: "ASC" | "DESC",
    token: any,
  ) {
    const searchParam = new URLSearchParams();
    if (page) searchParam.set("page", page + "");
    if (limit) searchParam.set("limit", limit + "");
    if (user) searchParam.set("user", user);
    if (order) searchParam.set("order", order);
    if (action) searchParam.set("action", action);
    if (module) searchParam.set("module", module);
    if (date) searchParam.set("dae", date);
    try {
      const response = await fetch(`${API_URL}/log?` + searchParam.toString(), {
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
      console.error("Fetch error:", error);
      throw error;
    }
  }

  async getLogById(id: string) {
    try {
      const response = await fetch(`${API_URL}/log/${id}`, {
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
      console.error("Fetch error:", error);
      throw error;
    }
  }
}
