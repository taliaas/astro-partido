const API_URL = 'https://part-back.onrender.com/notification';

export default class NotificationService {
    async getAll() {
        try {
            const email = 'marta0000@cujae.edu.cu'//localStorage.getItem('userEmail'); //tomar el email del localStorage
            const response = await fetch(`${API_URL}/user/${email}`, {
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
            console.error('Error loading notifications for logged user:', error);
            throw error;
        }
    }

}