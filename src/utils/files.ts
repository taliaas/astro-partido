import { API_URL } from "astro:env/client";

export function getFile(minuteId: string) {
    return `${API_URL}/minutes/${minuteId}/file`
}