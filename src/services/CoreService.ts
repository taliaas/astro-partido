import { API_URL } from "astro:env/client";

export default class CoreService {
  async createCore(coreData: { name: string }, areaData: any[], token: any) {
    try {
      const response = await fetch(`${API_URL}/core`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coreData, areaData: [areaData] }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async getAllCore(token?: string) {
    try {
      const response = await fetch(`${API_URL}/core/all`, {
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
      console.error("Error al cargar el nucleo", error);
    }
  }

  async getAllCoreByPage(page: number, token?: string) {
    try {
      const response = await fetch(`${API_URL}/core?page=${page}`, {
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
      console.error("Error al cargar el nucleo", error);
    }
  }

  async getCore(id: string, token: any) {
    try {
      const response = await fetch(`${API_URL}/core/${id}`, {
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
      console.error("Error al cargar el nucleo", error);
    }
  }

  async updateCore(id: string, token: any) {
    try {
      const response = await fetch(`${API_URL}/core/${id}`, {
        method: "PATCH",
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
      console.error("Error al actualizar el nucleo", error);
    }
  }

  async deleteCore(id: string, token: any) {
    try {
      const response = await fetch(`${API_URL}/core/${id}`, {
        method: "DELETE",
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
      console.error("Error al eliminar el nucleo", error);
    }
  }
}
