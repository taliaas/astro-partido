import type {Indicadores} from "@/interface/Indicadores.ts";

const API_URL = 'https://part-back.onrender.com/computo';

export default class ComputoService {
    async getAll() {
        try {
            const response = await fetch(`${API_URL}`,{
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
            const response = await fetch(`${API_URL}/calcular_computo/${id}`,{
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
            const response = await fetch(`${API_URL}/find/${month}/${year}`,{
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
            const response = await fetch(`${API_URL}/compare`,{
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

    async create(initialData: Indicadores){
        try {
            const response = await fetch(`${API_URL}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(initialData)
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