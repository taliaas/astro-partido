const API_URL = 'https://part-back.onrender.com/event';

export default class EventServices {
  async createEventF(createEvent: any, token: string) {
    console.log(JSON.stringify(createEvent));
    
    try {
      const response = await fetch(`${API_URL}/`, {
        method: "POST",
        body: JSON.stringify(createEvent),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  async getAllEventDate(fecha: any) {
    try {
      const response = await fetch(`${API_URL}/date/${fecha}`, {
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
