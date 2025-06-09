import {API_URL} from "astro:env/client";

export default class SolrService {
    async getAllMinutes(limit: number){
        try {
            const response = await fetch(`${API_URL}/solr/all?limit=${limit}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
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
    async queryMinutes(limit: number, query: string){//como paso la query
        try {
            const response = await fetch(`${API_URL}/solr?limit=${limit}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
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
    async advancedSearch(){
        try{
            const response = await fetch(`${API_URL}/solr`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        }
        catch(error){
            console.error(error)
        }
    }


}