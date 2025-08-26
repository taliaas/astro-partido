import { defineStore, } from "pinia"

interface SseStore {
    eventSource: EventSource | null
}

const sseStore = defineStore("sse", {
    state: (): SseStore => ,
})