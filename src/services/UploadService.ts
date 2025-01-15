const API_URL = 'https://part-back.onrender.com/upload/minute'

export default class UploadService {
    async uploadMinute(file: File, metadata: any) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('metadata', JSON.stringify(metadata));

            const response = await fetch(`https://part-back.onrender.com/upload/minute`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading minute:', error);
            throw error;
        }
    }

    async getUploadedMinute(id: string) {
        try {
            const response = await fetch(`https://part-back.onrender.com/upload/minute/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching uploaded minute:', error);
            throw error;
        }
    }

    async getAllUploadedMinutes() {
        try {
            const response = await fetch(`https://part-back.onrender.com/upload/minutes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching all uploaded minutes:', error);
            throw error;
        }
    }
}
