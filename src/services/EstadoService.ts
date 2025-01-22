export default class EstadoService {
    async getYear(anno: number) {
        try {
            const response = await fetch(`https://part-back.onrender.com/computo/calcular_estado/${anno}`, {
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