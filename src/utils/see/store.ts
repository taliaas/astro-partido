import { defineStore, } from "pinia"
import ReconnectingEventSource from "reconnecting-eventsource"

export const sseStore = defineStore("sse", {
    state: () => {
        const eventSource = new ReconnectingEventSource("/api/sse")
        eventSource.onerror = (e) => console.log(e)
        return { eventSource }
    }
})
