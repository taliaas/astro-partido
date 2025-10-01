import { sseStore } from "@/utils/see/store"
import type { MessageMapper } from "@/utils/see/types"
import { onMounted, onUnmounted } from "vue"


export function useSse<
    Event extends keyof MessageMapper,
    Data = MessageMapper[Event],
>(event: Event, listener: (data: Data) => void) {

    const middleware = (e: MessageEvent) => {
        let data
        try {
            data = JSON.parse(e.data)
        } catch {
            data = e.data
        }
        listener(data)
    }

    onMounted(() => {
        const sse = sseStore()
        sse.eventSource?.addEventListener(event, middleware)
    })
    onUnmounted(() => {
        const sse = sseStore()
        sse.eventSource?.removeEventListener(event, middleware)
    })
}