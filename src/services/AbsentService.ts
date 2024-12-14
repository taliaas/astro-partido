import type AbsentInterface from "@/interface/Absent";

export default class AbsentService {
    async getAllAbsent() {
        try {
            const response = await fetch(`https://part-back.onrender.com/absent`, {
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
    async getAbsent(id: number): Promise<AbsentInterface | undefined> {
        try {
            const response = await fetch(`https://part-back.onrender.com/absent/${id}`, {
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