import {API_URL} from "astro:env/client";

export default class DeactivationService {
    async getAllDesactivation(){
        try {
            const response = await fetch(`${API_URL}/desactivation`, {
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
            console.error(error);
        }
    }

}