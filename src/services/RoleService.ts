const API_URL = "https://part-back.onrender.com/roles";

export default class RoleService {
  async getRoles() {
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
      console.log("Entro")
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


}
