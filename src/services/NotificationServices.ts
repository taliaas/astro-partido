import { API_URL } from 'astro:env/client';

export default class NotificationService {
    async getAll(email: any) {
        try {
            const response = await fetch(`${API_URL}/notification/user/${email}`, {
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