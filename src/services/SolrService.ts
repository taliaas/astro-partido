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
    async queryMinutes(query: string, start: number, limit: number, op: string){
        try {
            const response = await fetch(`${API_URL}/solr/search?start=${start}&rows=${limit}&q_op=${op}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(query)
            });
            console.log("Query",query)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const res = await response.json();
            console.log('Response', res)
            return res
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