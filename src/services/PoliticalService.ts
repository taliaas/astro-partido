
const API_URL = "https://part-back.onrender.com/minutes-political";

export default class PoliticalService {
  async getMinute(id: string) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
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
      console.error(error);
    }
  }

  async getAll() {
    try {
      const response = await fetch(`${API_URL}`, {
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
      console.error(error);
    }
  }

  async getMinutesByCore(core: any, fecha: any) {
    try {
      const response = await fetch(`${API_URL}/${core}/${fecha}`, {
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
      console.error(error);
    }
  }
}
