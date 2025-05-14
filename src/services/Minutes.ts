const API_URL = "https://part-back.onrender.com/minutes";

export default class MinutesService{

    //cargar acta
    async uploadMinutes(files: any, tipo: string) {
        const file = new FormData();
        file.append("file", files);

        try {
            const response = await fetch(`https://part-back.onrender.com/minutes/upload?type=${tipo}`, {
                method: "POST",
                body: file
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        }
        catch (e) {
            console.error(e)
        }
    }

    async getAllMinutes(type: string){
        console.log("Actas", type)
        try {
            const response = await fetch(`${API_URL}/?type=${type}`, {
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