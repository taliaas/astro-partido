export default class UserService {
  async getAllUser() {
    try {
      const response = await fetch(`http://https://part-back.onrender.com/user`, {
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
    }
  }

  async getUser(id: string) {
    try {
      const response = await fetch(`http://https://part-back.onrender.com/user/${id}`, {
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
    }
  }

  async getUserByEmail(email: string) {
    try {
      const response = await fetch(`http://https://part-back.onrender.com/user/data/${email}`, {
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
    }
  }

  async updateUser(id: number, userData: { name: string, email: string }) {
    try {
      const response = await fetch(`http://https://part-back.onrender.com/user/${id}`, {
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
    }
  }

  async removeUser(id: number) {
    try {
      const response = await fetch(`http://https://part-back.onrender.com/user/${id}`, {
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
    }
  }
}