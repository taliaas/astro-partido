import { API_URL } from 'astro:env/client';

export default class NotificationService {
    async getAll(user: any) {
        console.log(user.email)
        try {
            const response = await fetch(`${API_URL}/notification/user/${user.email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.jwt}`,
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