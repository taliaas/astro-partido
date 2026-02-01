import { API_URL } from "astro:env/client";

export default class NotificationService {
  async getAll(page: number, limit: number, token: any) {
    try {
      const response = await fetch(
        `${API_URL}/notification/all?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error loading notifications for logged user:", error);
      throw error;
    }
  }
}
