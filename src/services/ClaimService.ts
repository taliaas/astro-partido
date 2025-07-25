import { API_URL } from 'astro:env/client';

export default class ClaimService {
    async getAllClaims(token:string) {
        try {
            const response = await fetch(`${API_URL}/claims/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al cargar el area', error);
        }
    }
}