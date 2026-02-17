import { API_URL } from "astro:env/client";

export default class TrasladoService {
  async getAll(page: any, limit: number, session: any) {
    try {
      const response = await fetch(
        `${API_URL}/transfer?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.jwt}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const a = await response.json();

      return a;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  async getMilitantsForTransfer(coreId: string, session: any): Promise<any[]> {
    try {
      const response = await fetch(
        `${API_URL}/transfer/militants-for-transfer/${coreId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.jwt}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo militantes para traslado:', error);
      throw error;
    }
  }
}
