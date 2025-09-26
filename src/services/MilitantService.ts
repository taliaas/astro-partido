import type { AbsentCausesWithMilitante } from "@/interface/AbsentCausesWithMilitante";
import { API_URL } from "astro:env/client";


export default class MilitantService {
    async getAll() {
        try {
            const response = await fetch(`${API_URL}/militantes/`, {
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
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async getMilitantes(session: any) {
        try {
            const response = await fetch(`${API_URL}/militantes/active/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async createMilitant(session: any, data: any) {
        try {
            const response = await fetch(`${API_URL}/militantes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + session?.jwt,
                },
                body: JSON.stringify(data),
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json()
        }
        catch (error) {
            console.log(error)
            throw new Error(String(error))
        }
    }

    async getMilitantesByCore(id: number, page: number) {
        try {
            const response = await fetch(`${API_URL}/militantes/core/${id}?page=${page}`, {
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
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async getAbsentCausesWithMilitante(month: number, year: number): Promise<AbsentCausesWithMilitante> {
        try {
            const response = await fetch(`${API_URL}/militantes/absent-causes/${month}/${year}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
}