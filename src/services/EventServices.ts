const API_URL = 'https://part-back.onrender.com/event';

export default class EventServices {

    async createEventF(createEvent: any, token: string) {
        try {
            const response = await fetch(`${API_URL}/`, {
              method: "POST",
              body: createEvent,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json() ;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async getAllEventDate(fecha: any){
        try {
            const response = await fetch(`${API_URL}/date/${fecha}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
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