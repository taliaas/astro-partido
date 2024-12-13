import type Minute from "@/interface/MinutePolitical";

export default class PoliticalService {
     async createMinute(createMinutesPoliticalDto: Minute) {
            try {
                const response = await fetch(`http://https://part-back.onrender.com/minutes-political`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(createMinutesPoliticalDto)
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
                const response = await fetch(`http://https://part-back.onrender.com/minutes-political/${id}`, {
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
                const response = await fetch(`http://https://part-back.onrender.com/minutes-political`, {
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
                const response = await fetch(`http://https://part-back.onrender.com/minutes-political/${id}`, {
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
                const response = await fetch(`http://https://part-back.onrender.com/minutes-political/${id}`, {
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
    
}