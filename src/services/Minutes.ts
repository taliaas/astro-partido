const API_URL = "http://104.225.141.171:2002/minutes";

export default class MinutesService {
  async getAllMinutes(type: string) {
    try {
      const response = await fetch(`${API_URL}/?type=${type}`, {
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
