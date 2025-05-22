import type { AttendanceResponse } from "@/interface/Absent.ts";
import { API_URL } from "astro:env/client";

export default class AttendanceService {
  async getAttendance(month: number, year: number) {
    try {
      const response = await fetch(`${API_URL}/minutes-ordinary/attendance/${month}/${year}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return (await response.json()) as AttendanceResponse;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }
}
