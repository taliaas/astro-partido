import type AbsentInterface from "@/interface/Absent";

export default class AbsentService {
    async getAll() {
        try {
            const response = await fetch(`https://part-back.onrender.com/attendance`, {
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
            console.log(error)
        }
    }
    async getAbsent(id: number) {
        try {
            const response = await fetch(`https://part-back.onrender.com/attendance/${id}`, {
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
            console.log(error)
        }
    }
}