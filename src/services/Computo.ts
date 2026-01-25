import type { Indicators } from "@/utils/indicators";
import { API_URL } from "astro:env/client";

export default class ComputoService {
  async getAll(
    month?: string,
    year?: string,
    indicator?: string,
    token?: string
  ) {
    const searchParam = new URLSearchParams();
    if (month) searchParam.set("month", month);
    if (year) searchParam.set("year", year);
    if (indicator) searchParam.set("indicator", indicator);
    const url = `${API_URL}/computo/indicator/?` + searchParam.toString();
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const res = await response.json();
      console.log("res", res);
      return res;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  async getAllComputo(
    month?: string,
    year?: string,
    indicator?: string,
    token?: string
  ) {
    const searchParam = new URLSearchParams();
    if (month) searchParam.set("month", month);
    if (year) searchParam.set("year", year);
    if (indicator) searchParam.set("indicator", indicator);
    const url = `${API_URL}/computo/indicator/?` + searchParam.toString();
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const res = await response.json();
      console.log("res", res);
      return res;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  async getCompareYears(token: string, key: keyof Indicators) {
    try {
      const response = await fetch(
        `${API_URL}/computo/compare_year_graphic/${key}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  async getAllByCore(year?: number, month?: number, token?: string) {
    try {
      const response = await fetch(
        `${API_URL}/computo/all?year=${year}&month=${month}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  async getComputo(id: string, session: any) {
    try {
      const response = await fetch(`${API_URL}/computo/minute/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.jwt}`,
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

  async getByDate(month: number, year: number) {
    try {
      const response = await fetch(`${API_URL}/computo/find/${month}/${year}`, {
        method: "GET",
        headers: {
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

  async getCompare() {
    try {
      const response = await fetch(`${API_URL}/computo/compare`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  async updateComputo(id: any, data: any) {
    try {
      const response = await fetch(`${API_URL}/computo/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw new Error();
    }
  }

  async getNegativeIndicator() {
    try {
      const response = await fetch(`${API_URL}/computo/indicadores_alert`, {
        method: "GET",
        headers: {
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
  async getYear(year: number, token: string) {
    try {
      const response = await fetch(`${API_URL}/computo/reports?year=${year}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }
}
