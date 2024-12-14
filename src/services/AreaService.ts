export default class AreaService {
    async createCore(areaData: { name: string }) {
        try {
            const response = await fetch(`https://part-back.onrender.com/area`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(areaData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async getAllArea() {
        try {
            const response = await fetch(`https://part-back.onrender.com/area`, {
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
            console.error('Error al cargar el area', error);
        }
    }

    async getArea(id: string) {
        try {
            const response = await fetch(`https://part-back.onrender.com/area/${id}`, {
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
            console.error('Error al cargar el area', error);
        }
    }

    async updateArea(id: string) {
        try {
            const response = await fetch(`https://part-back.onrender.com/area/${id}`, {
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
            console.error('Error al actualizar el area', error);
        }
    }

    async deleteArea(id: string) {
        try {
            const response = await fetch(`https://part-back.onrender.com/area/${id}`, {
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
            console.error('Error al eliminar el area', error);
        }
    }
}
