const API_URL = "https://part-back.onrender.com/minutes";

export default class MinutesService{

    //cargar acta
    async upload(files: any[]){
        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(files)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }
}