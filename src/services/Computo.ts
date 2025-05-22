import type {Indicadores} from "@/interface/Indicadores.ts";
import { API_URL } from "astro:env/client";

export default class ComputoService {
    async getAll() {
        try {
            const response = await fetch(`${API_URL}/computo`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async getCalcularComputo(id: string) {
        try {
            const response = await fetch(`${API_URL}/computo/calcular_computo/${id}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async getByDate(month: number, year: number) {
        try {
            const response = await fetch(`${API_URL}/computo/find/${month}/${year}`,{
                method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async getCompare(){
        try {
            const response = await fetch(`${API_URL}/computo/compare`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async create(data: Indicadores){
        try {
            const response = await fetch(`${API_URL}/computo`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw new Error;
        }
    }

    async getNegativeIndicator(){
        try {
            const response = await fetch(`${API_URL}/computo/indicadores_alert`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
}