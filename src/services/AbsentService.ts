const API_URL = 'https://part-back.onrender.com/attendance';

export default class AbsentService {

    async getByDate(month: number, year: number) {
        try {
            const response = await fetch(`${API_URL}/${month}/${year}`);
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