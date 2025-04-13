import type {AttendanceResponse} from "@/interface/Absent.ts";

const API_URL = 'https://part-back.onrender.com/minutes-ordinary/attendance';

export default class AttendanceService {

    async getAttendance(month: number, year: number) {
        try {
            const response = await fetch(`${API_URL}/${month}/${year}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json() as AttendanceResponse;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }


}