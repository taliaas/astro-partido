import {API_URL} from "astro:env/client";

export default class DeactivationService {
    async getAllDesactivation(page: any, session: any){
        try {
            const response = await fetch(`${API_URL}/desactivation?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.jwt}`, 
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