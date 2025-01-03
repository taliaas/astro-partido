const API_URL = 'https://part-back.onrender.com/computo';

export default class ComputoService {
    async getAll() {
        try {
            const response = await fetch(`${API_URL}`);
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

    async getByDate(month: number, year: number) {
        try {
            const response = await fetch(`${API_URL}/${month}/${year}`);
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

    async getCompare(){
        try {
            const response = await fetch(`${API_URL}/compare`);
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
}