import { API_URL } from "astro:env/client";


export default class OrdinaryService {

  async getMinute(id: string) {
    try {
      const response = await fetch(`${API_URL}/minutes-ordinary/${id}`, {
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
      const response = await fetch(`${API_URL}/minutes-ordinary`, {
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

  //obtener las actas recientes
  async getLatestMinute() {
    try {
      const response = await fetch(`${API_URL}/minutes-ordinary/latest`, {
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

  async getMinutesByCurrentMonth() {
    try {
      const response = await fetch(`${API_URL}/minutes-ordinary/byMonth`, {
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

  async getMinutesByStatus(status: any) {
    try {
      const response = await fetch(`${API_URL}/minutes-ordinary/pending/${status}`, {
        method: "GET",
        headers: {
          "Content-Type": "aplication/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status:  ${response.status}`);
      }
      return await response.json();
    } catch (e) {
      console.log(e);
    }
  }

  async getAttendance(month: number, year: number){
    try {
      const response = await fetch(`${API_URL}/minutes-ordinary/attendance/${month}/${year}`, {
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
      throw error;
    }
  }
}
