import { API_URL } from "astro:env/client";

export default class EventService {
  async getAllEvents(page: any, session: any) {
    const response = await fetch(`${API_URL}/event?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.jwt}`,
        }
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}