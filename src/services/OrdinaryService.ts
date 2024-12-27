import type Minute from "@/interface/MinuteOrdinary";

export default class OrdinaryService {
    async createMinute(createMinutesOrdinaryDto: Minute) {
        try {
            const response = await fetch(`https://part-back.onrender.com/minutes-ordinary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createMinutesOrdinaryDto)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }
    async getMinute(id: string) {
        try {
            const response = await fetch(`https://part-back.onrender.com/minutes-ordinary/${id}`, {
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
            console.error(error);
        }
    }
    async getAll() {
        try {
            const response = await fetch(`https://part-back.onrender.com/minutes-ordinary`, {
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
            console.error(error);
        }
    }

    async updateMinute(id: string) {
        try {
            const response = await fetch(`https://part-back.onrender.com/minutes-ordinary/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
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
    async deleteMinute(id: string) {
        try {
            const response = await fetch(`https://part-back.onrender.com/minutes-ordinary/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
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

    async getLatestMinute(){
        try {
            const response = await fetch(`https://part-back.onrender.com/minutes-ordinary/latest`, {
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
            console.error(error);
        }
    }
}