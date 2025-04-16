import type { AbsentCausesWithMilitante } from "@/interface/AbsentCausesWithMilitante";

const API_URL = 'https://part-back.onrender.com/militantes';

export default class MilitantService {
    async getAll() {
        try {
            const response = await fetch(`${API_URL}/`, {
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

    async getMilitantesByCore(id: number) {
        try {
            const response = await fetch(`${API_URL}/core/${id}`, {
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
            const response = await fetch(`${API_URL}/absent-causes/${month}/${year}`, {
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