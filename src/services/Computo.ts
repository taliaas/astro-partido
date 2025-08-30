import type { Indicadores } from "@/interface/Indicadores.ts";
import type { Indicators } from "@/utils/indicators";
import { API_URL } from "astro:env/client";

export default class ComputoService {
    async getAll(token?: string) {
        try {
            const response = await fetch(`${API_URL}/computo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
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

    async getCompareYears(token: string, key: keyof Indicators) {
        try {
            const response = await fetch(`${API_URL}/computo/compare_year_graphic/${key}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
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


    async getAllByCore(token?: string, fecha?: string) {
        const searchParams = new URLSearchParams()
        if(fecha) searchParams.set('fecha', fecha)
        try {
            const response = await fetch(`${API_URL}/computo/all?${searchParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
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

    async getCalcularComputo(id: string, session: any) {
        try {
            const response = await fetch(`${API_URL}/computo/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.jwt}`,
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
            const response = await fetch(`${API_URL}/computo/find/${month}/${year}`, {
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

    async getCompare() {
        try {
            const response = await fetch(`${API_URL}/computo/compare`, {
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

    async updateComputo(id: any, data: Indicadores) {
        try {
            const response = await fetch(`${API_URL}/computo/${id}`, {
                method: 'PATCH',
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

    async getNegativeIndicator() {
        try {
            const response = await fetch(`${API_URL}/computo/indicadores_alert`, {
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