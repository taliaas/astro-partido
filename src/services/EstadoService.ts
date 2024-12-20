export default class EstadoService {
    async getYear(anno: number, indicator: string) {
        try {
            const response = await fetch(`https://part-back.onrender.com/estado/${anno}/${indicator}`, {
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
    async getEstado(id: number) {
        try {
            const response = await fetch(`https://part-back.onrender.com/estado/${id}`, {
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