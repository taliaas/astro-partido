const API_URL = 'https://part-back.onrender.com/user'

export default class UserService {
  async getAllUser() {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`https://part-back.onrender.com/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },

      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al recuperar al usuario', error);
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    console.log(email)
    try {
      const response = await fetch(`https://part-back.onrender.com/user/data/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },

      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al recuperar al usuario', error);
      throw error;
    }
  }

  async updateUser(id: number, userData: { name: string, email: string }) {
    try {
      const response = await fetch(`https://part-back.onrender.com/user/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al actualizar al usuario', error);
      throw error;
    }
  }

  async removeUser(id: number) {
    console.log(id)
    try {
      const response = await fetch(`https://part-back.onrender.com/user/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },

      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al eliminar al usuario', error);
      throw error;
    }
  }
}