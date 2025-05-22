const API_URL = "https://part-back.onrender.com/user";

export default class UserService {
  async getAllUser(page: number) {
    try {
      const response = await fetch(`${API_URL}/${page}`, {
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

  async getUser(id: string) {
    try {
      const response = await fetch(
          `${API_URL}/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al recuperar al usuario", error);
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    console.log(email);
    try {
      const response = await fetch(
        `${API_URL}/data/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al recuperar al usuario", error);
      throw error;
    }
  }

  async removeUser(id: number) {
    console.log(id);
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al eliminar al usuario", error);
      throw error;
    }
  }
}
