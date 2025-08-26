import type { Status } from "@/enum/Status";
import { useUrlSearchParams } from "@vueuse/core";
import { API_URL } from "astro:env/client";

export default class MinutesService {
  async getAllMinutes(type?: string, page?: number, limit?: string, session?: any, order?: any, name?: string, core?: string, status?: string, fecha?: string) {
    const searchParam = new URLSearchParams()
    if (page) searchParam.set('page', page + '')
    if (limit) searchParam.set('limit', limit + '')
    if (order) searchParam.set('order', order)
    if (name) searchParam.set('name', name)
    if (core) searchParam.set('core', core)
    if (status) searchParam.set('status', status)
    if (type) searchParam.set('type', type)
    if (fecha) searchParam.set('fecha', fecha)

    const url = `${API_URL}/minutes/?` + searchParam.toString()
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

  //obtener las actas recientes
  async getLatestMinute(token: any) {
    try {
      const response = await fetch(`${API_URL}/minutes/latest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
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
      const response = await fetch(`${API_URL}/minutes/dash`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
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
      const response = await fetch(`${API_URL}/minutes/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
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
