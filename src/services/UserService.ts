export default class UserService {
    async createCore(user: any) {
      
      try {
        const response = await fetch(`http://localhost:3000/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
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