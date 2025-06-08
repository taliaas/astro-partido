import {API_URL} from "astro:env/client";

export default class SolrService {
    async getAllMinutes(page: number, limit: number, query: any){
        try {
            const response = await fetch(`${API_URL}/indexing?page=${page}&limit=${limit}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(query)
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