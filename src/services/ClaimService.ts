const API_URL = "https://part-back.onrender.com/claims";

export default class ClaimService {
    async getAllClaims() {
        try {
            const response = await fetch(`${API_URL}`, {
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