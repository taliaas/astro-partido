const API_URL = "https://part-back.onrender.com/minutes-ordinary";

export default class OrdinaryService {

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

  //obtener las actas recientes
  async getLatestMinute() {
    try {
      const response = await fetch(`${API_URL}/latest`, {
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
      const response = await fetch(`${API_URL}/byMonth`, {
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
      const response = await fetch(`${API_URL}/pending/${status}`, {
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
      const response = await fetch(`${API_URL}/attendance/${month}/${year}`, {
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
