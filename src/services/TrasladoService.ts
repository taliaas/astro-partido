import {API_URL} from "astro:env/client";

export default class TrasladoService {
    async getAll(page: any, session: any) { 
        try {
            const response = await fetch(`${API_URL}/trasfer?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.jwt}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const a = await response.json();
           
            return a
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
}