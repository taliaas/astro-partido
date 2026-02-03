import { API_URL } from "astro:env/client";

export default class SancionService {
    async getAll(page: number, limit: number, session: any) {  
        try {
            const response = await fetch(`${API_URL}/sancion?page=${page}&limit=${limit}`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.jwt}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
}