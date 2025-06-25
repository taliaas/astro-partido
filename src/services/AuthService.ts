import { API_URL } from "astro:env/client";

export default class AuthService {
    async verify(token: string) {
        try {
            const response = await fetch(`${API_URL}/auth/verify`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}