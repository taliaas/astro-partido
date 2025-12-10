import { API_URL } from "astro:env/client";

export default class MinutesService {
  async getAllMinutes(
    type?: string,
    page?: number,
    limit?: string,
    session?: any,
    order?: any,
    name?: string,
    core?: string,
    status?: string,
    fecha?: string
  ) {
    const searchParam = new URLSearchParams();
    if (page) searchParam.set("page", page + "");
    if (limit) searchParam.set("limit", limit + "");
    if (order) searchParam.set("order", order);
    if (name) searchParam.set("name", name);
    if (core) searchParam.set("core", core);
    if (status) searchParam.set("status", status);
    if (type) searchParam.set("type", type);
    if (fecha) searchParam.set("fecha", fecha);

    const url = `${API_URL}/minute/?` + searchParam.toString();
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.jwt}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async getAgreementsId(id: string, token: any) {
    try {
      const response = await fetch(`${API_URL}/agreements/${id}`, {
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
    }
  }
  async getAgreements(jwt: any) {
    try {
      const response = await fetch(`${API_URL}/agreements/minutes`, {
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
      console.error(error);
    }
  }

  async getAbscents(id: string, token: any) {
    try {
      const response = await fetch(`${API_URL}/minute/abscents/${id}`, {
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
    }
  }

  //obtener las actas recientes
  async getLatestMinute(token: any) {
    try {
      const response = await fetch(`${API_URL}/minute/latest`, {
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
    }
  }

  async getMinutes(token: any) {
    try {
      const response = await fetch(`${API_URL}/minute/dash`, {
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
    }
  }

  async getMinute(id: string, token: string) {
    try {
      const response = await fetch(`${API_URL}/minute/${id}`, {
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
    }
  }
}
