import { API_URL } from "astro:env/client";

export default class ComiteService {
    async createCore(areaData: { name: string }) {
        try {
            const response = await fetch(`${API_URL}/comite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(areaData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async getAllComite() {
        try {
            const response = await fetch(`${API_URL}/comite`, {
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
            console.error('Error al cargar el area', error);
        }
    }
}
