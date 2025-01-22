const API_URL = 'https://part-back.onrender.com/notification';

export default class NotificationService{
    async getAll(email: string) {
        try {
            const response = await fetch(`${API_URL}/user/${email}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
}