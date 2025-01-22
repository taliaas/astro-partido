import type Minute from "@/interface/MinuteOrdinary";
import type { Status } from "@/enum/Status.ts";

 const API_URL = "https://part-back.onrender.com/minutes-ordinary";

export default class OrdinaryService {

  async createMinute(
    createMinutesOrdinaryDto: Minute,
    abscents: any[],
    invitados: any[],
    agreements: any[],
    extranjero: any[],
  ) {
    console.log("Acta:", createMinutesOrdinaryDto);
    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...createMinutesOrdinaryDto,
          abscents,
          invitados,
          agreements,
          extranjero,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error()
    }
  }

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

  async updateMinute(id: string, acta: any) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(acta),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async deleteMinute(id: string) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
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

  async updateStatusMinutes(id: string, status: Status) {
    try {
      const response = await fetch(`${API_URL}/status/${id}/${status}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  async uploadMinutes(file: any) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    }
    catch (e) {
      console.error(e)
    }
  }
}
