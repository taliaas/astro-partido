  import type Minute from "@/interface/MinutePolitical";
  import type MinutePolitical from "@/interface/MinutePolitical";
  import type {Status} from "@/enum/Status.ts";
  const API_URL = "https://part-back.onrender.com/minutes-political"

  export default class PoliticalService {
     async createMinute(createMinutesPoliticalDto: MinutePolitical) {
            try {
                const response = await fetch(`${API_URL}`, {
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
                const response = await fetch(`${API_URL}/${id}`, {
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
                const response = await fetch(`${API_URL}`, {
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
    
        async updateMinute(id: string, acta: any) {
         console.log(id,acta)
            try {
                const response = await fetch(`https://part-back.onrender.com/minutes-political/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(acta)
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
                const response = await fetch(`https://part-back.onrender.com/minutes-political/${id}`, {
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

        async getMinutesByCore(core: any, fecha: any){
            try {
                const response = await fetch(`${API_URL}/${core}/${fecha}`, {
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
    async updateStatusMinutes(id: string, status: Status){
        try {
            const response = await fetch(`${API_URL}/status/${id}/${status}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                }
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